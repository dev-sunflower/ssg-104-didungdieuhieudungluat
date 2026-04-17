'use client'

import { Card, Chip } from '@heroui/react'
import type { Question } from '@/lib/types/database'

interface QuestionCardProps {
  question: Question
  selectedAnswer: string | null
  onAnswer: (key: string) => void
  showResult: boolean
}

export default function QuestionCard({ question, selectedAnswer, onAnswer, showResult }: QuestionCardProps) {
  const getOptionStyle = (key: string): string => {
    if (!showResult) {
      if (selectedAnswer === key) {
        return 'border-[#F4A616] bg-[#F4A616]/15 text-text-primary'
      }
      return 'border-[#1E1E1E]/12 text-text-secondary hover:border-[#F4A616]/70 hover:bg-[#FFF4D6] active:scale-[0.99]'
    }

    if (key === question.correct_answer) {
      return 'border-[#4ECDC4] bg-[#4ECDC4]/12 text-text-primary'
    }

    if (key === selectedAnswer) {
      return 'border-crimson bg-crimson/5 text-crimson'
    }

    return 'border-[#1E1E1E]/12 text-text-tertiary opacity-60'
  }

  return (
    <Card className="rounded-3xl border border-[#1E1E1E]/10 bg-white shadow-[0_14px_36px_rgba(30,30,30,0.08)]">
      <Card.Content className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {question.question_number && (
            <span className="text-xs font-mono text-text-tertiary">#{question.question_number}</span>
          )}
          {question.topic && (
            <Chip size="sm" className="border border-[#1E1E1E]/10 bg-[#FFF4D6] text-[10px] font-medium text-text-secondary">
              {question.topic}
            </Chip>
          )}
          {question.is_critical && (
            <Chip size="sm" className="border border-crimson/20 bg-crimson/10 text-[10px] font-medium text-crimson">
              ⚠ Điểm liệt
            </Chip>
          )}
        </div>

        {question.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={question.image_url}
            alt="Hình minh họa"
            className="mx-auto max-h-44 rounded-xl border border-[#1E1E1E]/12 bg-[#FFFCF2] object-contain"
          />
        )}

        <p className="text-base font-medium leading-relaxed text-text-primary">{question.content}</p>

        <div className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => !showResult && onAnswer(opt.key)}
              disabled={showResult}
              className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${getOptionStyle(opt.key)}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#1E1E1E]/10 bg-[#FFF4D6] text-xs font-medium text-text-secondary">
                {opt.key}
              </span>
              <span className="flex-1 text-sm leading-relaxed">{opt.text}</span>
              {showResult && opt.key === question.correct_answer && (
                <span className="ml-auto shrink-0 font-bold text-[#22B8A8]">✓</span>
              )}
              {showResult && opt.key === selectedAnswer && opt.key !== question.correct_answer && (
                <span className="ml-auto shrink-0 font-bold text-crimson">✕</span>
              )}
            </button>
          ))}
        </div>

        {showResult && question.explanation && (
          <div className="rounded-2xl border border-[#1E1E1E]/10 bg-[#FFF4D6] p-4 text-sm leading-relaxed text-text-secondary">
            💡 <strong className="font-medium text-text-primary">Giải thích:</strong> {question.explanation}
          </div>
        )}
      </Card.Content>
    </Card>
  )
}
