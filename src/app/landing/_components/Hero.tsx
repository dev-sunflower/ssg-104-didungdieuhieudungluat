import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

export function Hero() {
  return (
    <section className="relative bg-[linear-gradient(135deg,#FFF4D6_0%,#FFE29A_65%,#F4A616_100%)] py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="blob-float absolute -left-12 top-10 h-44 w-44 rounded-[46%_54%_64%_36%/47%_40%_60%_53%] bg-[#FF6B6B]/35 blur-2xl" />
        <div className="blob-float absolute right-10 top-8 h-40 w-40 rounded-[62%_38%_42%_58%/43%_61%_39%_57%] bg-[#4ECDC4]/35 blur-xl [animation-delay:0.8s]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_35%)]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="text-center lg:text-left">
          <span className="inline-flex rounded-full border-2 border-[#1E1E1E]/15 bg-white/65 px-4 py-1 text-xs font-semibold text-[#1E1E1E]">
            Học như chơi game
          </span>
          <h1 className="mt-4 text-[2.15rem] font-extrabold leading-[1.1] text-[#1E1E1E] sm:text-[3.25rem] md:text-[4.15rem]">
            Học luật mà tưởng
            <span className="block text-[#FF6B6B]">chơi game 🎮</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#1E1E1E]/85 lg:mx-0">
            Không còn học vẹt, học xong quên ngay. Học đúng flow để hiểu và làm được.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/flashcards"
              className="inline-flex scale-100 items-center justify-center rounded-2xl bg-[#F4A616] px-8 py-3.5 text-sm font-bold text-[#1E1E1E] shadow-[0_10px_30px_rgba(244,166,22,0.35)] transition duration-200 hover:scale-105"
            >
              Thử ngay
            </Link>
            <Link
              href="/exam"
              className="inline-flex scale-100 items-center justify-center rounded-2xl border-2 border-[#1E1E1E]/15 bg-white/70 px-8 py-3.5 text-sm font-semibold text-[#1E1E1E] transition duration-200 hover:scale-105"
            >
              Làm quiz mẫu
            </Link>
          </div>
        </Reveal>

        <Reveal delayMs={140}>
          <div className="rounded-[28px] border-2 border-white/60 bg-white/80 p-6 shadow-[0_18px_45px_rgba(30,30,30,0.16)] backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1E1E1E]/60">Preview trải nghiệm</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-[#FFF4D6] p-4">
                <p className="text-xs text-[#1E1E1E]/70">Mục tiêu hôm nay</p>
                <p className="mt-1 text-sm font-semibold text-[#1E1E1E]">5 phút · 8 câu hỏi</p>
              </div>
              <div className="rounded-2xl bg-[#1E1E1E] p-4 text-white">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span>Tiến độ</span>
                  <span className="font-semibold text-[#4ECDC4]">72%</span>
                </div>
                <div className="h-2 rounded-full bg-white/20">
                  <div className="h-2 w-[72%] rounded-full bg-[#4ECDC4]" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border-2 border-dashed border-[#F4A616]/70 bg-white p-4">
                <span className="text-sm text-[#1E1E1E]/80">Reward hôm nay</span>
                <span className="rounded-full bg-[#FF6B6B]/15 px-3 py-1 text-xs font-bold text-[#FF6B6B]">+120 XP</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
