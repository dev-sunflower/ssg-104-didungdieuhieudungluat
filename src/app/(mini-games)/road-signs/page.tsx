import Link from 'next/link'

export default function RoadSignsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-4">
      <div>
        <p className="text-[0.63rem] font-medium uppercase tracking-[0.5px] text-text-tertiary mb-4">
          Sắp ra mắt
        </p>
        <h1 className="heading-sub-lg text-text-primary text-[1.6rem] md:text-[2.3rem] mb-4">
          Nhận biết biển báo
        </h1>
        <p className="text-base leading-[1.6] text-text-secondary max-w-md mx-auto">
          Trò chơi đang được phát triển. Hãy ôn luyện qua{' '}
          <Link href="/flashcards" className="text-brand hover:text-brand-hover font-medium transition-colors">
            Flashcard
          </Link>{' '}
          trong thời gian này.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/flashcards"
          className="px-6 py-2.5 rounded-xl bg-brand text-ivory font-medium text-sm hover:bg-brand-hover transition-colors"
        >
          Học Flashcard
        </Link>
        <Link
          href="/landing"
          className="px-6 py-2.5 rounded-xl border border-border text-text-secondary font-medium text-sm hover:bg-bg-subtle transition-colors"
        >
          ← Trang chủ
        </Link>
      </div>
    </div>
  )
}
