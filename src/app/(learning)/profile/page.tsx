import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@heroui/react'
import { ProfileForm } from './_components/ProfileForm'
import { LuChartBar, LuTag, LuSettings, LuRotateCcw } from 'react-icons/lu'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { data: exams } = await supabase
    .from('exam_sessions')
    .select('*, license_types(code)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const totalExams = exams?.length || 0
  const passedExams = exams?.filter((e) => e.passed).length || 0
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0

  const displayInitial = (profile?.display_name || user.email || 'U').charAt(0).toUpperCase()
  const formattedDate = new Date(user.created_at).toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-3xl border border-[#1E1E1E]/10 bg-[linear-gradient(145deg,#FFF4D6_0%,#FFE8A8_100%)] p-6 md:p-8">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#F4A616] text-4xl font-serif font-medium text-[#1E1E1E] shadow-md sm:h-28 sm:w-28 sm:text-5xl">
            {displayInitial}
          </div>
          <div className="mt-1 flex flex-col gap-1 md:mt-2">
            <h1 className="text-3xl font-extrabold text-[#1E1E1E]">{profile?.display_name || 'Học viên ẩn danh'}</h1>
            <p className="text-sm text-[#1E1E1E]/75">{user.email}</p>
            <p className="mt-2 text-xs font-medium tracking-wide text-[#1E1E1E]/55">THÀNH VIÊN TỪ {formattedDate.toUpperCase()}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#1E1E1E]">
          <LuChartBar size={18} className="text-[#1E1E1E]/65" /> Tổng quan học tập
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-[#1E1E1E]/10 bg-white p-5 shadow-[0_10px_30px_rgba(30,30,30,0.06)]">
            <p className="mb-1 text-sm text-text-secondary">Số đề thi đã làm</p>
            <p className="font-serif text-3xl text-text-primary">{totalExams}</p>
          </Card>
          <Card className="border-[#1E1E1E]/10 bg-white p-5 shadow-[0_10px_30px_rgba(30,30,30,0.06)]">
            <p className="mb-1 text-sm text-text-secondary">Số đề thi đạt</p>
            <p className="font-serif text-3xl text-[#F4A616]">{passedExams}</p>
          </Card>
          <Card className="border-[#1E1E1E]/10 bg-white p-5 shadow-[0_10px_30px_rgba(30,30,30,0.06)]">
            <p className="mb-1 text-sm text-text-secondary">Tỉ lệ hoàn thành</p>
            <p className="font-serif text-3xl text-text-primary">{passRate}%</p>
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-[#1E1E1E]">
            <LuTag size={16} className="text-[#1E1E1E]/65" /> Lịch sử đề thi
          </h2>

          <div className="flex flex-col gap-3">
            {exams && exams.length > 0 ? (
              exams.slice(0, 5).map((exam) => {
                const lcCode = (exam.license_types as any)?.code || '—'
                const date = new Date(exam.created_at).toLocaleDateString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                })

                return (
                  <Card key={exam.id} className="flex flex-row items-center gap-4 border-[#1E1E1E]/10 bg-white p-4 shadow-sm">
                    <div
                      className={[
                        'flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full text-xs font-bold',
                        exam.passed ? 'bg-[#F4A616]/20 text-[#1E1E1E]' : 'bg-crimson/10 text-crimson',
                      ].join(' ')}
                    >
                      {exam.passed ? 'ĐẠT' : 'TRƯỢT'}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-text-primary">Đề thi hạng {lcCode}</p>
                        <span className="rounded bg-[#FFF4D6] px-1.5 py-0.5 text-[10px] text-text-tertiary">{date}</span>
                      </div>
                      <p className="text-xs text-text-secondary">Hệ thống ghi nhận: {exam.score}/{exam.total_questions} điểm</p>
                    </div>

                    <Link href="/exam" className="shrink-0 px-2 text-text-tertiary transition-colors hover:text-[#F4A616]" title="Thi lại">
                      <LuRotateCcw size={18} />
                    </Link>
                  </Card>
                )
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-[#1E1E1E]/18 bg-white/70 px-6 py-8 text-center">
                <p className="mb-4 text-sm text-text-tertiary">Bạn chưa tham gia bài thi nào.</p>
                <Link
                  href="/exam"
                  className="inline-flex rounded-2xl bg-[#F4A616] px-5 py-2.5 text-sm font-semibold text-[#1E1E1E] transition-colors hover:bg-[#e59b11]"
                >
                  Thi thử ngay
                </Link>
              </div>
            )}

            {exams && exams.length > 5 && <p className="mt-2 text-center text-xs italic text-text-tertiary">(Đang hiển thị 5 bài thi gần nhất)</p>}
          </div>
        </div>

        <Card className="sticky top-24 border-[#1E1E1E]/10 bg-white p-6 shadow-[0_10px_30px_rgba(30,30,30,0.06)] lg:col-span-5">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#1E1E1E]">
            <LuSettings size={16} className="text-[#1E1E1E]/65" /> Cài đặt tài khoản
          </h2>
          <ProfileForm initialName={profile?.display_name || ''} />
        </Card>
      </section>
    </div>
  )
}
