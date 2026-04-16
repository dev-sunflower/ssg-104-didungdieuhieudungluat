import Link from 'next/link'
import { SectionHeading, Body } from '@/components/ui/Typography'
import { Section } from '@/components/ui/Section'

const features = [
  {
    title: 'Flashcard ôn luyện',
    desc: 'Lật thẻ từng câu — hiển thị đáp án và giải thích chi tiết. Lọc theo hạng bằng và chủ đề.',
    href: '/flashcards',
    cta: 'Học ngay',
    badge: 'Phổ biến',
  },
  {
    title: 'Thi thử sát hạch',
    desc: 'Đề thi mô phỏng theo đúng cấu trúc Bộ GTVT. Chấm điểm tự động, có câu điểm liệt.',
    href: '/exam',
    cta: 'Luyện thi',
    badge: 'Hiệu quả',
  },
  {
    title: 'Trò chơi biển báo',
    desc: 'Nhận biết biển báo theo thời gian. Học mà chơi, chơi mà học!',
    href: '/road-signs',
    cta: 'Xem trước',
    badge: 'Sắp ra mắt',
  },
]

export function FeaturesSection() {
  return (
    <Section dark id="features">
      <div className="text-center mb-14">
        <SectionHeading className="text-ivory text-[2rem] md:text-[3.25rem]">
          Tất cả công cụ<br />bạn cần
        </SectionHeading>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-bg-dark-card border border-border-dark rounded-2xl p-8 flex flex-col gap-5 shadow-whisper"
          >
            <span className="text-[0.63rem] font-medium uppercase tracking-[0.5px] text-text-inverted-secondary">
              {f.badge}
            </span>
            <div className="flex flex-col gap-3 flex-1">
              <h3 className="heading-feature text-ivory">{f.title}</h3>
              <Body className="text-warm-silver leading-relaxed">{f.desc}</Body>
            </div>
            <Link
              href={f.href}
              className="inline-flex items-center justify-center w-full rounded-xl border border-border-dark text-ivory py-2.5 text-sm font-medium hover:bg-dark-warm transition-colors"
            >
              {f.cta} →
            </Link>
          </div>
        ))}
      </div>
    </Section>
  )
}
