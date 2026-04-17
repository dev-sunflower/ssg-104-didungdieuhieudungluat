import { Reveal } from '@/components/ui/Reveal'

export function HowItWorksSection() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 lg:grid-cols-[1fr_0.95fr]">
        <Reveal>
          <h2 className="text-3xl font-bold text-[#1E1E1E] md:text-4xl">Xem trước trải nghiệm học</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-[#1E1E1E]/75">
            Giao diện mô phỏng theo kiểu mobile-first để bạn thấy rõ flow: làm quiz, nhận phản hồi, tăng tiến độ.
          </p>

          <div className="mt-6 space-y-3">
            <div className="inline-flex rounded-2xl bg-[#FFF4D6] px-4 py-2 text-sm font-medium text-[#1E1E1E]">
              📱 Demo mobile app
            </div>
            <div className="inline-flex rounded-2xl bg-[#4ECDC4]/20 px-4 py-2 text-sm font-medium text-[#1E1E1E]">
              ✅ Quiz UI + Progress bar
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={140}>
          <div className="mx-auto w-full max-w-[340px] rounded-[36px] border-[10px] border-[#1E1E1E] bg-white p-5 shadow-[0_25px_45px_rgba(30,30,30,0.16)]">
            <div className="rounded-2xl bg-[#FFF4D6] p-4">
              <p className="text-xs text-[#1E1E1E]/65">Hôm nay bạn đã học</p>
              <p className="mt-1 text-sm font-bold text-[#1E1E1E]">12 / 15 câu</p>
              <div className="mt-3 h-2 rounded-full bg-[#1E1E1E]/10">
                <div className="h-2 w-[80%] rounded-full bg-[#F4A616]" />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border-2 border-[#1E1E1E]/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1E1E1E]/55">Quiz nhanh</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#1E1E1E]">
                Biển nào báo cấm quay đầu tại nơi giao nhau?
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="rounded-xl border border-[#1E1E1E]/12 p-2.5">A. Biển tròn đỏ nền trắng</div>
                <div className="rounded-xl border-2 border-[#4ECDC4] bg-[#4ECDC4]/10 p-2.5 font-semibold">
                  B. Biển cấm quay đầu
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

