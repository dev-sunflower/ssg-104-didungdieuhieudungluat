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
  const correctOption = question.options.find((o) => o.key === question.correct_answer)
  const progress = (current / total) * 100

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-text-primary">
            {current}<span className="font-normal text-text-tertiary">/{total}</span>
          </span>
          {question.is_critical && (
            <Chip size="sm" className="border border-crimson/20 bg-crimson/10 text-[10px] font-medium text-crimson">
              ⚠ Điểm liệt
            </Chip>
          )}
          {question.topic && (
            <Chip size="sm" className="border border-[#1E1E1E]/10 bg-[#FFF4D6] text-[10px] text-text-tertiary">
              {question.topic}
            </Chip>
          )}
        </div>
        <span className="shrink-0 text-xs font-medium text-[#1E1E1E]/65">{Math.round(progress)}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#1E1E1E]/10">
        <div className="h-full rounded-full bg-[#F4A616] transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="flashcard-scene min-h-[280px] w-full cursor-pointer select-none md:min-h-[320px]" onClick={() => setFlipped((f) => !f)}>
        <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`} style={{ minHeight: 'inherit' }}>
          <Card className="flashcard-face overflow-hidden rounded-3xl border border-[#1E1E1E]/10 bg-white shadow-[0_14px_36px_rgba(30,30,30,0.08)]">
            <div className="h-1.5 bg-[#F4A616]" />
            <Card.Content className="flex h-full flex-col justify-between p-5 md:p-7">
              <div className="flex flex-1 flex-col justify-center gap-4">
                {question.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={question.image_url} alt="Hình ảnh câu hỏi" className="mx-auto max-h-32 rounded-xl bg-[#FFFCF2] object-contain" />
                )}
                {question.question_number && <p className="text-xs font-mono text-text-tertiary">Câu #{question.question_number}</p>}
                <p className="text-base font-medium leading-relaxed text-text-primary md:text-lg">{question.content}</p>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 border-t border-[#1E1E1E]/10 pt-4 text-xs text-text-tertiary">Nhấn để xem đáp án</div>
            </Card.Content>
          </Card>

          <Card className="flashcard-face flashcard-back overflow-hidden rounded-3xl border border-[#1E1E1E]/10 bg-white shadow-[0_14px_36px_rgba(30,30,30,0.08)]">
            <div className="h-1.5 bg-[#4ECDC4]" />
            <Card.Content className="flex h-full flex-col justify-between p-5 md:p-7">
              <div className="flex flex-1 flex-col justify-center gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#4ECDC4] text-sm font-medium text-white">
                    {question.correct_answer}
                  </span>
                  <p className="text-base font-medium leading-relaxed text-text-primary">{correctOption?.text}</p>
                </div>
                {question.explanation && (
                  <div className="rounded-2xl border border-[#1E1E1E]/10 bg-[#FFF4D6] p-4 text-sm leading-relaxed text-text-secondary">💡 {question.explanation}</div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 border-t border-[#1E1E1E]/10 pt-4 text-xs text-text-tertiary">Nhấn để quay lại câu hỏi</div>
            </Card.Content>
          </Card>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          fullWidth
          variant="outline"
          isDisabled={current <= 1}
          onPress={() => {
            setFlipped(false)
            onPrev()
          }}
          className="rounded-2xl border-[#1E1E1E]/15 py-3 text-text-secondary disabled:opacity-40"
        >
          ← Trước
        </Button>
        <Button
          fullWidth
          isDisabled={current >= total}
          onPress={() => {
            setFlipped(false)
            onNext()
          }}
          className="rounded-2xl bg-[#F4A616] py-3 text-[#1E1E1E] hover:bg-[#e59b11] disabled:opacity-40"
        >
          Tiếp theo →
        </Button>
      </div>
    </div>
  )
}
