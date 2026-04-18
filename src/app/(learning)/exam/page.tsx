'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { Button, Card, Chip, Spinner } from '@heroui/react'
import QuestionCard from '@/components/ui/QuestionCard'
import Leaderboard from './_components/Leaderboard'
import { createClient } from '@/lib/supabase/client'
import type { LicenseType, Question } from '@/lib/types/database'
import { LuPartyPopper, LuFrown, LuTriangleAlert, LuRotateCcw, LuClipboard, LuTarget, LuTrophy } from 'react-icons/lu'

function ExamContent() {
  const supabase = createClient()

  const [a1Type, setA1Type] = useState<LicenseType | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    supabase
      .from('license_types')
      .select('*')
      .eq('code', 'A1')
      .single()
      .then(({ data }) => {
        if (data) setA1Type(data)
      })
  }, [supabase])

  const startExam = useCallback(async () => {
    if (!a1Type) return
    setLoading(true)
    const { data } = await supabase
      .from('questions')
      .select('*, license_types(*)')
      .eq('license_type_id', a1Type.id)
      .limit(a1Type.total_questions)

    if (data) {
      setQuestions([...data].sort(() => Math.random() - 0.5))
      setAnswers({})
      setCurrentIndex(0)
      setSubmitted(false)
      setStarted(true)
    }
    setLoading(false)
  }, [supabase, a1Type])

  const handleAnswer = (key: string) => {
    setAnswers((prev) => ({ ...prev, [questions[currentIndex].id]: key }))
  }

  if (submitted) {
    const correct = questions.filter((q) => answers[q.id] === q.correct_answer).length
    const hasCriticalFail = questions.some((q) => q.is_critical && answers[q.id] && answers[q.id] !== q.correct_answer)
    const scoreValue = correct // Or however you want to calculate points

    return (
      <div className="flex flex-col gap-8">
        {/* Kết quả thi */}
        <Card className={`overflow-hidden rounded-3xl border bg-white shadow-[0_14px_34px_rgba(30,30,30,0.09)] ${passed ? 'border-[#4ECDC4]' : 'border-crimson/50'}`}>
          <div className={`h-2 ${passed ? 'bg-[#4ECDC4]' : 'bg-crimson'}`} />
          <Card.Content className="p-6 text-center">
            <div className="mb-3 flex justify-center">
              {passed ? <LuPartyPopper size={56} className="text-[#4ECDC4]" /> : <LuFrown size={56} className="text-crimson" />}
            </div>
            <h2 className={`text-2xl font-extrabold ${passed ? 'text-[#1E1E1E]' : 'text-crimson'}`}>{passed ? 'ĐẠT - Chúc mừng!' : 'CHƯA ĐẠT'}</h2>

            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="font-serif text-4xl text-text-primary">{correct}/{questions.length}</div>
                <div className="mt-0.5 text-xs text-text-tertiary">Số câu đúng</div>
              </div>
              <div className="h-12 w-px bg-[#1E1E1E]/10" />
              <div className="text-center">
                <div className={`font-serif text-4xl ${pct >= 80 ? 'text-[#4ECDC4]' : pct >= 60 ? 'text-[#F4A616]' : 'text-crimson'}`}>{pct}%</div>
                <div className="mt-0.5 text-xs text-text-tertiary">Điểm số</div>
              </div>
            </div>

            {hasCriticalFail && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-crimson/20 bg-crimson/10 px-4 py-2.5 text-sm font-medium text-crimson">
                <LuTriangleAlert size={15} /> Sai câu điểm liệt - tự động trượt
              </div>
            )}

            <p className="mt-3 text-sm text-text-tertiary">Yêu cầu: {a1Type?.pass_score}/{a1Type?.total_questions} câu</p>
          </Card.Content>
        </Card>

        {/* Bảng xếp hạng - Nhúng trực tiếp tại đây */}
        {a1Type && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Leaderboard 
              score={scoreValue} 
              licenseType={a1Type} 
              onClose={() => {}} // Không cần nút đóng khi nhúng trực tiếp
            />
          </div>
        )}

        {/* Nút thi lại */}
        <Button
          fullWidth
          onPress={() => {
            setStarted(false)
            setSubmitted(false)
            setShowLeaderboard(false)
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#F4A616] py-3.5 font-medium text-[#1E1E1E] hover:bg-[#e59b11]"
        >
          <LuRotateCcw size={15} /> Thi lại đề khác
        </Button>

        {/* Xem lại đáp án */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#1E1E1E]">Xem lại đáp án</h3>
          {questions.map((q, i) => (
            <div key={q.id}>
              <p className="mb-2 text-xs font-mono text-text-tertiary">Câu {i + 1}</p>
              <QuestionCard question={q} selectedAnswer={answers[q.id] ?? null} onAnswer={() => {}} showResult />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-3xl border border-[#1E1E1E]/10 bg-[linear-gradient(145deg,#FFF4D6_0%,#FFE8A8_100%)] p-5 md:p-6">
          <h1 className="text-2xl font-extrabold text-[#1E1E1E] md:text-3xl">Thi thử sát hạch</h1>
          <p className="mt-1 text-sm text-[#1E1E1E]/75">Bằng lái hạng A1 - Xe máy dưới 175cc</p>
        </div>

        <Card className="rounded-3xl border border-[#1E1E1E]/10 bg-white shadow-[0_12px_30px_rgba(30,30,30,0.08)]">
          <Card.Content className="flex flex-col gap-4 p-5">
            {a1Type ? (
              <div className="flex gap-3 rounded-2xl border border-[#1E1E1E]/10 bg-[#FFF4D6] p-3">
                <Chip size="sm" className="flex items-center gap-1 border border-[#F4A616]/50 bg-white font-medium text-[#1E1E1E]">
                  <LuClipboard size={12} /> {a1Type.total_questions} câu
                </Chip>
                <Chip size="sm" className="flex items-center gap-1 border border-[#1E1E1E]/10 bg-white font-medium text-text-primary">
                  <LuTarget size={12} /> Đạt {a1Type.pass_score}/{a1Type.total_questions}
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
              {loading ? <Spinner size="sm" /> : 'Bắt đầu thi →'}
            </Button>
          </Card.Content>
        </Card>
      </div>
    )
  }

  const answered = Object.keys(answers).length
  const current = questions[currentIndex]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1E1E1E]">Đề thi <span className="text-[#F4A616]">A1</span></h1>
        <Chip size="sm" className="border border-[#1E1E1E]/10 bg-[#FFF4D6] font-medium text-[#1E1E1E]">
          {answered}/{questions.length} đã trả lời
        </Chip>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max gap-1.5">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              title={`Câu ${i + 1}`}
              className={`h-8 w-8 rounded-lg text-xs font-medium transition-all touch-manipulation ${
                i === currentIndex
                  ? 'scale-110 bg-[#F4A616] text-[#1E1E1E]'
                  : answers[q.id]
                    ? 'border border-[#F4A616]/40 bg-[#FFF4D6] text-[#1E1E1E]'
                    : 'border border-[#1E1E1E]/14 bg-white text-text-tertiary'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <QuestionCard question={current} selectedAnswer={answers[current.id] ?? null} onAnswer={handleAnswer} showResult={false} />

      <div className="-mx-4 sticky bottom-20 flex gap-3 bg-white/90 px-4 py-3 backdrop-blur-sm md:bottom-4">
        <Button
          fullWidth
          variant="outline"
          isDisabled={currentIndex <= 0}
          onPress={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          className="rounded-2xl border-[#1E1E1E]/15 py-3 text-text-secondary disabled:opacity-40"
        >
          ← Trước
        </Button>
        {currentIndex < questions.length - 1 ? (
          <Button fullWidth onPress={() => setCurrentIndex((i) => i + 1)} className="rounded-2xl bg-[#F4A616] py-3 text-[#1E1E1E] hover:bg-[#e59b11]">
            Tiếp →
          </Button>
        ) : (
          <Button fullWidth onPress={() => setSubmitted(true)} className="rounded-2xl bg-[#F4A616] py-3 font-medium text-[#1E1E1E] hover:bg-[#e59b11]">
            Nộp bài
          </Button>
        )}
      </div>
    </div>
  )
}

export default function ExamPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Spinner size="lg" /></div>}>
      <ExamContent />
    </Suspense>
  )
}
