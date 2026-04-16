'use client'

import { useState } from 'react'
import { Button, Card, Chip } from '@heroui/react'
import type { Question } from '@/lib/types/database'

interface FlashCardProps {
  question: Question
  onNext: () => void
  onPrev: () => void
  current: number
  total: number
}

export default function FlashCard({ question, onNext, onPrev, current, total }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false)
  const correctOption = question.options.find(o => o.key === question.correct_answer)
  const progress = (current / total) * 100

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Progress row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-text-primary">
            {current}<span className="font-normal text-text-tertiary">/{total}</span>
          </span>
          {question.is_critical && (
            <Chip size="sm" className="bg-crimson/10 border border-crimson/20 text-crimson text-[10px] font-medium">
              ⚠ Điểm liệt
            </Chip>
          )}
          {question.topic && (
            <Chip size="sm" className="bg-bg-subtle border border-border text-text-tertiary text-[10px]">
              {question.topic}
            </Chip>
          )}
        </div>
        <span className="text-xs text-text-tertiary shrink-0">{Math.round(progress)}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-bg-subtle rounded-full overflow-hidden">
        <div
          className="h-full bg-brand rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 3D card */}
      <div
        className="w-full min-h-[280px] md:min-h-[320px] cursor-pointer select-none flashcard-scene"
        onClick={() => setFlipped(f => !f)}
      >
        <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`} style={{ minHeight: 'inherit' }}>

          {/* Front */}
          <Card className="flashcard-face shadow-whisper border border-border bg-bg-card overflow-hidden">
            <div className="h-1 bg-brand" />
            <Card.Content className="p-5 md:p-7 flex flex-col justify-between h-full">
              <div className="flex-1 flex flex-col justify-center gap-4">
                {question.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={question.image_url}
                    alt="Hình ảnh câu hỏi"
                    className="max-h-32 object-contain mx-auto rounded-xl"
                  />
                )}
                {question.question_number && (
                  <p className="text-xs font-mono text-text-tertiary">Câu #{question.question_number}</p>
                )}
                <p className="text-base md:text-lg font-medium text-text-primary leading-relaxed">
                  {question.content}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-2 text-text-tertiary text-xs">
                Nhấn để xem đáp án
              </div>
            </Card.Content>
          </Card>

          {/* Back */}
          <Card className="flashcard-face flashcard-back shadow-whisper border border-border-strong bg-bg-card overflow-hidden">
            <div className="h-1 bg-brand" />
            <Card.Content className="p-5 md:p-7 flex flex-col justify-between h-full">
              <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-9 h-9 rounded-xl bg-brand text-ivory flex items-center justify-center font-medium text-sm">
                    {question.correct_answer}
                  </span>
                  <p className="text-base font-medium text-text-primary leading-relaxed">
                    {correctOption?.text}
                  </p>
                </div>
                {question.explanation && (
                  <div className="p-4 bg-bg-subtle border border-border-strong rounded-xl text-sm text-text-secondary leading-relaxed">
                    💡 {question.explanation}
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-2 text-text-tertiary text-xs">
                Nhấn để quay lại câu hỏi
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          fullWidth
          variant="outline"
          isDisabled={current <= 1}
          onPress={() => { setFlipped(false); onPrev() }}
          className="rounded-xl py-3 border-border text-text-secondary disabled:opacity-40"
        >
          ← Trước
        </Button>
        <Button
          fullWidth
          isDisabled={current >= total}
          onPress={() => { setFlipped(false); onNext() }}
          className="rounded-xl py-3 bg-brand text-ivory disabled:opacity-40"
        >
          Tiếp theo →
        </Button>
      </div>
    </div>
  )
}
