'use client'
import { useState } from 'react'

type Props = {
  onStart: (name: string) => void
  loading: boolean
}

export default function NameEntryScreen({ onStart, loading }: Props) {
  const [name, setName] = useState('')

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="text-center">
        <span className="text-5xl">🚦</span>
        <h1 className="mt-3 text-3xl font-extrabold text-[#1E1E1E]">Đèn Giao Thông</h1>
        <p className="mt-2 text-sm text-[#1E1E1E]/60">Trả lời đúng để xe qua đèn xanh!</p>
      </div>

      <div className="w-full max-w-xs rounded-3xl border border-[#1E1E1E]/10 bg-white p-6 shadow-[0_12px_30px_rgba(30,30,30,0.08)]">
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

      <div className="flex gap-6 text-center text-sm text-[#1E1E1E]/50">
        <div><span className="block text-xl">❤️</span>5 mạng</div>
        <div><span className="block text-xl">⭐</span>5 điểm/câu</div>
        <div><span className="block text-xl">⚡</span>20 điểm (điểm liệt)</div>
      </div>
    </div>
  )
}
