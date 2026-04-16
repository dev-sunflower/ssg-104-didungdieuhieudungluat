import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@heroui/react'
import { ProfileForm } from './_components/ProfileForm'
import { LuChartBar, LuTag, LuSettings, LuRotateCcw } from 'react-icons/lu'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: exams } = await supabase
    .from('exam_sessions')
    .select('*, license_types(code)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const totalExams = exams?.length || 0
  const passedExams = exams?.filter(e => e.passed).length || 0
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0

  const displayInitial = (profile?.display_name || user.email || 'U').charAt(0).toUpperCase()
  const formattedDate = new Date(user.created_at).toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="flex flex-col gap-10">

      {/* ── 1. Hero Overview ─────────────────────────────── */}
      <section className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
        <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-brand flex items-center justify-center text-ivory text-4xl sm:text-5xl font-serif font-medium shadow-whisper border-4 border-bg-page">
          {displayInitial}
        </div>
        <div className="flex flex-col justify-center gap-1 mt-2 md:mt-4">
          <h1 className="heading-sub text-text-primary">
            {profile?.display_name || 'Học viên ẩn danh'}
          </h1>
          <p className="text-text-secondary text-sm">{user.email}</p>
          <p className="text-text-tertiary text-xs mt-2 font-medium tracking-wide">
            THÀNH VIÊN TỪ {formattedDate.toUpperCase()}
          </p>
        </div>
      </section>

      {/* ── 2. Stats ─────────────────────────────────────── */}
      <section>
        <h2 className="heading-feature text-text-primary mb-4 flex items-center gap-2">
          <LuChartBar size={18} className="text-text-secondary" />
          Tổng quan học tập
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border bg-bg-card shadow-whisper p-5">
            <p className="text-sm text-text-secondary mb-1">Số đề thi đã làm</p>
            <p className="text-3xl font-serif text-text-primary">{totalExams}</p>
          </Card>
          <Card className="border-border bg-bg-card shadow-whisper p-5">
            <p className="text-sm text-text-secondary mb-1">Số đề thi đạt</p>
            <p className="text-3xl font-serif text-brand">{passedExams}</p>
          </Card>
          <Card className="border-border bg-bg-card shadow-whisper p-5">
            <p className="text-sm text-text-secondary mb-1">Tỉ lệ hoàn thành</p>
            <p className="text-3xl font-serif text-text-primary">{passRate}%</p>
          </Card>
        </div>
      </section>

      {/* ── 3. History + Settings ────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Lịch sử thi */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h2 className="heading-feature text-text-primary mb-2 flex items-center gap-2">
            <LuTag size={16} className="text-text-secondary" />
            Lịch sử đề thi
          </h2>

          <div className="flex flex-col gap-3">
            {exams && exams.length > 0 ? (
              exams.slice(0, 5).map((exam) => {
                const lcCode = (exam.license_types as any)?.code || '—'
                const date = new Date(exam.created_at).toLocaleDateString('vi-VN', {
                  hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
                })

                return (
                  <Card key={exam.id} className="border-border bg-bg-card shadow-sm p-4 flex flex-row items-center gap-4">
                    <div className={[
                      'shrink-0 w-12 h-12 rounded-full flex flex-col items-center justify-center font-bold text-xs',
                      exam.passed ? 'bg-warm-sand text-brand' : 'bg-crimson/10 text-crimson'
                    ].join(' ')}>
                      {exam.passed ? 'ĐẠT' : 'TRƯỢT'}
                    </div>

                    <div className="flex-1 flex flex-col min-w-0 gap-0.5">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-text-primary text-sm truncate">
                          Đề thi hạng {lcCode}
                        </p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-subtle text-text-tertiary">
                          {date}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        Hệ thống ghi nhận: {exam.score}/{exam.total_questions} điểm
                      </p>
                    </div>

                    <Link
                      href="/exam"
                      className="shrink-0 text-text-tertiary hover:text-brand px-2 transition-colors"
                      title="Thi lại"
                    >
                      <LuRotateCcw size={18} />
                    </Link>
                  </Card>
                )
              })
            ) : (
              <div className="py-8 px-6 text-center border border-dashed border-border rounded-2xl bg-bg-card/50">
                <p className="text-text-tertiary text-sm mb-4">Bạn chưa tham gia bài thi nào.</p>
                <Link
                  href="/exam"
                  className="inline-flex bg-brand text-ivory text-sm font-medium px-5 py-2.5 rounded-xl shadow-ring-brand hover:bg-brand-hover transition-colors"
                >
                  Thi thử ngay
                </Link>
              </div>
            )}

            {exams && exams.length > 5 && (
              <p className="text-xs text-text-tertiary text-center mt-2 italic">
                (Đang hiển thị 5 bài thi gần nhất)
              </p>
            )}
          </div>
        </div>

        {/* Cài đặt */}
        <Card className="lg:col-span-5 border-border bg-bg-card shadow-whisper p-6 sticky top-24">
          <h2 className="heading-feature text-text-primary mb-6 flex items-center gap-2">
            <LuSettings size={16} className="text-text-secondary" />
            Cài đặt tài khoản
          </h2>
          <ProfileForm initialName={profile?.display_name || ''} />
        </Card>

      </section>
    </div>
  )
}
