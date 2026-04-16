import Link from 'next/link'
import { Button, Card, Chip } from '@heroui/react'
import Navbar from '@/components/layout/Navbar'

const stats = [
  { value: '600+', label: 'Câu hỏi', icon: '❓' },
  { value: '4',    label: 'Hạng bằng', icon: '🪪' },
  { value: '100%', label: 'Miễn phí', icon: '🎁' },
  { value: '24/7', label: 'Luyện tập', icon: '⏰' },
]

const licenseTypes = [
  { code: 'A1', name: 'Xe máy dưới 175cc', total: 25, pass: 21, emoji: '🛵', color: 'from-orange-400 to-amber-400' },
  { code: 'A2', name: 'Xe máy trên 175cc',  total: 25, pass: 21, emoji: '🏍️', color: 'from-rose-400 to-pink-400'   },
  { code: 'B1', name: 'Ô tô không kinh doanh', total: 30, pass: 24, emoji: '🚗', color: 'from-blue-400 to-indigo-400' },
  { code: 'B2', name: 'Ô tô kinh doanh vận tải', total: 35, pass: 29, emoji: '🚌', color: 'from-emerald-400 to-teal-400' },
]

const features = [
  {
    icon: '📚',
    title: 'Flashcard thông minh',
    desc: 'Lật thẻ ôn luyện từng câu — hiển thị đáp án và giải thích chi tiết.',
    href: '/flashcards',
    cta: 'Học ngay',
    gradient: 'from-orange-500 to-rose-500',
    glow: 'shadow-orange-500/20',
    badge: 'Phổ biến',
  },
  {
    icon: '📝',
    title: 'Thi thử sát hạch',
    desc: 'Đề thi mô phỏng theo đúng cấu trúc Bộ GTVT. Chấm điểm tự động.',
    href: '/exam',
    cta: 'Luyện thi',
    gradient: 'from-blue-500 to-indigo-500',
    glow: 'shadow-blue-500/20',
    badge: 'Hiệu quả',
  },
  {
    icon: '🎮',
    title: 'Trò chơi biển báo',
    desc: 'Nhận biết biển báo theo thời gian. Học mà chơi, chơi mà học!',
    href: '/road-signs',
    cta: 'Chơi ngay',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
    badge: 'Sắp ra mắt',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pb-24 md:pb-8">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 md:w-[600px] md:h-[600px] bg-orange-300/20 dark:bg-orange-900/10 rounded-full blur-3xl" />
          <div className="absolute top-20 -left-20 w-64 h-64 md:w-[400px] md:h-[400px] bg-rose-300/15 dark:bg-rose-900/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 pt-12 md:pt-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold tracking-widest uppercase mb-6">
            🇻🇳 Ôn thi lý thuyết lái xe Việt Nam
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-5">
            Đi đúng đường<br />
            <span className="gradient-text">Hiểu đúng luật</span>
          </h1>

          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Ôn luyện lý thuyết lái xe <strong className="text-slate-700 dark:text-slate-200">A1, A2, B1, B2</strong> miễn phí — flashcard, thi thử và trò chơi tương tác.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <Link href="/flashcards" className="flex-1 sm:flex-none">
              <Button
                id="hero-cta-learn"
                fullWidth
                className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold py-3.5 px-8 rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:-translate-y-0.5"
              >
                📚 Học ngay
              </Button>
            </Link>
            <Link href="/exam" className="flex-1 sm:flex-none">
              <Button
                id="hero-cta-exam"
                fullWidth
                variant="outline"
                className="border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold py-3.5 px-8 rounded-2xl hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all hover:-translate-y-0.5"
              >
                📝 Thi thử ngay
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-lg mx-auto mt-12">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5">
                <span className="text-xl md:text-2xl">{s.icon}</span>
                <span className="text-base md:text-xl font-black text-orange-500">{s.value}</span>
                <span className="text-[10px] md:text-xs text-slate-400 text-center leading-tight">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── License type cards ───────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Chọn hạng bằng lái</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Ngân hàng câu hỏi theo đúng quy định Bộ GTVT</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {licenseTypes.map((lt) => (
              <Link key={lt.code} href={`/exam?type=${lt.code}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-slate-200 dark:border-slate-700">
                  <Card.Content className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${lt.color} flex items-center justify-center text-2xl shadow-sm`}>
                        {lt.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-orange-500 text-base">{lt.code}</span>
                          <span className="font-semibold text-slate-800 dark:text-white text-sm truncate">{lt.name}</span>
                        </div>
                        <div className="flex gap-3 mt-1">
                          <Chip size="sm" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {lt.total} câu
                          </Chip>
                          <Chip size="sm" className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                            Đạt {lt.pass}/{lt.total}
                          </Chip>
                        </div>
                      </div>
                      <span className="text-slate-300 group-hover:text-orange-400 text-lg transition-colors">→</span>
                    </div>
                  </Card.Content>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Tất cả công cụ bạn cần</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <Card key={f.title} className={`overflow-hidden shadow-lg ${f.glow} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className={`h-1 bg-gradient-to-r ${f.gradient}`} />
                <Card.Content className="p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{f.icon}</span>
                    <Chip size="sm" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {f.badge}
                    </Chip>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-base">{f.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                  <Link href={f.href} className="mt-auto">
                    <Button
                      fullWidth
                      className={`bg-gradient-to-r ${f.gradient} text-white font-semibold rounded-xl py-2.5 text-sm`}
                    >
                      {f.cta} →
                    </Button>
                  </Link>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="pb-24 md:pb-8 pt-8 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-xs">🛡️</span>
          <span className="font-black text-sm">
            <span className="text-orange-500">SSG</span>
            <span className="text-slate-700 dark:text-white">104</span>
          </span>
        </div>
        <p className="text-xs text-slate-400">Đi Đúng Điều Hiểu Đúng Luật · © 2025</p>
        <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Dữ liệu câu hỏi theo quy định Bộ Giao thông Vận tải Việt Nam</p>
      </footer>
    </div>
  )
}
