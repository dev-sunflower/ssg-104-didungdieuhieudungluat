import { Reveal } from '@/components/ui/Reveal'

const feedbacks = [
  {
    name: 'Trung, sinh viên',
    quote: 'Mình học 10 phút trước khi ngủ, vào phòng thi thật bớt run hẳn.',
  },
  {
    name: 'Linh, nhân viên văn phòng',
    quote: 'Cách học kiểu quiz làm mình tập trung hơn hẳn so với học thuộc.',
  },
]

export function SocialProofSection() {
  return (
    <section className="bg-[#FFF4D6] py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <p className="text-4xl font-extrabold text-[#1E1E1E] md:text-5xl">1000+ users</p>
          <p className="mt-2 text-[#1E1E1E]/70">đã dùng để luyện thi mỗi ngày</p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {feedbacks.map((item, idx) => (
            <Reveal key={item.name} delayMs={idx * 100}>
              <article className="rounded-[24px] border-2 border-[#1E1E1E]/10 bg-white p-6 shadow-[0_12px_28px_rgba(30,30,30,0.08)]">
                <p className="text-lg leading-relaxed text-[#1E1E1E]">“{item.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-[#1E1E1E]/65">{item.name}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

