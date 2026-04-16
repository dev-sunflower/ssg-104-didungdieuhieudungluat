import { createClient } from '@/lib/supabase/server'
import { Card } from '@heroui/react'
import Link from 'next/link'
import {
  LuCircleHelp,
  LuCreditCard,
  LuUsers,
  LuFileText,
  LuChartBar,
  LuZap,
  LuPlus,
} from 'react-icons/lu'
import type { IconType } from 'react-icons'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const [
    { count: questionCount },
    { count: licenseCount },
    { count: userCount },
    { count: sessionCount },
  ] = await Promise.all([
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('license_types').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('exam_sessions').select('*', { count: 'exact', head: true }),
  ])

  const stats: { label: string; value: number; icon: IconType; href: string; color: string; text: string }[] = [
    { label: 'Câu hỏi',      value: questionCount ?? 0, icon: LuCircleHelp,  href: '/admin/questions', color: 'from-blue-400 to-indigo-500',   text: 'text-blue-600 dark:text-blue-400' },
    { label: 'Hạng bằng',    value: licenseCount  ?? 0, icon: LuCreditCard,  href: '#',                color: 'from-orange-400 to-rose-400',   text: 'text-orange-600 dark:text-orange-400' },
    { label: 'Người dùng',   value: userCount     ?? 0, icon: LuUsers,       href: '#',                color: 'from-emerald-400 to-teal-500',  text: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Lượt thi thử', value: sessionCount  ?? 0, icon: LuFileText,    href: '#',                color: 'from-purple-400 to-violet-500', text: 'text-purple-600 dark:text-purple-400' },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="heading-sub-lg text-text-primary flex items-center gap-2">
          <LuChartBar size={28} className="text-text-secondary" />
          Tổng quan
        </h1>
        <p className="text-text-secondary text-sm mt-1">Thống kê hệ thống SSG104</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link key={s.label} href={s.href}>
              <Card className="border-border hover:shadow-whisper hover:-translate-y-0.5 transition-all duration-200 overflow-hidden bg-bg-card">
                <div className={`h-1 bg-gradient-to-r ${s.color}`} />
                <Card.Content className="p-5">
                  <Icon size={22} className={`mb-2 ${s.text}`} />
                  <div className={`text-3xl font-medium font-serif ${s.text}`}>{s.value}</div>
                  <div className="text-sm text-text-secondary mt-0.5">{s.label}</div>
                </Card.Content>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card className="border-border bg-bg-card">
        <Card.Header className="px-6 pt-5 pb-0">
          <Card.Title className="text-base heading-feature text-text-primary flex items-center gap-2">
            <LuZap size={16} className="text-text-secondary" />
            Thao tác nhanh
          </Card.Title>
        </Card.Header>
        <Card.Content className="px-6 py-4 flex flex-wrap gap-3">
          <Link
            href="/admin/questions"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-subtle border border-border text-text-primary text-sm font-medium hover:border-border-strong transition-colors"
          >
            <LuCircleHelp size={15} />
            Quản lý câu hỏi
          </Link>
          <Link
            href="/admin/questions/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-ivory text-sm font-medium shadow-ring-brand hover:bg-brand-hover transition-colors"
          >
            <LuPlus size={15} />
            Thêm câu hỏi mới
          </Link>
        </Card.Content>
      </Card>
    </div>
  )
}
