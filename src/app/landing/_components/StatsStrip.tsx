import { Reveal } from '@/components/ui/Reveal'

const pains = [
  {
    icon: '😵',
    title: 'Học lý thuyết rồi quên nhanh',
    desc: 'Đọc nhiều nhưng vào tình huống thật lại không nhớ nổi.',
  },
  {
    icon: '🤷',
    title: 'Thi xong nhưng không áp dụng',
    desc: 'Làm bài được điểm nhưng vẫn lúng túng khi ra đường.',
  },
  {
    icon: '🎭',
    title: 'Tự tin ảo trước kỳ thi',
    desc: 'Nghĩ mình ổn, đến lúc thi thật lại mất bình tĩnh và sai liên tiếp.',
  },
]

export function StatsStrip() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[#1E1E1E] md:text-4xl">Bạn có thấy mình ở đây không?</h2>
          <p className="mt-3 text-[#1E1E1E]/70">Nếu “đúng mình luôn”, bạn không một mình đâu.</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {pains.map((pain, idx) => (
            <Reveal key={pain.title} delayMs={idx * 120}>
              <article className="rounded-[24px] border-2 border-[#1E1E1E]/8 bg-white p-6 shadow-[0_10px_30px_rgba(30,30,30,0.06)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_20px_35px_rgba(30,30,30,0.1)]">
                <div className="inline-flex rounded-2xl bg-[#FFF4D6] p-2 text-2xl">{pain.icon}</div>
                <h3 className="mt-4 text-xl font-bold text-[#1E1E1E]">{pain.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#1E1E1E]/70">{pain.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

