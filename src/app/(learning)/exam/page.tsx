'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Card, Chip, Spinner } from '@heroui/react'
import QuestionCard from '@/components/ui/QuestionCard'
import { createClient } from '@/lib/supabase/client'
import type { LicenseType, Question } from '@/lib/types/database'

function ExamContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') ?? ''

  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([])
  const [selectedTypeCode, setSelectedTypeCode] = useState(initialType)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    supabase.from('license_types').select('*').order('code').then(({ data }) => {
      if (data) setLicenseTypes(data)
    })
  }, [supabase])

  const selectedType = licenseTypes.find(lt => lt.code === selectedTypeCode)

  const startExam = useCallback(async () => {
    if (!selectedType) return
    setLoading(true)
    const { data } = await supabase
      .from('questions')
      .select('*, license_types(*)')
      .eq('license_type_id', selectedType.id)
      .limit(selectedType.total_questions)

    if (data) {
      setQuestions([...data].sort(() => Math.random() - 0.5))
      setAnswers({})
      setCurrentIndex(0)
      setSubmitted(false)
      setStarted(true)
    }
    setLoading(false)
  }, [supabase, selectedType])

  const handleAnswer = (key: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: key }))
  }

  // ── RESULTS ────────────────────────────────────────────────
  if (submitted) {
    const correct = questions.filter(q => answers[q.id] === q.correct_answer).length
    const hasCriticalFail = questions.some(q => q.is_critical && answers[q.id] && answers[q.id] !== q.correct_answer)
    const passed = !hasCriticalFail && !!selectedType && correct >= selectedType.pass_score
    const pct = Math.round((correct / questions.length) * 100)

    return (
      <div className="flex flex-col gap-5">
        {/* Result card */}
        <Card className={`overflow-hidden shadow-whisper ${passed ? 'border border-brand' : 'border border-crimson'}`}>
          <div className={`h-2 ${passed ? 'bg-brand' : 'bg-crimson'}`} />
          <Card.Content className="p-6 text-center">
            <div className="text-6xl mb-3">{passed ? '🎉' : '😞'}</div>
            <h2 className={`heading-sub text-[1.5rem] ${passed ? 'text-brand' : 'text-crimson'}`}>
              {passed ? 'ĐẠT — Chúc mừng!' : 'CHƯA ĐẠT'}
            </h2>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-4xl font-medium text-text-primary font-serif">{correct}/{questions.length}</div>
                <div className="text-xs text-text-tertiary mt-0.5">Số câu đúng</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className={`text-4xl font-medium font-serif ${pct >= 80 ? 'text-brand' : pct >= 60 ? 'text-coral' : 'text-crimson'}`}>
                  {pct}%
                </div>
                <div className="text-xs text-text-tertiary mt-0.5">Điểm số</div>
              </div>
            </div>

            {hasCriticalFail && (
              <div className="mt-4 px-4 py-2.5 rounded-xl bg-crimson/10 text-crimson text-sm font-medium border border-crimson/20">
                ⚠️ Sai câu điểm liệt — tự động trượt
              </div>
            )}

            <p className="text-sm text-text-tertiary mt-3">
              Yêu cầu: {selectedType?.pass_score}/{selectedType?.total_questions} câu
            </p>
          </Card.Content>
        </Card>

        {/* Review */}
        <h3 className="heading-feature text-text-primary">Xem lại đáp án</h3>
        {questions.map((q, i) => (
          <div key={q.id}>
            <p className="text-xs text-text-tertiary mb-2 font-mono">Câu {i + 1}</p>
            <QuestionCard question={q} selectedAnswer={answers[q.id] ?? null} onAnswer={() => {}} showResult />
          </div>
        ))}

        <Button
          fullWidth
          onPress={() => { setStarted(false); setSubmitted(false) }}
          className="bg-brand text-ivory font-medium py-3.5 rounded-xl hover:bg-brand-hover transition-colors"
        >
          🔄 Thi lại
        </Button>
      </div>
    )
  }

  // ── SETUP ─────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="flex flex-col gap-5 max-w-lg">
        <div>
          <h1 className="heading-sub-sm text-text-primary">Thi thử sát hạch</h1>
          <p className="text-text-secondary text-sm mt-0.5">Chọn hạng bằng và bắt đầu thi</p>
        </div>

        <Card className="border border-border bg-bg-card shadow-whisper">
          <Card.Content className="p-5 flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-1.5 block">Hạng bằng lái</label>
              <select
                id="exam-license-type"
                value={selectedTypeCode}
                onChange={e => setSelectedTypeCode(e.target.value)}
                className="w-full text-sm px-3 py-3 rounded-xl border border-border bg-bg-card text-text-primary focus:outline-none focus:border-focus-blue"
              >
                <option value="">-- Chọn hạng bằng --</option>
                {licenseTypes.map(lt => (
                  <option key={lt.id} value={lt.code}>{lt.code} — {lt.name}</option>
                ))}
              </select>
            </div>

            {selectedType && (
              <div className="flex gap-3 p-3 bg-bg-subtle rounded-xl border border-border">
                <Chip size="sm" className="bg-warm-sand text-brand font-medium border border-border-strong">
                  📋 {selectedType.total_questions} câu
                </Chip>
                <Chip size="sm" className="bg-warm-sand text-text-primary font-medium border border-border-strong">
                  🎯 Đạt {selectedType.pass_score}/{selectedType.total_questions}
                </Chip>
              </div>
            )}

            <Button
              fullWidth
              isDisabled={!selectedTypeCode || loading}
              onPress={startExam}
              className="bg-brand text-ivory font-medium py-3.5 rounded-xl disabled:opacity-50 hover:bg-brand-hover transition-colors"
            >
              {loading ? <Spinner size="sm" /> : 'Bắt đầu thi →'}
            </Button>
          </Card.Content>
        </Card>
      </div>
    )
  }

  // ── IN PROGRESS ───────────────────────────────────────────
  const answered = Object.keys(answers).length
  const current = questions[currentIndex]

  return (
    <div className="flex flex-col gap-4">
      {/* Exam header */}
      <div className="flex items-center justify-between">
        <h1 className="heading-feature text-text-primary">
          Đề thi <span className="text-brand">{selectedTypeCode}</span>
        </h1>
        <Chip size="sm" className="bg-bg-subtle border border-border text-text-secondary font-medium">
          {answered}/{questions.length} đã trả lời
        </Chip>
      </div>

      {/* Progress dots */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1.5 min-w-max">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              title={`Câu ${i + 1}`}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all touch-manipulation ${
                i === currentIndex
                  ? 'bg-brand text-ivory scale-110'
                  : answers[q.id]
                  ? 'bg-warm-sand text-brand border border-border-strong'
                  : 'bg-bg-subtle text-text-tertiary border border-border'
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

      {/* Navigation */}
      <div className="flex gap-3 sticky bottom-20 md:bottom-4 bg-bg-page/90 backdrop-blur-sm py-3 -mx-4 px-4">
        <Button
          fullWidth
          variant="outline"
          isDisabled={currentIndex <= 0}
          onPress={() => setCurrentIndex(i => Math.max(i - 1, 0))}
          className="rounded-xl py-3 border-border text-text-secondary disabled:opacity-40"
        >
          ← Trước
        </Button>
        {currentIndex < questions.length - 1 ? (
          <Button
            fullWidth
            onPress={() => setCurrentIndex(i => i + 1)}
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
            ✅ Nộp bài
          </Button>
        )}
      </div>
    </div>
  )
}

export default function ExamPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    }>
      <ExamContent />
    </Suspense>
  )
}
