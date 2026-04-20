"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { Button, Card, Chip, Spinner } from "@heroui/react";
import QuestionCard from "@/components/ui/QuestionCard";
import { createClient } from "@/lib/supabase/client";
import type { LicenseType, Question } from "@/lib/types/database";
import {
  LuPartyPopper,
  LuFrown,
  LuTriangleAlert,
  LuRotateCcw,
  LuClipboard,
  LuTarget,
  LuTimer,
} from "react-icons/lu";

const EXAM_SECONDS = 19 * 60;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function ExamContent() {
  const supabase = createClient();

  const [a1Type, setA1Type] = useState<LicenseType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    supabase
      .from("license_types")
      .select("*")
      .eq("code", "A1")
      .single()
      .then(({ data }) => {
        if (data) setA1Type(data);
      });
  }, [supabase]);

  // Countdown timer
  useEffect(() => {
    if (!started || submitted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, submitted]);

  const startExam = useCallback(async () => {
    if (!a1Type) return;
    setLoading(true);
    const { data } = await supabase
      .from("questions")
      .select("*, license_types(*)")
      .eq("license_type_id", a1Type.id)
      .limit(a1Type.total_questions);
    if (data) {
      setQuestions([...data].sort(() => Math.random() - 0.5));
      setAnswers({});
      setCurrentIndex(0);
      setSubmitted(false);
      setTimeLeft(EXAM_SECONDS);
      setStarted(true);
    }
    setLoading(false);
  }, [supabase, a1Type]);

  const handleAnswer = (key: string) => {
    setAnswers((prev) => ({ ...prev, [questions[currentIndex].id]: key }));
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
  };

  // ── Results screen ─────────────────────────────────────────────────
  if (submitted) {
    const correct = questions.filter(
      (q) => answers[q.id] === q.correct_answer,
    ).length;
    const hasCriticalFail = questions.some(
      (q) =>
        q.is_critical && answers[q.id] && answers[q.id] !== q.correct_answer,
    );
    const passed = !hasCriticalFail && !!a1Type && correct >= a1Type.pass_score;
    const pct = Math.round((correct / questions.length) * 100);

    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-3xl border border-[#1E1E1E]/10 bg-[linear-gradient(145deg,#FFF4D6_0%,#FFE8A8_100%)] p-5 md:p-6">
          <h1
            className="text-2xl font-extrabold text-[#1E1E1E] md:text-3xl"
            style={{ fontFamily: "var(--font-caveat)" }}
          >
            Thi thử sát hạch
          </h1>
        </div>

        <Card
          className={`overflow-hidden rounded-3xl border bg-white shadow-[0_14px_34px_rgba(30,30,30,0.09)] ${passed ? "border-[#4ECDC4]" : "border-crimson/50"}`}
        >
          <div className={`h-2 ${passed ? "bg-[#4ECDC4]" : "bg-crimson"}`} />
          <Card.Content className="p-6 text-center">
            <div className="mb-3 flex justify-center">
              {passed ? (
                <LuPartyPopper size={56} className="text-[#4ECDC4]" />
              ) : (
                <LuFrown size={56} className="text-crimson" />
              )}
            </div>
            <h2
              className={`text-2xl font-extrabold ${passed ? "text-[#1E1E1E]" : "text-crimson"}`}
            >
              {passed ? "ĐẠT - Chúc mừng!" : "CHƯA ĐẠT"}
            </h2>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="text-center">
                <div
                  className="text-4xl text-text-primary"
                  style={{ fontFamily: "var(--font-caveat)" }}
                >
                  {correct}/{questions.length}
                </div>
                <div className="mt-0.5 text-xs text-text-tertiary">
                  Số câu đúng
                </div>
              </div>
              <div className="h-12 w-px bg-[#1E1E1E]/10" />
              <div className="text-center">
                <div
                  className={`text-4xl ${pct >= 80 ? "text-[#4ECDC4]" : pct >= 60 ? "text-[#F4A616]" : "text-crimson"}`}
                  style={{ fontFamily: "var(--font-caveat)" }}
                >
                  {pct}%
                </div>
                <div className="mt-0.5 text-xs text-text-tertiary">Điểm số</div>
              </div>
            </div>
            {hasCriticalFail && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-crimson/20 bg-crimson/10 px-4 py-2.5 text-sm font-medium text-crimson">
                <LuTriangleAlert size={15} /> Sai câu điểm liệt - tự động trượt
              </div>
            )}
            <p className="mt-3 text-sm text-text-tertiary">
              Yêu cầu: {a1Type?.pass_score}/{a1Type?.total_questions} câu
            </p>
          </Card.Content>
        </Card>

        <h3 className="text-xl font-bold text-[#1E1E1E]">Xem lại đáp án</h3>
        {questions.map((q, i) => (
          <div key={q.id}>
            <p className="mb-2 text-xs font-mono text-text-tertiary">
              Câu {i + 1}
            </p>
            <QuestionCard
              question={q}
              selectedAnswer={answers[q.id] ?? null}
              onAnswer={() => {}}
              showResult
            />
          </div>
        ))}

        <Button
          fullWidth
          onPress={() => {
            setStarted(false);
            setSubmitted(false);
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#F4A616] py-3.5 font-medium text-[#1E1E1E] hover:bg-[#e59b11]"
        >
          <LuRotateCcw size={15} /> Thi lại
        </Button>
      </div>
    );
  }

  // ── Start screen ───────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-3xl border border-[#1E1E1E]/10 bg-[linear-gradient(145deg,#FFF4D6_0%,#FFE8A8_100%)] p-5 md:p-6">
          <h1
            className="text-2xl font-extrabold text-[#1E1E1E] md:text-3xl"
            style={{ fontFamily: "var(--font-caveat)" }}
          >
            Thi thử sát hạch
          </h1>
          <p className="mt-1 text-sm text-[#1E1E1E]/75">
            Bằng lái hạng A1 - Xe máy dưới 175cc
          </p>
        </div>

        <Card className="rounded-3xl border border-[#1E1E1E]/10 bg-white shadow-[0_12px_30px_rgba(30,30,30,0.08)]">
          <Card.Content className="flex flex-col gap-4 p-5">
            {a1Type ? (
              <div className="flex gap-3 rounded-2xl border border-[#1E1E1E]/10 bg-[#FFF4D6] p-3">
                <Chip
                  size="sm"
                  className="flex items-center gap-1 border border-[#F4A616]/50 bg-white font-medium text-[#1E1E1E]"
                >
                  <LuClipboard size={12} /> {a1Type.total_questions} câu
                </Chip>
                <Chip
                  size="sm"
                  className="flex items-center gap-1 border border-[#1E1E1E]/10 bg-white font-medium text-text-primary"
                >
                  <LuTarget size={12} /> Đạt {a1Type.pass_score}/
                  {a1Type.total_questions}
                </Chip>
                <Chip
                  size="sm"
                  className="flex items-center gap-1 border border-[#1E1E1E]/10 bg-white font-medium text-text-primary"
                >
                  <LuTimer size={12} /> 19 phút
                </Chip>
              </div>
            ) : (
              <div className="h-10 animate-pulse rounded-xl bg-[#1E1E1E]/8" />
            )}
            <Button
              fullWidth
              isDisabled={!a1Type || loading}
              onPress={startExam}
              className="rounded-2xl bg-[#F4A616] py-3.5 font-medium text-[#1E1E1E] hover:bg-[#e59b11] disabled:opacity-50"
            >
              {loading ? <Spinner size="sm" /> : "Bắt đầu thi"}
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  // ── Active exam — two-column layout ────────────────────────────────
  const answered = Object.keys(answers).length;
  const current = questions[currentIndex];
  const isLowTime = timeLeft < 180;

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile: compact timer bar */}
      <div className="flex items-center justify-between md:hidden">
        <h1 className="text-xl font-bold text-[#1E1E1E]">
          Đề thi <span className="text-[#F4A616]">A1</span>
        </h1>
        <div
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-bold ${isLowTime ? "border-red-200 bg-red-50 text-red-500" : "border-[#F4A616]/30 bg-[#FFF4D6] text-[#1E1E1E]"}`}
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          <LuTimer size={14} /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* Mobile: horizontal scroll question grid */}
      <div className="overflow-x-auto pb-1 md:hidden">
        <div className="flex min-w-max gap-1.5">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              title={`Câu ${i + 1}`}
              className={`h-8 w-8 rounded-lg text-xs font-medium transition-all touch-manipulation ${
                i === currentIndex
                  ? "scale-110 bg-[#F4A616] text-[#1E1E1E]"
                  : answers[q.id]
                    ? "border border-[#F4A616]/40 bg-[#FFF4D6] text-[#1E1E1E]"
                    : "border border-[#1E1E1E]/14 bg-white text-text-tertiary"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: two-column */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[280px_1fr]">
        {/* ── Left sidebar (desktop only) ── */}
        <div className="hidden md:flex flex-col gap-4">
          {/* Timer */}
          <div
            className={`rounded-2xl border p-4 text-center ${isLowTime ? "border-red-200 bg-red-50" : "border-[#F4A616]/30 bg-[#FFF4D6]"}`}
          >
            <p className="mb-1 text-xs font-medium text-[#1E1E1E]/50 uppercase tracking-wider">
              Thời gian còn lại
            </p>
            <p
              className={`text-5xl font-bold ${isLowTime ? "text-red-500" : "text-[#1E1E1E]"}`}
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              {formatTime(timeLeft)}
            </p>
          </div>

          {/* Question index grid */}
          <div className="rounded-2xl border border-[#1E1E1E]/10 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-[#1E1E1E]/50">
                {answered}/{questions.length} đã trả lời
              </p>
              {questions.some((q) => q.is_critical) && (
                <span className="flex items-center gap-1 text-[10px] text-crimson/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-crimson inline-block" />{" "}
                  Điểm liệt
                </span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  title={`Câu ${i + 1}`}
                  className={`relative h-9 w-full rounded-lg text-xs font-medium transition-all touch-manipulation ${
                    i === currentIndex
                      ? "bg-[#F4A616] text-[#1E1E1E] scale-105"
                      : answers[q.id]
                        ? "border border-[#F4A616]/40 bg-[#FFF4D6] text-[#1E1E1E]"
                        : "border border-[#1E1E1E]/14 bg-white text-text-tertiary hover:bg-[#FFF9F0]"
                  }`}
                >
                  {i + 1}
                  {q.is_critical && (
                    <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-crimson" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            fullWidth
            onPress={handleSubmit}
            className="rounded-2xl bg-[#F4A616] py-3 font-medium text-[#1E1E1E] hover:bg-[#e59b11]"
          >
            Nộp bài
          </Button>
        </div>

        {/* ── Right content ── */}
        <div className="flex flex-col gap-4">
          <QuestionCard
            question={current}
            selectedAnswer={answers[current.id] ?? null}
            onAnswer={handleAnswer}
            showResult={false}
          />

          <div className="flex gap-3">
            <Button
              fullWidth
              variant="outline"
              isDisabled={currentIndex <= 0}
              onPress={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
              className="rounded-2xl border-[#1E1E1E]/15 py-3 text-text-secondary disabled:opacity-40"
            >
              Trước
            </Button>
            {currentIndex < questions.length - 1 ? (
              <Button
                fullWidth
                onPress={() => setCurrentIndex((i) => i + 1)}
                className="rounded-2xl bg-[#F4A616] py-3 text-[#1E1E1E] hover:bg-[#e59b11]"
              >
                Tiếp
              </Button>
            ) : (
              <Button
                fullWidth
                onPress={handleSubmit}
                className="rounded-2xl bg-[#F4A616] py-3 font-medium text-[#1E1E1E] hover:bg-[#e59b11] md:hidden"
              >
                Nộp bài
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <ExamContent />
    </Suspense>
  );
}
