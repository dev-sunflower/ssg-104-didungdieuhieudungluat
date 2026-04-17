import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

const values = [
  {
    title: 'Quiz nhanh',
    desc: 'Mỗi phiên ngắn gọn, phản xạ nhanh như đang chơi game.',
  },
  {
    title: 'Case thực tế',
    desc: 'Học theo ngữ cảnh giao thông thật, không học thuộc vẹt.',
  },
  {
    title: 'Feedback ngay',
    desc: 'Sai ở đâu biết ngay ở đó, sửa liền trong lúc còn nhớ.',
  },
]

export function LicenseTypesSection() {
  return (
    <section className="bg-[#F4A616] py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Có lối thoát rồi</h2>
          <p className="mt-3 text-white/90">Học theo vòng lặp thưởng tức thì để bạn thấy tiến bộ ngay.</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {values.map((item, idx) => (
            <Reveal key={item.title} delayMs={idx * 110}>
              <article className="rounded-[24px] border-2 border-white/35 bg-white/14 p-6 text-white backdrop-blur-sm transition duration-200 hover:-translate-y-1.5 hover:bg-white/20">
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/90">{item.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={260} className="mt-8 text-center">
          <Link
            href="/flashcards"
            className="inline-flex scale-100 items-center justify-center rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-[#1E1E1E] shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition duration-200 hover:scale-105"
          >
            Bắt đầu với quiz 5 phút
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

