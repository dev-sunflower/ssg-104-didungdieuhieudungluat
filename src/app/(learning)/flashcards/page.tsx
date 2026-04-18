'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button, Spinner, Progress, Card } from '@heroui/react'
import { LuShuffle, LuSettings, LuChevronLeft, LuTrophy, LuRefreshCcw, LuLayers } from 'react-icons/lu'
import FlashCard from '@/components/ui/FlashCard'
import { createClient } from '@/lib/supabase/client'
import type { LicenseType, Question } from '@/lib/types/database'
import Link from 'next/link'

export default function FlashcardsPage() {
  const supabase = createClient()

  const [licenseType, setLicenseType] = useState<LicenseType | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [unlearnedIds, setUnlearnedIds] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filterMode, setFilterMode] = useState<'all' | 'unlearned'>('all')
  const [isFinished, setIsFinished] = useState(false)

  // Load unlearned IDs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('unlearned_questions')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setUnlearnedIds(parsed)
      } catch (e) {
        setUnlearnedIds([])
      }
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      // Get A1 or first available
      let { data: type } = await supabase.from('license_types').select('*').eq('code', 'A1').maybeSingle()
      if (!type) {
        const { data: first } = await supabase.from('license_types').select('*').limit(1).maybeSingle()
        type = first
      }

      if (type) {
        setLicenseType(type)
        const { data: qData } = await supabase
          .from('questions')
          .select('*, license_types(*)')
          .eq('license_type_id', type.id)
          .order('question_number')
        
        if (qData) {
          setQuestions(qData)
        }
      }
      setLoading(false)
    }
    init()
  }, [supabase])

  const updateUnlearned = (id: string, isUnlearned: boolean) => {
    setUnlearnedIds(prev => {
        let newIds = isUnlearned 
            ? [...prev.filter(i => i !== id), id] 
            : prev.filter(i => i !== id)
        localStorage.setItem('unlearned_questions', JSON.stringify(newIds))
        return newIds
    })
  }

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      // Loop back to the beginning
      setCurrentIndex(0)
    }
  }

  const filteredQuestions = filterMode === 'all' 
    ? questions 
    : questions.filter(q => unlearnedIds.includes(q.id))

  const restart = () => {
    setCurrentIndex(0)
    setIsFinished(false)
  }

  const shuffle = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    setCurrentIndex(0)
    setIsFinished(false)
  }

  const resetAll = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách "Chưa thuộc" và bắt đầu lại từ đầu không?')) {
        setUnlearnedIds([])
        localStorage.removeItem('unlearned_questions')
        setCurrentIndex(0)
        setIsFinished(false)
        setFilterMode('all')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
            <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
        </div>
        <p className="font-black text-[10px] uppercase tracking-[0.3em] text-text-tertiary animate-pulse">Đang nạp câu hỏi...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full px-0 md:px-2">
      {/* Quizlet Header - Integrated into layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-[32px] border border-border/50 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-bg-subtle rounded-xl transition-colors">
              <LuChevronLeft size={20} className="text-[#1E1E1E]" />
          </Link>
          <div>
              <h1 className="text-lg font-black text-[#1E1E1E] leading-none uppercase">HẠNG {licenseType?.code || 'A1'}</h1>
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-1">Ôn tập Flashcards</p>
          </div>
        </div>

        <div className="flex bg-bg-subtle p-1 rounded-2xl border border-border/50 self-center">
            <button 
                onClick={() => { setFilterMode('all'); restart(); }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${filterMode === 'all' ? 'bg-[#1E1E1E] text-white shadow-lg shadow-black/10' : 'text-text-tertiary hover:text-text-primary'}`}
            >
                TẤT CẢ ({questions.length})
            </button>
            <button 
                onClick={() => { setFilterMode('unlearned'); restart(); }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${filterMode === 'unlearned' ? 'bg-[#FF6B6B] text-white shadow-lg shadow-red-500/20' : 'text-text-tertiary hover:text-[#FF6B6B]'}`}
            >
                CHƯA THUỘC <span className="bg-black/10 px-1.5 py-0.5 rounded-md text-[9px]">{unlearnedIds.length}</span>
            </button>
        </div>

        <div className="flex items-center gap-2 justify-end">
            <Button isIconOnly variant="flat" size="sm" className="rounded-xl bg-bg-subtle hover:text-[#FF6B6B]" onClick={resetAll} title="Làm mới toàn bộ">
                <LuRefreshCcw size={18} />
            </Button>
            <Button isIconOnly variant="flat" size="sm" className="rounded-xl bg-bg-subtle hover:text-brand" onClick={shuffle} title="Xáo trộn">
                <LuShuffle size={18} />
            </Button>
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 min-h-[500px] flex flex-col items-center">
        {isFinished ? (
          <div className="w-full max-w-lg flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-brand rounded-[36px] flex items-center justify-center mb-6 rotate-12 shadow-xl shadow-brand/30">
                  <LuTrophy size={48} className="text-[#1E1E1E]" />
              </div>
              <h2 className="text-3xl font-black text-[#1E1E1E] mb-2">Hoàn thành! 🎉</h2>
              <p className="text-text-secondary font-bold mb-8 leading-relaxed">
                  {filterMode === 'unlearned' && unlearnedIds.length === 0 
                    ? 'Bạn đã thuộc hết các câu đã đánh dấu!' 
                    : `Bạn vừa xem qua ${filteredQuestions.length} thẻ bài.`}
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full px-4">
                  <Button 
                      onPress={restart}
                      className="h-14 rounded-2xl bg-[#1E1E1E] text-white font-black shadow-lg"
                  >
                      HỌC LẠI
                  </Button>
                  <Button 
                      onPress={shuffle}
                      className="h-14 rounded-2xl bg-brand text-[#1E1E1E] font-black shadow-lg shadow-brand/20"
                  >
                      XÁO TRỘN
                  </Button>
              </div>
          </div>
        ) : filteredQuestions.length > 0 ? (
          <div className="w-full max-w-2xl px-2">
            <FlashCard
                key={filteredQuestions[currentIndex]?.id}
                question={filteredQuestions[currentIndex]}
                current={currentIndex + 1}
                total={filteredQuestions.length}
                onNext={handleNext}
                onPrev={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                isUnlearned={unlearnedIds.includes(filteredQuestions[currentIndex].id)}
                onMarkUnlearned={(isUn) => updateUnlearned(filteredQuestions[currentIndex].id, isUn)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-bg-subtle rounded-2xl flex items-center justify-center mb-4">
                  <LuLayers size={24} className="text-text-tertiary opacity-30" />
              </div>
              <h3 className="text-lg font-black text-[#1E1E1E] mb-2">Chưa có thẻ nào</h3>
              <p className="text-xs text-text-tertiary font-bold mb-6 uppercase tracking-widest">
                {filterMode === 'unlearned' ? 'Bạn chưa đánh dấu câu nào là "Chưa thuộc"' : 'Không tìm thấy câu hỏi'}
              </p>
              <Button 
                  onPress={() => setFilterMode('all')}
                  className="rounded-xl bg-[#1E1E1E] text-white font-black px-6 h-10 text-xs"
              >
                  XEM TẤT CẢ
              </Button>
          </div>
        )}
      </div>

      {/* Legend / Tips */}
      {!isFinished && filteredQuestions.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 px-4 py-3 bg-white/50 rounded-2xl border border-border/30">
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-bg-subtle text-[10px] font-black border border-border">SPACE</span>
                <span className="text-[10px] font-bold text-text-tertiary uppercase">Lật thẻ</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-bg-subtle text-[10px] font-black border border-border">A / S</span>
                <span className="text-[10px] font-bold text-text-tertiary uppercase">Đánh dấu</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-bg-subtle text-[10px] font-black border border-border">← →</span>
                <span className="text-[10px] font-bold text-text-tertiary uppercase">Chuyển câu</span>
            </div>
        </div>
      )}
    </div>
  )
}
