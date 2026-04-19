'use client'
import Link from 'next/link'

type Props = {
  visible: boolean
  opacity: number
}

export default function HeroText({ visible, opacity }: Props) {
  if (!visible && opacity < 0.01) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      style={{ opacity, transition: 'opacity 0.3s ease' }}
    >
      <span
        className="inline-flex rounded-full border-2 border-white/30 bg-white/60 px-4 py-1 text-sm font-semibold text-[#1E1E1E] backdrop-blur-sm"
        style={{ fontFamily: 'var(--font-caveat)' }}
      >
        ✏️ Học như chơi game
      </span>
      <h1
        className="mt-4 text-5xl font-bold leading-tight text-[#1E1E1E] drop-shadow-sm sm:text-7xl md:text-8xl"
        style={{ fontFamily: 'var(--font-caveat)' }}
      >
        Học luật mà tưởng
        <span className="block text-[#FF6B6B]">chơi game 🎮</span>
      </h1>
      <p
        className="mx-auto mt-5 max-w-xl text-xl leading-relaxed text-[#1E1E1E]/80"
        style={{ fontFamily: 'var(--font-caveat)' }}
      >
        Không còn học vẹt. Hiểu biển báo qua trải nghiệm thực tế.
      </p>
      <div className="pointer-events-auto mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/flashcards"
          className="inline-flex items-center justify-center rounded-2xl bg-[#F4A616] px-8 py-3.5 text-sm font-bold text-[#1E1E1E] shadow-[0_10px_30px_rgba(244,166,22,0.4)] transition hover:scale-105"
        >
          Thử ngay
        </Link>
        <Link
          href="/exam"
          className="inline-flex items-center justify-center rounded-2xl border-2 border-[#1E1E1E]/15 bg-white/70 px-8 py-3.5 text-sm font-semibold text-[#1E1E1E] backdrop-blur-sm transition hover:scale-105"
        >
          Làm quiz mẫu
        </Link>
      </div>
      <p className="mt-10 animate-bounce text-sm text-[#1E1E1E]/50">↓ Cuộn xuống để khám phá</p>
    </div>
  )
}
