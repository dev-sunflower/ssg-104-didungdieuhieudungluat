"use client";

import { useState, useRef } from "react";
import { Button, Card, Chip } from "@heroui/react";
import type { Question } from "@/lib/types/database";

interface FlashCardProps {
  question: Question;
  onNext: () => void;
  onPrev: () => void;
  current: number;
  total: number;
}

const SWIPE_THRESHOLD = 50; // px

export default function FlashCard({
  question,
  onNext,
  onPrev,
  current,
  total,
}: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const correctOption = question.options.find(
    (o) => o.key === question.correct_answer,
  );
  const progress = (current / total) * 100;

  // ── Swipe detection ─────────────────────────────────────────────────
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  // Track whether this touch moved enough to be a swipe (so tap-to-flip still works)
  const isSwiping = useRef(false);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }

  function handleTouchMove(e: React.TouchEvent) {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > 10 || dy > 10) isSwiping.current = true;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!isSwiping.current) return; // short tap → let onClick handle flip
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(dx) >= Math.abs(dy)) {
      // Horizontal swipe → navigate
      if (dx < -SWIPE_THRESHOLD && current < total) {
        setFlipped(false);
        onNext();
      } else if (dx > SWIPE_THRESHOLD && current > 1) {
        setFlipped(false);
        onPrev();
      }
    } else {
      // Vertical swipe → flip card
      if (Math.abs(dy) >= SWIPE_THRESHOLD) {
        setFlipped((f) => !f);
      }
    }
  }

  return (
    <div className="flex w-full flex-col gap-5 overflow-clip">
      {/* Progress header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-text-primary">
            {current}
            <span className="font-normal text-text-tertiary">/{total}</span>
          </span>
          {question.is_critical && (
            <Chip
              size="sm"
              className="border border-crimson/20 bg-crimson/10 text-[10px] font-medium text-crimson"
            >
              ⚠ Điểm liệt
            </Chip>
          )}
          {question.topic && (
            <Chip
              size="sm"
              className="border border-[#1E1E1E]/10 bg-[#FFF4D6] text-[10px] text-text-tertiary"
            >
              {question.topic}
            </Chip>
          )}
        </div>
        <span className="shrink-0 text-xs font-medium text-[#1E1E1E]/65">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-[#1E1E1E]/10">
        <div
          className="h-full rounded-full bg-[#F4A616] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card — touch handlers here so the whole card is swipeable */}
      <div
        className="flashcard-scene min-h-[380px] w-full cursor-pointer select-none md:min-h-[460px]"
        onClick={() => {
          // Only flip on tap, not at the end of a swipe gesture
          if (!isSwiping.current) setFlipped((f) => !f);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flashcard-inner ${flipped ? "flipped" : ""}`}
          style={{ minHeight: "inherit" }}
        >
          {/* Front */}
          <Card className="flashcard-face overflow-hidden rounded-3xl border border-[#1E1E1E]/10 bg-white shadow-[0_14px_36px_rgba(30,30,30,0.08)]">
            <div className="h-1.5 bg-[#F4A616]" />
            <Card.Content className="flex h-full flex-col justify-between p-6 md:p-10">
              <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
                {question.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={question.image_url}
                    alt="Hình ảnh câu hỏi"
                    className="mx-auto max-h-40 rounded-2xl bg-[#FFFCF2] object-contain shadow-sm"
                  />
                )}
                <div className="space-y-2">
                  {question.question_number && (
                    <p className="text-xs font-bold tracking-wider text-[#F4A616] uppercase">
                      Câu #{question.question_number}
                    </p>
                  )}
                  <p className="text-lg font-bold leading-relaxed text-text-primary md:text-2xl">
                    {question.content}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 border-t border-[#1E1E1E]/10 pt-4 text-xs text-text-tertiary">
                Nhấn để xem đáp án
              </div>
            </Card.Content>
          </Card>

          {/* Back */}
          <Card className="flashcard-face flashcard-back overflow-hidden rounded-3xl border border-[#1E1E1E]/10 bg-white shadow-[0_14px_36px_rgba(30,30,30,0.08)]">
            <div className="h-1.5 bg-[#4ECDC4]" />
            <Card.Content className="flex h-full flex-col justify-between p-6 md:p-10">
              <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
                <div className="flex flex-col items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#4ECDC4] text-lg font-bold text-white shadow-lg shadow-[#4ECDC4]/20">
                    {question.correct_answer}
                  </span>
                  <p className="text-lg font-bold leading-relaxed text-text-primary md:text-2xl">
                    {correctOption?.text}
                  </p>
                </div>
                {question.explanation && (
                  <div className="max-w-md rounded-2xl border border-[#1E1E1E]/10 bg-[#FFF4D6] p-5 text-sm leading-relaxed text-text-secondary shadow-sm">
                    💡 {question.explanation}
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 border-t border-[#1E1E1E]/10 pt-4 text-xs text-text-tertiary">
                Nhấn để quay lại câu hỏi
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Mobile swipe hint — only shown on touch devices */}
      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#1E1E1E]/35 md:hidden">
        <span>←</span>
        <span>Vuốt trái / phải để chuyển thẻ</span>
        <span>→</span>
      </p>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <Button
          fullWidth
          variant="outline"
          isDisabled={current <= 1}
          onPress={() => {
            setFlipped(false);
            onPrev();
          }}
          className="rounded-2xl border-[#1E1E1E]/15 py-3 text-text-secondary disabled:opacity-40"
        >
          Trước
        </Button>
        <Button
          fullWidth
          isDisabled={current >= total}
          onPress={() => {
            setFlipped(false);
            onNext();
          }}
          className="rounded-2xl bg-[#F4A616] py-3 text-[#1E1E1E] hover:bg-[#e59b11] disabled:opacity-40"
        >
          Tiếp theo
        </Button>
      </div>
    </div>
  );
}
