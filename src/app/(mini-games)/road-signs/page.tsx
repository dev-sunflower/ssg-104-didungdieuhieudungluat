"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Question, GameSession } from "@/lib/types/database";
import type { GamePhase } from "./_lib/gameTypes";
import { useFrameAnimation } from "./_hooks/useFrameAnimation";
import NameEntryScreen from "./_components/NameEntryScreen";
import GameScreen from "./_components/GameScreen";
import QuestionModal from "./_components/QuestionModal";
import ResultScreen from "./_components/ResultScreen";
import Leaderboard from "./_components/Leaderboard";

const HEARTS_START = 5;
const NORMAL_WRONGS_PER_HEART = 5;
const FRAME_COUNT = 8;
const FPS = 12;

export default function RoadSignsPage() {
  const supabase = createClient();

  // ── Game state ──────────────────────────────────────────────────────
  const [phase, setPhase] = useState<GamePhase>("name-entry");
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(HEARTS_START);
  const [wrongNormalCount, setWrongNormalCount] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<GameSession[]>([]);

  // Refs to read latest values inside callbacks without stale closures
  const heartsRef = useRef(hearts);
  const wrongNormalRef = useRef(wrongNormalCount);
  const scoreRef = useRef(score);
  const questionsAnsweredRef = useRef(questionsAnswered);
  const playerNameRef = useRef(playerName);
  heartsRef.current = hearts;
  wrongNormalRef.current = wrongNormalCount;
  scoreRef.current = score;
  questionsAnsweredRef.current = questionsAnswered;
  playerNameRef.current = playerName;

  // ── Animation ───────────────────────────────────────────────────────
  const handleAnimationComplete = useCallback(() => {
    setPhase((prev) => {
      if (prev === "animating-red") return "question-open";
      if (prev === "animating-green") return "animating-drive";
      if (prev === "animating-drive") return "animating-red";
      return prev;
    });
  }, []);

  const { frame, play, pause, reset } = useFrameAnimation(
    FRAME_COUNT,
    FPS,
    handleAnimationComplete,
  );

  // Drive play/pause/reset from phase changes
  useEffect(() => {
    if (
      phase === "animating-red" ||
      phase === "animating-green" ||
      phase === "animating-drive"
    ) {
      reset();
      const t = setTimeout(() => play(), 50);
      return () => clearTimeout(t);
    }
    if (phase === "question-open") {
      pause();
    }
  }, [phase, play, pause, reset]);

  // Advance question index each time a new red cycle begins
  const prevPhaseRef = useRef<GamePhase>("name-entry");
  useEffect(() => {
    if (
      phase === "animating-red" &&
      prevPhaseRef.current === "animating-drive" &&
      questions.length > 0
    ) {
      setQIndex((i) => (i + 1) % questions.length);
    }
    prevPhaseRef.current = phase;
  }, [phase, questions.length]);

  // ── Data fetching ───────────────────────────────────────────────────
  const loadQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    const { data } = await supabase.from("questions").select("*");
    if (data && data.length > 0) {
      setQuestions([...data].sort(() => Math.random() - 0.5));
    }
    setLoadingQuestions(false);
  }, [supabase]);

  const fetchLeaderboard = useCallback(async () => {
    const { data } = await supabase
      .from("game_sessions")
      .select("*")
      .order("score", { ascending: false })
      .limit(10);
    if (data) setLeaderboard(data);
  }, [supabase]);

  // Preload all animation frames on mount so playback is smooth
  useEffect(() => {
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const padded = String(i).padStart(4, "0");
      [
        `/3dassets/animations/green_light/drive_green${padded}.png`,
        `/3dassets/animations/red_light/drive_red${padded}.png`,
        `/3dassets/animations/normally_drive/normally_drive${padded}.png`,
      ].forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, []);

  // Fetch leaderboard on mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // ── Game actions ────────────────────────────────────────────────────
  const handleStart = useCallback(
    async (name: string) => {
      setPlayerName(name);
      await loadQuestions();
      setScore(0);
      setHearts(HEARTS_START);
      setWrongNormalCount(0);
      setQuestionsAnswered(0);
      setQIndex(0);
      setSessionId(null);
      setPhase("animating-red");
    },
    [loadQuestions],
  );

  const handleAnswer = useCallback(
    async (isCorrect: boolean) => {
      const currentQ = questions[qIndex];
      const isCritical = currentQ?.is_critical ?? false;
      const newAnswered = questionsAnsweredRef.current + 1;
      setQuestionsAnswered(newAnswered);

      if (isCorrect) {
        setScore((s) => s + (isCritical ? 20 : 5));
        setPhase("animating-green");
        return;
      }

      // Wrong answer — calculate heart loss
      let newHearts = heartsRef.current;
      if (isCritical) {
        newHearts -= 1;
      } else {
        const newWrong = wrongNormalRef.current + 1;
        setWrongNormalCount(newWrong);
        if (newWrong % NORMAL_WRONGS_PER_HEART === 0) {
          newHearts -= 1;
        }
      }
      setHearts(newHearts);

      if (newHearts <= 0) {
        const { data } = await supabase
          .from("game_sessions")
          .insert({
            player_name: playerNameRef.current,
            score: scoreRef.current,
            questions_answered: newAnswered,
            hearts_remaining: 0,
          })
          .select("id")
          .single();
        if (data) setSessionId(data.id);
        await fetchLeaderboard();
        setPhase("game-over");
      } else {
        // Remove wrong question from pool, pick a random different one
        setQuestions((prev) => {
          const filtered = prev.filter((_, idx) => idx !== qIndex);
          if (filtered.length === 0) return prev; // safety: keep at least 1
          const nextIdx = Math.floor(Math.random() * filtered.length);
          setQIndex(nextIdx);
          return filtered;
        });
        setPhase("animating-red");
      }
    },
    [questions, qIndex, supabase, fetchLeaderboard],
  );

  const handleRestart = useCallback(() => {
    setPhase("name-entry");
  }, []);

  // ── Render ──────────────────────────────────────────────────────────
  function renderLeft() {
    if (phase === "name-entry") {
      return <NameEntryScreen onStart={handleStart} loading={loadingQuestions} />;
    }
    if (phase === "game-over") {
      return (
        <ResultScreen
          score={score}
          questionsAnswered={questionsAnswered}
          heartsRemaining={hearts}
          sessionId={sessionId}
          leaderboard={leaderboard}
          onRestart={handleRestart}
        />
      );
    }
    return (
      <div className="relative">
        <GameScreen phase={phase} frame={frame} score={score} hearts={hearts} />
        {phase === "question-open" && questions[qIndex] && (
          <QuestionModal question={questions[qIndex]} onAnswer={handleAnswer} />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
      <div>{renderLeft()}</div>
      <div className="lg:sticky lg:top-6 lg:self-start">
        <Leaderboard entries={leaderboard} highlightId={sessionId ?? undefined} />
      </div>
    </div>
  );
}
