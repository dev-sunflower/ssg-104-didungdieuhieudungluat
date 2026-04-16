import Link from 'next/link'
import { SubheadingLg, Body, Caption } from '@/components/ui/Typography'
import { Section } from '@/components/ui/Section'

const licenseTypes = [
  { code: 'A1', name: 'Xe máy dưới 175cc',      total: 25, pass: 21 },
  { code: 'A2', name: 'Xe máy trên 175cc',       total: 25, pass: 21 },
  { code: 'B1', name: 'Ô tô không kinh doanh',   total: 30, pass: 24 },
  { code: 'B2', name: 'Ô tô kinh doanh vận tải', total: 35, pass: 29 },
]

export function LicenseTypesSection() {
  return (
    <Section id="license-types">
      <div className="text-center mb-14">
        <SubheadingLg className="text-[2rem] md:text-[2.3rem]">
          Chọn hạng bằng lái
        </SubheadingLg>
        <Body className="mt-3">
          Ngân hàng câu hỏi theo đúng quy định Bộ GTVT
        </Body>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {licenseTypes.map((lt) => (
          <Link key={lt.code} href={`/exam?type=${lt.code}`}>
            <div className="group flex items-center gap-5 bg-bg-card border border-border rounded-xl p-6 hover:shadow-whisper hover:border-border-strong transition-all duration-200">
              <div className="w-14 h-14 shrink-0 rounded-xl bg-bg-subtle border border-border-strong flex items-center justify-center">
                <span className="heading-feature text-brand">{lt.code}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary text-sm mb-1">{lt.name}</p>
                <Caption>
                  {lt.total} câu · Đạt {lt.pass}/{lt.total}
                </Caption>
              </div>
              <span className="text-text-tertiary group-hover:text-brand transition-colors text-lg">→</span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  )
}
