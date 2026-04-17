'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button, Card, Spinner, Label, ListBox, Select } from '@heroui/react'
import { LuShuffle, LuInbox } from 'react-icons/lu'
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
    if (data) {
      setQuestions(data)
      setCurrentIndex(0)
    }
    setLoading(false)
  }, [supabase, a1Type, selectedTopic])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const shuffle = () => {
    setQuestions((prev) => [...prev].sort(() => Math.random() - 0.5))
    setCurrentIndex(0)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-[#1E1E1E]/10 bg-[linear-gradient(145deg,#FFF4D6_0%,#FFE8A8_100%)] p-5 md:p-6">
        <h1 className="text-2xl font-extrabold text-[#1E1E1E] md:text-3xl">Flashcard ôn luyện</h1>
        <p className="mt-1 text-sm text-[#1E1E1E]/75">Nhấn vào thẻ để lật và học theo cơ chế reward loop.</p>
      </div>

      <Card className="rounded-3xl border border-[#1E1E1E]/10 bg-white shadow-[0_12px_30px_rgba(30,30,30,0.08)]">
        <Card.Content className="p-4">
          <div className="flex flex-col items-end gap-3 sm:flex-row">
            <div className="flex-1">
              <Select value={selectedTopic} onChange={(key) => setSelectedTopic(key as string)} placeholder="Tất cả chủ đề" aria-label="Filter chủ đề">
                <Label className="mb-1.5 block text-[0.75rem] font-medium text-[#1E1E1E]/60">Chủ đề</Label>
                <Select.Trigger className="w-full rounded-2xl border border-[#1E1E1E]/14 bg-white px-3 py-2.5 text-sm text-text-primary focus:border-[#F4A616] focus:outline-none">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="overflow-hidden rounded-2xl border border-[#1E1E1E]/14 bg-white shadow-lg">
                  <ListBox>
                    <ListBox.Item id="all" textValue="Tất cả chủ đề">
                      Tất cả chủ đề
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    {topics.map((t) => (
                      <ListBox.Item key={t} id={t} textValue={t}>
                        {t}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div className="flex items-center gap-2 sm:shrink-0">
              <Button
                variant="outline"
                size="lg"
                onPress={shuffle}
                className="whitespace-nowrap rounded-2xl border-[#1E1E1E]/14 px-4 py-2.5 text-sm text-text-secondary"
              >
                <LuShuffle size={14} className="mr-1" /> Xáo trộn
              </Button>
              <div className="whitespace-nowrap rounded-2xl border border-[#F4A616]/45 bg-[#FFF4D6] px-3 py-2.5 text-sm font-semibold text-[#1E1E1E]">
                {questions.length} câu
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

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
          question={questions[currentIndex]}
          current={currentIndex + 1}
          total={questions.length}
          onNext={() => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))}
          onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
        />
      )}
    </div>
  )
}
