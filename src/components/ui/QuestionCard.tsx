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
      if (selectedAnswer === key)
        return 'border-brand bg-warm-sand/60 text-text-primary'
      return 'border-border text-text-secondary hover:border-border-strong hover:bg-bg-subtle active:scale-[0.99]'
    }
    if (key === question.correct_answer)
      return 'border-brand bg-warm-sand/40 text-text-primary'
    if (key === selectedAnswer)
      return 'border-crimson bg-crimson/5 text-crimson'
    return 'border-border text-text-tertiary opacity-60'
  }

  return (
    <Card className="shadow-whisper border border-border bg-bg-card">
      <Card.Content className="p-5 flex flex-col gap-4">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {question.question_number && (
            <span className="text-xs font-mono text-text-tertiary">#{question.question_number}</span>
          )}
          {question.topic && (
            <Chip size="sm" className="bg-bg-subtle border border-border text-text-secondary text-[10px] font-medium">
              {question.topic}
            </Chip>
          )}
          {question.is_critical && (
            <Chip size="sm" className="bg-crimson/10 border border-crimson/20 text-crimson text-[10px] font-medium">
              ⚠ Điểm liệt
            </Chip>
          )}
        </div>

        {/* Image */}
        {question.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={question.image_url}
            alt="Hình minh họa"
            className="max-h-44 object-contain rounded-xl border border-border mx-auto"
          />
        )}

        {/* Content */}
        <p className="text-base font-medium text-text-primary leading-relaxed">
          {question.content}
        </p>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => !showResult && onAnswer(opt.key)}
              disabled={showResult}
              className={`flex items-start gap-3 w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${getOptionStyle(opt.key)}`}
            >
              <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-bg-subtle border border-border font-medium text-xs text-text-secondary">
                {opt.key}
              </span>
              <span className="text-sm leading-relaxed flex-1">{opt.text}</span>
              {showResult && opt.key === question.correct_answer && (
                <span className="ml-auto shrink-0 text-brand font-bold">✓</span>
              )}
              {showResult && opt.key === selectedAnswer && opt.key !== question.correct_answer && (
                <span className="ml-auto shrink-0 text-crimson font-bold">✗</span>
              )}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showResult && question.explanation && (
          <div className="p-4 bg-bg-subtle border border-border-strong rounded-xl text-sm text-text-secondary leading-relaxed">
            💡 <strong className="text-text-primary font-medium">Giải thích:</strong> {question.explanation}
          </div>
        )}
      </Card.Content>
    </Card>
  )
}
