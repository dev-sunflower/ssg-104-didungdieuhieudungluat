import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { LuGamepad2 } from 'react-icons/lu'

export function Hero() {
  return (
    <section className="relative bg-[linear-gradient(135deg,#FFF4D6_0%,#FFE29A_65%,#F4A616_100%)] pt-20 pb-24 md:pt-32 md:pb-40 overflow-visible">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob-float absolute -left-12 top-10 h-44 w-44 rounded-[46%_54%_64%_36%/47%_40%_60%_53%] bg-[#FF6B6B]/35 blur-2xl" />
        <div className="blob-float absolute right-10 top-8 h-40 w-40 rounded-[62%_38%_42%_58%/43%_61%_39%_57%] bg-[#4ECDC4]/35 blur-xl [animation-delay:0.8s]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_35%)]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] z-10">
        <Reveal className="text-center lg:text-left">
          <span className="inline-flex rounded-full border-2 border-[#1E1E1E]/15 bg-white/65 px-4 py-1.5 text-xs font-black text-[#1E1E1E] uppercase tracking-wider shadow-sm">
            Học như chơi game 🎮 Chơi là nhớ ngay
          </span>
          <h1 className="mt-6 text-[2.5rem] font-black leading-[1] text-[#1E1E1E] sm:text-[3.5rem] md:text-[4.5rem] tracking-tight">
            Nhập tên,<br className="md:hidden" /> chơi ngay
            <span className="block text-[#FF6B6B] drop-shadow-sm">leo hạng Top 🏆</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-bold leading-relaxed text-[#1E1E1E]/80 lg:mx-0">
            Học luật giao thông chưa bao giờ cuốn thế này. <span className="underline decoration-[#1E1E1E] decoration-4 underline-offset-4 bg-white/30 px-2 rounded-lg">Không cần tài khoản</span>, vào là chiến ngay!
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/road-signs"
              className="inline-flex items-center justify-center rounded-2xl bg-[#1E1E1E] px-12 py-5 text-lg font-black text-white shadow-[0_20px_50px_rgba(30,30,30,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_25px_60px_rgba(30,30,30,0.4)]"
            >
              CHƠI NGAY
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center rounded-2xl border-3 border-[#1E1E1E]/10 bg-white/70 px-10 py-5 text-lg font-black text-[#1E1E1E] transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95"
            >
              Bảng xếp hạng
            </Link>
          </div>
        </Reveal>

        <Reveal delayMs={140} className="relative">
          <div className="rounded-[48px] border-4 border-white/60 bg-white/80 p-8 md:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.12)] backdrop-blur-xl rotate-2 hover:rotate-0 transition-transform duration-500 group">
            <div className="absolute -top-6 -left-6 bg-[#FF6B6B] text-white p-4 rounded-3xl shadow-xl -rotate-12 group-hover:rotate-0 transition-transform">
                <LuGamepad2 size={32} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-brand/10 border border-brand/20">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  <span className="font-bold text-sm">Anh#42</span>
                </div>
                <span className="font-bold text-sm text-brand">2,450 pts</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-bg-subtle text-text-tertiary flex items-center justify-center text-[10px] font-bold">2</span>
                  <span className="font-medium text-sm text-text-secondary">Minh Quân</span>
                </div>
                <span className="font-bold text-sm text-text-secondary">2,100 pts</span>
              </div>
              <div className="mt-6 p-4 rounded-2xl bg-[#1E1E1E] text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs opacity-70 italic">Luật chơi:</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Dễ hiểu ⚡</span>
                </div>
                <p className="text-sm font-medium">Nhìn biển báo, chọn ý nghĩa đúng nhanh nhất để nhân Combo!</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
