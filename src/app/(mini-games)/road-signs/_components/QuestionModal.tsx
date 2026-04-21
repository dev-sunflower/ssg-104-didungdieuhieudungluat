'use client'
import { useState } from 'react'
import type { Question } from '@/lib/types/database'

type Props = {
  question: Question
  onAnswer: (isCorrect: boolean) => void
}

export default function QuestionModal({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const answered = selected !== null

  function handleSelect(key: string) {
    if (answered) return
    setSelected(key)
    setTimeout(() => onAnswer(key === question.correct_answer), 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border-2 border-[#F4A616]/30 bg-white p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
        {question.is_critical && (
          <span className="mb-2 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
            ⚡ Câu điểm liệt — sai mất 1 mạng ngay
          </span>
        )}

        {question.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={question.image_url}
            alt="Hình minh họa câu hỏi"
            className="mb-3 w-full rounded-2xl object-contain max-h-48 bg-[#F5F0E8]"
          />
        )}

        <p className="text-base font-bold leading-snug text-[#1E1E1E]">{question.content}</p>

        <div className="mt-4 flex flex-col gap-2">
          {(question.options as Array<{ key: string; text: string }>).map((opt) => {
            const isCorrect = opt.key === question.correct_answer
            const isSelected = selected === opt.key
            let cls = 'border-[#F4A616]/30 bg-[#FFF4D6] text-[#1E1E1E] hover:bg-[#FFE29A]'
            if (answered && isSelected && isCorrect)  cls = 'border-green-400 bg-green-100 text-[#1E1E1E]'
            if (answered && isSelected && !isCorrect) cls = 'border-red-400 bg-red-100 text-[#1E1E1E]'
            if (answered && !isSelected && isCorrect) cls = 'border-green-300 bg-green-50 text-[#1E1E1E]'
            return (
              <button
                key={opt.key}
                disabled={answered}
                onClick={() => handleSelect(opt.key)}
                className={`w-full rounded-2xl border-2 px-3 py-2 text-left text-sm font-medium transition-all ${cls}`}
              >
                <span className="font-bold">{opt.key}.</span> {opt.text}
              </button>
            )
          })}
        </div>

        {answered && question.explanation && (
          <div className="mt-4 rounded-2xl bg-[#1E1E1E] p-3 text-xs leading-relaxed text-white/90">
            💡 {question.explanation}
          </div>
        )}
      </div>
    </div>
  )
}
