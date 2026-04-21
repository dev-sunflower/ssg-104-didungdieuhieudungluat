'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button, Spinner, Label, ListBox, Select } from '@heroui/react'
import { LuShuffle, LuInbox, LuRotateCcw } from 'react-icons/lu'
import FlashCard from '@/components/ui/FlashCard'
import { createClient } from '@/lib/supabase/client'
import type { LicenseType, Question } from '@/lib/types/database'

export default function FlashcardsPage() {
  const supabase = createClient()

  const [a1Type, setA1Type] = useState<LicenseType | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [questions, setQuestions] = useState<Question[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  // Incrementing this key forces FlashCard to remount (clears flipped state)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    supabase
      .from('license_types')
      .select('*')
      .eq('code', 'A1')
      .single()
      .then(({ data }) => {
        if (!data) return
        setA1Type(data)
        supabase
          .from('questions')
          .select('topic')
          .eq('license_type_id', data.id)
          .then(({ data: rows }) => {
            if (rows) {
              const unique = [...new Set(rows.map((r) => r.topic).filter(Boolean))] as string[]
              setTopics(unique)
            }
          })
      })
  }, [supabase])

  const fetchQuestions = useCallback(async () => {
    if (!a1Type) return
    setLoading(true)
    let query = supabase
      .from('questions')
      .select('*, license_types(*)')
      .eq('license_type_id', a1Type.id)
      .order('question_number')
    if (selectedTopic !== 'all') query = query.eq('topic', selectedTopic)
    const { data } = await query
    if (data) { setQuestions(data); setCurrentIndex(0); setResetKey((k) => k + 1) }
    setLoading(false)
  }, [supabase, a1Type, selectedTopic])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  const shuffle = () => {
    setQuestions((prev) => [...prev].sort(() => Math.random() - 0.5))
    setCurrentIndex(0)
    setResetKey((k) => k + 1)
  }

  const reset = () => {
    setCurrentIndex(0)
    setResetKey((k) => k + 1)
  }

  return (
    <div className="flex flex-col gap-4 md:grid md:grid-cols-[260px_1fr] md:gap-6 md:items-start">
      {/* ── Left sidebar ── */}
      <div className="flex flex-col gap-4">
        {/* Desktop: title block */}
        <div className="hidden md:block rounded-2xl border border-[#F4A616]/30 bg-[linear-gradient(145deg,#FFF4D6,#FFE8A8)] p-5">
          <h1 className="text-2xl font-bold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-caveat)' }}>
            🃏 Flashcard ôn luyện
          </h1>
          <p className="mt-1 text-xs text-[#1E1E1E]/60 leading-relaxed">Nhấn thẻ để lật — học theo reward loop</p>
        </div>

        {/* Mobile: compact title */}
        <div className="md:hidden rounded-2xl border border-[#1E1E1E]/10 bg-[linear-gradient(145deg,#FFF4D6_0%,#FFE8A8_100%)] p-4">
          <h1 className="text-xl font-extrabold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-caveat)' }}>🃏 Flashcard ôn luyện</h1>
          <p className="mt-0.5 text-sm text-[#1E1E1E]/75">Nhấn vào thẻ để lật và học.</p>
        </div>

        {/* Filter + controls */}
        <div className="rounded-2xl border border-[#1E1E1E]/10 bg-white p-4 shadow-sm">
          <Select value={selectedTopic} onChange={(key) => setSelectedTopic(key as string)} placeholder="Tất cả chủ đề" aria-label="Filter chủ đề">
            <Label className="mb-1.5 block text-[0.75rem] font-medium text-[#1E1E1E]/60">Chủ đề</Label>
            <Select.Trigger className="w-full rounded-2xl border border-[#1E1E1E]/14 bg-white px-3 py-2.5 text-sm text-text-primary focus:border-[#F4A616] focus:outline-none">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className="overflow-hidden rounded-2xl border border-[#1E1E1E]/14 bg-white shadow-lg">
              <ListBox>
                <ListBox.Item id="all" textValue="Tất cả chủ đề">Tất cả chủ đề<ListBox.ItemIndicator /></ListBox.Item>
                {topics.map((t) => (
                  <ListBox.Item key={t} id={t} textValue={t}>{t}<ListBox.ItemIndicator /></ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onPress={shuffle}
              className="flex-1 whitespace-nowrap rounded-2xl border-[#1E1E1E]/14 py-2.5 text-sm text-text-secondary"
            >
              <LuShuffle size={14} className="mr-1" /> Xáo trộn
            </Button>
            <Button
              variant="outline"
              size="lg"
              onPress={reset}
              aria-label="Về câu 1 và đặt lại thẻ"
              className="whitespace-nowrap rounded-2xl border-[#1E1E1E]/14 py-2.5 text-sm text-text-secondary"
            >
              <LuRotateCcw size={14} />
            </Button>
            <div className="whitespace-nowrap rounded-2xl border border-[#F4A616]/45 bg-[#FFF4D6] px-3 py-2.5 text-sm font-semibold text-[#1E1E1E]">
              {questions.length} câu
            </div>
          </div>
        </div>

        {/* Desktop: decorative blob */}
        <div
          className="hidden md:block h-24 w-full rounded-2xl"
          style={{ background: 'radial-gradient(circle at 30% 50%, rgba(244,166,22,0.12) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Right content ── */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Spinner size="lg" />
            <p className="text-sm text-text-tertiary">Đang tải câu hỏi...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#1E1E1E]/20 bg-white/70 py-20 text-center">
            <LuInbox size={48} className="mx-auto mb-3 text-text-tertiary opacity-40" />
            <p className="font-medium text-text-primary">Không có câu hỏi</p>
            <p className="mt-1 text-sm text-text-tertiary">Thử chọn chủ đề khác hoặc thêm câu hỏi qua Admin</p>
          </div>
        ) : (
          <FlashCard
            key={resetKey}
            question={questions[currentIndex]}
            current={currentIndex + 1}
            total={questions.length}
            onNext={() => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))}
            onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          />
        )}
      </div>
    </div>
  )
}
