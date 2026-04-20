'use client'
import { useState } from 'react'

type Props = {
  onStart: (name: string) => void
  loading: boolean
}

export default function NameEntryScreen({ onStart, loading }: Props) {
  const [name, setName] = useState('')

  return (
    <div className="relative flex flex-col items-center justify-center gap-6 py-10 overflow-hidden">
      {/* Blob decorations */}
      <div className="pointer-events-none absolute -top-8 -left-8 h-40 w-40 rounded-full bg-[#FFE29A]/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-[#4ECDC4]/20 blur-2xl" />

      <div className="relative text-center">
        <span className="text-6xl">🚦</span>
        <h1 className="mt-3 text-3xl font-bold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-caveat)' }}>Đèn Giao Thông</h1>
        <p className="mt-2 text-sm text-[#1E1E1E]/60">Trả lời đúng để xe qua đèn xanh!</p>
      </div>

      <div className="relative w-full max-w-xs rounded-3xl border border-[#1E1E1E]/10 bg-white p-6 shadow-[0_12px_30px_rgba(30,30,30,0.08)]">
        <label className="mb-2 block text-sm font-semibold text-[#1E1E1E]">Tên của bạn</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && !loading && onStart(name.trim())}
          placeholder="Nhập tên hiển thị..."
          maxLength={30}
          className="w-full rounded-2xl border border-[#1E1E1E]/15 bg-[#FFF9F0] px-4 py-3 text-sm text-[#1E1E1E] outline-none focus:border-[#F4A616] focus:ring-2 focus:ring-[#F4A616]/20"
        />
        <div className="mt-2 flex justify-between text-xs text-[#1E1E1E]/40">
          <span>Tối đa 30 ký tự</span>
          <span>{name.length}/30</span>
        </div>
        <button
          disabled={!name.trim() || loading}
          onClick={() => onStart(name.trim())}
          className="mt-4 w-full rounded-2xl bg-[#F4A616] py-3 font-bold text-[#1E1E1E] transition hover:bg-[#e59b11] disabled:opacity-40"
        >
          {loading ? 'Đang tải câu hỏi...' : 'Bắt đầu →'}
        </button>
      </div>

      {/* Info pills as gradient cards */}
      <div className="relative flex gap-3">
        {[
          { icon: '❤️', value: '5', label: 'mạng' },
          { icon: '⭐', value: '5đ', label: '/câu thường' },
          { icon: '⚡', value: '20đ', label: '/điểm liệt' },
        ].map((pill) => (
          <div
            key={pill.label}
            className="flex flex-col items-center gap-0.5 rounded-2xl border border-[#F4A616]/30 bg-[linear-gradient(135deg,#FFF4D6,#FFE8A8)] px-4 py-3 text-center shadow-sm"
          >
            <span className="text-2xl">{pill.icon}</span>
            <span className="text-sm font-bold text-[#1E1E1E]">{pill.value}</span>
            <span className="text-[10px] text-[#1E1E1E]/50">{pill.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
