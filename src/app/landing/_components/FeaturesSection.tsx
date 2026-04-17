import { Reveal } from '@/components/ui/Reveal'

const features = [
  {
    icon: '⚡',
    title: 'Học 5 phút',
    desc: 'Không cần ngồi hàng giờ. Mỗi ngày vài phút vẫn tăng đều.',
    color: '#F4A616',
  },
  {
    icon: '🎯',
    title: 'Case thực tế',
    desc: 'Tập trung vào câu hỏi có khả năng gặp ngoài đường.',
    color: '#FF6B6B',
  },
  {
    icon: '🧠',
    title: 'Nhớ lâu',
    desc: 'Học theo cơ chế lặp lại thông minh và phản hồi tức thì.',
    color: '#4ECDC4',
  },
  {
    icon: '🔥',
    title: 'Tracking tiến bộ',
    desc: 'Biết mình đang ở đâu để không học mơ hồ.',
    color: '#1E1E1E',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-[#FFF4D6] py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[#1E1E1E] md:text-4xl">Đủ giá trị để bạn tin tưởng</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <Reveal key={feature.title} delayMs={idx * 90}>
              <article className="h-full rounded-[24px] border-2 border-[#1E1E1E]/10 bg-white p-6 shadow-[0_10px_30px_rgba(30,30,30,0.06)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_20px_38px_rgba(30,30,30,0.12)]">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-xl font-bold text-[#1E1E1E]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1E1E1E]/70">{feature.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

