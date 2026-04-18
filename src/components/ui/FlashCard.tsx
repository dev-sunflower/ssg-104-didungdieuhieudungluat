'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { Button, Card, Chip } from '@heroui/react'
import { LuRotateCcw, LuCircleCheck, LuCircleHelp, LuArrowLeft, LuArrowRight } from 'react-icons/lu'
import type { Question } from '@/lib/types/database'

interface FlashCardProps {
  question: Question
  onNext: () => void
  onPrev: () => void
  current: number
  total: number
  isUnlearned: boolean
  onMarkUnlearned: (isUn: boolean) => void
}

const FlashCard = memo(function FlashCard({ question, onNext, onPrev, current, total, isUnlearned, onMarkUnlearned }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [feedback, setFeedback] = useState<'none' | 'unlearned' | 'learned'>('none')
  
  const correctOption = question.options.find((o) => o.key === question.correct_answer)
  const progress = (current / total) * 100

  // Reset local state ONLY when a truly NEW question comes in
  useEffect(() => {
    setFlipped(false)
    setFeedback('none')
    setIsExiting(false)
  }, [question.id])

  const handleFlip = useCallback(() => {
    if (isExiting) return
    setFlipped((f) => !f)
  }, [isExiting])

  const handleNext = useCallback(() => {
    if (isExiting) return
    setIsExiting(true)
    setTimeout(() => {
        onNext()
    }, 250)
  }, [isExiting, onNext])

  const handlePrev = useCallback(() => {
    if (current <= 1 || isExiting) return
    setIsExiting(true)
    setTimeout(() => {
        onPrev()
    }, 250)
  }, [current, isExiting, onPrev])

  const handleMark = useCallback((isUn: boolean) => {
    if (isExiting) return
    setFeedback(isUn ? 'unlearned' : 'learned')
    onMarkUnlearned(isUn)
    
    // Quizlet-style: wait for feedback then auto-move
    setTimeout(() => {
        handleNext()
    }, 450)
  }, [handleNext, onMarkUnlearned, isExiting])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExiting) return
      if (e.code === 'Space') {
        e.preventDefault()
        handleFlip()
      } else if (e.code === 'ArrowRight') {
        handleNext()
      } else if (e.code === 'ArrowLeft') {
        handlePrev()
      } else if (flipped && e.code === 'KeyA') {
        handleMark(true)
      } else if (flipped && e.code === 'KeyS') {
        handleMark(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFlip, handleNext, handlePrev, flipped, handleMark, isExiting])

  return (
    <div className={`flex w-full flex-col gap-6 transition-all duration-300 ${isExiting ? 'card-exit-active' : 'card-enter-active'}`}>
      {/* Header Info */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl font-black transition-all duration-300 ${isUnlearned ? 'bg-[#FF6B6B] text-white shadow-lg' : 'bg-[#1E1E1E] text-white'}`}>
                {current}
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Tiến độ</span>
                <span className="text-xs font-bold text-text-secondary">{current}/{total}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isUnlearned && (
                <Chip size="sm" color="danger" variant="flat" className="font-black text-[9px] uppercase tracking-tighter animate-pulse">
                    Sẽ ôn lại
                </Chip>
            )}
            <Chip size="sm" variant="flat" className="bg-bg-subtle font-bold text-[10px] uppercase tracking-tighter text-text-tertiary">
                {question.topic || "Giao thông"}
            </Chip>
          </div>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-bg-subtle">
            <div 
                className="h-full rounded-full bg-brand transition-all duration-500 ease-out will-change-[width]" 
                style={{ width: `${progress}%` }} 
            />
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div 
        className={`flashcard-scene relative min-h-[320px] md:min-h-[380px] w-full cursor-pointer select-none will-change-transform
            ${feedback === 'unlearned' ? 'animate-shake ring-4 ring-[#FF6B6B] rounded-[40px]' : ''}
            ${feedback === 'learned' ? 'animate-success-glide' : ''}
        `} 
        onClick={handleFlip}
      >
        <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`} style={{ minHeight: 'inherit' }}>
          {/* Front Side */}
          <Card className="flashcard-face overflow-hidden rounded-[32px] md:rounded-[40px] border-none bg-white shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand" />
            <div className="flex h-full flex-col p-6 md:p-10">
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                {question.image_url && (
                    <div className="w-full max-h-32 md:max-h-40 flex justify-center overflow-hidden">
                        <img 
                          src={question.image_url} 
                          alt="Minh họa" 
                          className="max-h-full rounded-xl bg-[#FFFCF2] object-contain shadow-sm border border-border/50" 
                        />
                    </div>
                )}
                <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand">Câu hỏi</p>
                    <h2 className="text-lg font-black leading-tight text-[#1E1E1E] md:text-2xl px-2">{question.content}</h2>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary opacity-40">
                <LuRotateCcw size={12} /> Nhấn để lật
              </div>
            </div>
          </Card>

          {/* Back Side */}
          <Card className="flashcard-face flashcard-back overflow-hidden rounded-[32px] md:rounded-[40px] border-none bg-[#1E1E1E] shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#4ECDC4]" />
            <div className="flex h-full flex-col p-6 md:p-10">
              <div className="flex flex-1 flex-col justify-center gap-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-[#4ECDC4]/10 px-2 py-0.5 text-[#4ECDC4]">
                    <LuCircleCheck size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Đáp án đúng</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4ECDC4] text-lg font-black text-[#1E1E1E]">
                      {question.correct_answer}
                    </span>
                    <p className="text-base font-bold leading-relaxed text-white md:text-lg">{correctOption?.text}</p>
                  </div>
                </div>

                {question.explanation && (
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 p-4 border border-white/10">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <p className="text-xs leading-relaxed text-white/80 font-medium italic">
                        {question.explanation}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Mastery Assessment Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleMark(true); }}
                        className={`h-14 rounded-[20px] border-2 transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 ${feedback === 'unlearned' ? 'bg-[#FF6B6B] border-[#FF6B6B] text-white shadow-lg' : 'bg-[#FF6B6B]/5 border-[#FF6B6B]/20 text-[#FF6B6B]'}`}
                    >
                        <span className="font-black text-[10px] uppercase tracking-tighter">CHƯA THUỘC (A)</span>
                        <span className="text-[8px] font-bold opacity-60 uppercase">Ôn lại</span>
                    </button>

                    <button 
                        onClick={(e) => { e.stopPropagation(); handleMark(false); }}
                        className={`h-14 rounded-[20px] border-2 transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 ${feedback === 'learned' ? 'bg-[#4ECDC4] border-[#4ECDC4] text-white shadow-lg' : 'bg-[#4ECDC4]/5 border-[#4ECDC4]/20 text-[#4ECDC4]'}`}
                    >
                        <span className="font-black text-[10px] uppercase tracking-tighter">ĐÃ THUỘC (S)</span>
                        <span className="text-[8px] font-bold opacity-60 uppercase">Xong</span>
                    </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          fullWidth
          variant="flat"
          isDisabled={current <= 1 || isExiting}
          onPress={handlePrev}
          className="h-14 rounded-[20px] bg-bg-subtle text-text-secondary font-black text-[10px] uppercase tracking-widest active:scale-95"
        >
          Trước
        </Button>
        <Button
          fullWidth
          isDisabled={isExiting}
          onPress={handleNext}
          className="h-14 rounded-[20px] bg-[#1E1E1E] text-white font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95"
        >
          Tiếp theo
        </Button>
      </div>
    </div>
  )
})

export default FlashCard
