"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
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
} from "react-icons/lu";

function ExamContent() {
  const supabase = createClient();

  const [a1Type, setA1Type] = useState<LicenseType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

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
      setStarted(true);
    }
    setLoading(false);
  }, [supabase, a1Type]);

  const handleAnswer = (key: string) => {
    setAnswers((prev) => ({ ...prev, [questions[currentIndex].id]: key }));
  };

  // ── RESULTS ────────────────────────────────────────────────
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
        <Card
          className={`overflow-hidden shadow-whisper ${passed ? "border border-brand" : "border border-crimson"}`}
        >
          <div className={`h-2 ${passed ? "bg-brand" : "bg-crimson"}`} />
          <Card.Content className="p-6 text-center">
            <div className="flex justify-center mb-3">
              {passed
                ? <LuPartyPopper size={56} className="text-brand" />
                : <LuFrown size={56} className="text-crimson" />
              }
            </div>
            <h2
              className={`heading-sub text-[1.5rem] ${passed ? "text-brand" : "text-crimson"}`}
            >
              {passed ? "ĐẠT — Chúc mừng!" : "CHƯA ĐẠT"}
            </h2>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-4xl font-medium text-text-primary font-serif">
                  {correct}/{questions.length}
                </div>
                <div className="text-xs text-text-tertiary mt-0.5">
                  Số câu đúng
                </div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div
                  className={`text-4xl font-medium font-serif ${pct >= 80 ? "text-brand" : pct >= 60 ? "text-coral" : "text-crimson"}`}
                >
                  {pct}%
                </div>
                <div className="text-xs text-text-tertiary mt-0.5">Điểm số</div>
              </div>
            </div>

            {hasCriticalFail && (
              <div className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-crimson/10 text-crimson text-sm font-medium border border-crimson/20">
                <LuTriangleAlert size={15} />
                Sai câu điểm liệt — tự động trượt
              </div>
            )}

            <p className="text-sm text-text-tertiary mt-3">
              Yêu cầu: {a1Type?.pass_score}/{a1Type?.total_questions} câu
            </p>
          </Card.Content>
        </Card>

        <h3 className="heading-feature text-text-primary">Xem lại đáp án</h3>
        {questions.map((q, i) => (
          <div key={q.id}>
            <p className="text-xs text-text-tertiary mb-2 font-mono">
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
          className="bg-brand text-ivory font-medium py-3.5 rounded-xl hover:bg-brand-hover transition-colors flex items-center justify-center gap-2"
        >
          <LuRotateCcw size={15} />
          Thi lại
        </Button>
      </div>
    );
  }

  // ── SETUP ─────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="heading-sub-sm text-text-primary">Thi thử sát hạch</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            Bằng lái hạng A1 — Xe máy dưới 175cc
          </p>
        </div>

        <Card className="border border-border bg-bg-card shadow-whisper">
          <Card.Content className="p-5 flex flex-col gap-4">
            {a1Type ? (
              <div className="flex gap-3 p-3 bg-bg-subtle rounded-xl border border-border">
                <Chip
                  size="sm"
                  className="bg-warm-sand text-brand font-medium border border-border-strong flex items-center gap-1"
                >
                  <LuClipboard size={12} />
                  {a1Type.total_questions} câu
                </Chip>
                <Chip
                  size="sm"
                  className="bg-warm-sand text-text-primary font-medium border border-border-strong flex items-center gap-1"
                >
                  <LuTarget size={12} />
                  Đạt {a1Type.pass_score}/{a1Type.total_questions}
                </Chip>
              </div>
            ) : (
              <div className="h-10 rounded-xl bg-bg-subtle animate-pulse" />
            )}

            <Button
              fullWidth
              isDisabled={!a1Type || loading}
              onPress={startExam}
              className="bg-brand text-ivory font-medium py-3.5 rounded-xl disabled:opacity-50 hover:bg-brand-hover transition-colors"
            >
              {loading ? <Spinner size="sm" /> : "Bắt đầu thi →"}
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  // ── IN PROGRESS ───────────────────────────────────────────
  const answered = Object.keys(answers).length;
  const current = questions[currentIndex];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="heading-feature text-text-primary">
          Đề thi <span className="text-brand">A1</span>
        </h1>
        <Chip
          size="sm"
          className="bg-bg-subtle border border-border text-text-secondary font-medium"
        >
          {answered}/{questions.length} đã trả lời
        </Chip>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1.5 min-w-max">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              title={`Câu ${i + 1}`}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all touch-manipulation ${
                i === currentIndex
                  ? "bg-brand text-ivory scale-110"
                  : answers[q.id]
                    ? "bg-warm-sand text-brand border border-border-strong"
                    : "bg-bg-subtle text-text-tertiary border border-border"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <QuestionCard
        question={current}
        selectedAnswer={answers[current.id] ?? null}
        onAnswer={handleAnswer}
        showResult={false}
      />

      <div className="flex gap-3 sticky bottom-20 md:bottom-4 bg-bg-page/90 backdrop-blur-sm py-3 -mx-4 px-4">
        <Button
          fullWidth
          variant="outline"
          isDisabled={currentIndex <= 0}
          onPress={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          className="rounded-xl py-3 border-border text-text-secondary disabled:opacity-40"
        >
          ← Trước
        </Button>
        {currentIndex < questions.length - 1 ? (
          <Button
            fullWidth
            onPress={() => setCurrentIndex((i) => i + 1)}
            className="rounded-xl py-3 bg-brand text-ivory hover:bg-brand-hover transition-colors"
          >
            Tiếp →
          </Button>
        ) : (
          <Button
            fullWidth
            onPress={() => setSubmitted(true)}
            className="rounded-xl py-3 bg-brand text-ivory hover:bg-brand-hover transition-colors font-medium"
          >
            Nộp bài
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      }
    >
      <ExamContent />
    </Suspense>
  );
}
