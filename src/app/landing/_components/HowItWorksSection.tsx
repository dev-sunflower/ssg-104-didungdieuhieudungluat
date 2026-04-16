import { SectionHeading, Body } from '@/components/ui/Typography'
import { Section } from '@/components/ui/Section'

const steps = [
  {
    number: '01',
    title: 'Chọn hạng bằng',
    desc: 'Chọn hạng A1, A2, B1 hoặc B2 tùy theo loại xe bạn muốn lái.',
  },
  {
    number: '02',
    title: 'Ôn với Flashcard',
    desc: 'Học từng câu với thẻ lật — xem đáp án và giải thích ngay lập tức.',
  },
  {
    number: '03',
    title: 'Kiểm tra với đề thi thử',
    desc: 'Thi mô phỏng đúng cấu trúc sát hạch, theo dõi điểm số và xem lại câu sai.',
  },
]

export function HowItWorksSection() {
  return (
    <Section dark id="how-it-works">
      <div className="text-center mb-14">
        <SectionHeading className="text-ivory text-[2rem] md:text-[3.25rem]">
          Cách sử dụng
        </SectionHeading>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s) => (
          <div key={s.number} className="flex flex-col gap-4">
            <span className="heading-sub-sm text-terracotta">{s.number}</span>
            <div className="w-full h-px bg-border-dark" />
            <h3 className="heading-feature text-ivory">{s.title}</h3>
            <Body className="text-warm-silver">{s.desc}</Body>
          </div>
        ))}
      </div>
    </Section>
  )
}
