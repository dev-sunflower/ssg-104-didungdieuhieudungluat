import Link from 'next/link'

export default function RoadSignsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="max-w-2xl rounded-3xl border border-[#1E1E1E]/10 bg-[linear-gradient(140deg,#FFF4D6_0%,#FFE8A8_100%)] p-8 shadow-[0_14px_36px_rgba(30,30,30,0.08)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#1E1E1E]/60">Sắp ra mắt</p>
        <h1 className="text-3xl font-extrabold text-[#1E1E1E] md:text-4xl">Nhận biết biển báo</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#1E1E1E]/75">
          Trò chơi đang được phát triển. Bạn có thể luyện trước qua{' '}
          <Link href="/flashcards" className="font-semibold text-[#F4A616] hover:text-[#e59b11] transition-colors">
            Flashcard
          </Link>{' '}
          để ghi nhớ chắc hơn.
        </p>
      </div>

      <div className="flex gap-3">
        <Link href="/flashcards" className="rounded-2xl bg-[#F4A616] px-6 py-2.5 text-sm font-semibold text-[#1E1E1E] transition-colors hover:bg-[#e59b11]">
          Học Flashcard
        </Link>
        <Link href="/landing" className="rounded-2xl border border-[#1E1E1E]/15 px-6 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-[#FFF4D6]">
          ← Trang chủ
        </Link>
      </div>
    </div>
  )
}
