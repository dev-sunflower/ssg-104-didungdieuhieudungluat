import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

export function CtaBanner() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="rounded-[28px] border-2 border-[#1E1E1E]/10 bg-[linear-gradient(135deg,#FFF4D6_0%,#FFE8A8_70%)] px-6 py-12 text-center shadow-[0_22px_45px_rgba(30,30,30,0.12)] md:px-12">
          <h2 className="text-3xl font-extrabold leading-tight text-[#1E1E1E] md:text-5xl">
            Bắt đầu học
            <span className="block text-[#FF6B6B]">đừng chỉ biết</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#1E1E1E]/75">
            Bạn không cần hoàn hảo ngay từ đầu. Chỉ cần bắt đầu đúng cách, bạn sẽ thấy mình làm được.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/flashcards"
              className="inline-flex scale-100 items-center justify-center rounded-2xl bg-[#F4A616] px-8 py-3.5 text-sm font-bold text-[#1E1E1E] shadow-[0_10px_25px_rgba(244,166,22,0.35)] transition duration-200 hover:scale-105"
            >
              Bắt đầu học
            </Link>
            <Link
              href="/exam"
              className="inline-flex scale-100 items-center justify-center rounded-2xl border-2 border-[#1E1E1E]/15 bg-white/70 px-8 py-3.5 text-sm font-semibold text-[#1E1E1E] transition duration-200 hover:scale-105"
            >
              Thi thử ngay
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

