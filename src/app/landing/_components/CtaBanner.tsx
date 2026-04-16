import Link from 'next/link'
import { SectionHeading, Body } from '@/components/ui/Typography'
import { Section } from '@/components/ui/Section'

export function CtaBanner() {
  return (
    <Section id="cta">
      <div className="text-center max-w-2xl mx-auto">
        <SectionHeading className="text-[2rem] md:text-[3.25rem] mb-6">
          Bắt đầu ôn thi<br />ngay hôm nay
        </SectionHeading>
        <Body className="mb-10">
          Miễn phí hoàn toàn. Không cần tạo tài khoản để học.
        </Body>
        <Link
          href="/flashcards"
          className="inline-flex items-center justify-center bg-brand text-ivory rounded-xl px-10 py-3.5 font-medium text-sm shadow-ring-brand hover:bg-brand-hover transition-colors"
        >
          Bắt đầu học ngay →
        </Link>
      </div>
    </Section>
  )
}
