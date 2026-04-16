'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button, Card, Chip, Spinner } from '@heroui/react'
import FlashCard from '@/components/ui/FlashCard'
import { createClient } from '@/lib/supabase/client'
import type { LicenseType, Question } from '@/lib/types/database'

export default function FlashcardsPage() {
  const supabase = createClient()

  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([])
  const [selectedTypeId, setSelectedTypeId] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [questions, setQuestions] = useState<Question[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('license_types').select('*').order('code').then(({ data }) => {
      if (data) setLicenseTypes(data)
    })
  }, [supabase])

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('questions').select('*, license_types(*)').order('question_number')
    if (selectedTypeId !== 'all') query = query.eq('license_type_id', selectedTypeId)
    if (selectedTopic !== 'all') query = query.eq('topic', selectedTopic)

    const { data } = await query
    if (data) {
      setQuestions(data)
      setCurrentIndex(0)
      const uniqueTopics = [...new Set(data.map(q => q.topic).filter(Boolean))] as string[]
      setTopics(uniqueTopics)
    }
    setLoading(false)
  }, [supabase, selectedTypeId, selectedTopic])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  const shuffle = () => {
    setQuestions(prev => [...prev].sort(() => Math.random() - 0.5))
    setCurrentIndex(0)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="heading-sub-sm text-text-primary">Flashcard ôn luyện</h1>
        <p className="text-text-secondary text-sm mt-0.5">Nhấn vào thẻ để lật xem đáp án</p>
      </div>

      {/* Filter bar */}
      <Card className="border border-border bg-bg-card">
        <Card.Content className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-[0.75rem] font-medium text-text-tertiary mb-1.5 block">Hạng bằng</label>
              <select
                id="filter-license-type"
                value={selectedTypeId}
                onChange={e => { setSelectedTypeId(e.target.value); setSelectedTopic('all') }}
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-border bg-bg-card text-text-primary focus:outline-none focus:border-focus-blue"
              >
                <option value="all">Tất cả hạng</option>
                {licenseTypes.map(lt => (
                  <option key={lt.id} value={lt.id}>{lt.code} — {lt.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-[0.75rem] font-medium text-text-tertiary mb-1.5 block">Chủ đề</label>
              <select
                id="filter-topic"
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-border bg-bg-card text-text-primary focus:outline-none focus:border-focus-blue"
              >
                <option value="all">Tất cả chủ đề</option>
                {topics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onPress={shuffle}
                className="rounded-xl px-4 py-2.5 border-border text-text-secondary whitespace-nowrap"
              >
                🔀 Xáo trộn
              </Button>
              <Chip size="sm" className="bg-bg-subtle text-brand font-medium px-3 py-2.5 shrink-0 border border-border-strong">
                {questions.length} câu
              </Chip>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" />
          <p className="text-text-tertiary text-sm">Đang tải câu hỏi...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">📭</div>
          <p className="font-medium text-text-primary">Không có câu hỏi</p>
          <p className="text-sm text-text-tertiary mt-1">Thử chọn bộ lọc khác hoặc thêm câu hỏi qua Admin</p>
        </div>
      ) : (
        <FlashCard
          question={questions[currentIndex]}
          current={currentIndex + 1}
          total={questions.length}
          onNext={() => setCurrentIndex(i => Math.min(i + 1, questions.length - 1))}
          onPrev={() => setCurrentIndex(i => Math.max(i - 1, 0))}
        />
      )}
    </div>
  )
}
