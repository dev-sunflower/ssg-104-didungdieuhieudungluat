import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { LuLayers, LuFileText, LuGamepad2, LuTrophy, LuHistory } from 'react-icons/lu'
import { Card } from '@heroui/react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/landing')
  }

  // Fetch real stats
  const { data: exams } = await supabase
    .from('exam_sessions')
    .select('passed')
    .eq('user_id', user.id)

  const totalExams = exams?.length || 0
  const passedExams = exams?.filter(e => e.passed).length || 0
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0

  const tools = [
    {
      title: 'Ôn tập Flashcards',
      description: 'Ghi nhớ nhanh các câu hỏi bằng phương pháp lặp lại ngắt quãng.',
      icon: LuLayers,
      href: '/flashcards',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Thi sát hạch thử',
      description: 'Làm đề thi như thật với bộ câu hỏi sát thực tế và tính thời gian.',
      icon: LuFileText,
      href: '/exam',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Học biển báo',
      description: 'Nhận diện và ghi nhớ ý nghĩa của tất cả các loại biển báo giao thông.',
      icon: LuGamepad2,
      href: '/road-signs',
      color: 'bg-emerald-100 text-emerald-600',
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,#FFF4D6_0%,#FFF9EA_36%,#FFFFFF_100%)]">
      <Navbar />
      <main className="relative flex-1 w-full mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-8">
        {/* Background Decor */}
        <div className="pointer-events-none absolute inset-x-4 top-2 h-24 rounded-[28px] bg-[radial-gradient(circle_at_20%_30%,rgba(244,166,22,0.18),transparent_40%),radial-gradient(circle_at_85%_40%,rgba(78,205,196,0.18),transparent_34%)]" />
        
        <div className="relative rounded-[28px] border border-[#1E1E1E]/10 bg-white/80 p-6 md:p-10 shadow-[0_14px_40px_rgba(30,30,30,0.08)] backdrop-blur-sm">
          <div className="flex flex-col gap-10">
            {/* Welcome Section */}
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-black text-text-primary tracking-tight md:text-5xl">Chào mừng bạn trở lại! 👋</h1>
              <p className="text-lg text-text-secondary font-medium">Hôm nay bạn đã đạt được {passRate}% lộ trình học tập.</p>
            </div>

            {/* Main Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <Link key={tool.href} href={tool.href} className="group">
                  <Card className="h-full border-border/50 hover:border-brand hover:shadow-2xl hover:shadow-brand/10 transition-all duration-300 overflow-hidden bg-white/50">
                    <div className="p-8 flex flex-col h-full">
                      <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                        <tool.icon size={28} />
                      </div>
                      <h3 className="text-2xl font-black text-text-primary mb-3">{tool.title}</h3>
                      <p className="text-[15px] text-text-tertiary font-medium mb-8 flex-1 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="flex items-center text-sm font-black text-text-primary group-hover:gap-3 transition-all tracking-widest uppercase">
                        BẮT ĐẦU NGAY <span className="opacity-0 group-hover:opacity-100 transition-all">→</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Quick Stats / Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-8 border-border/40 bg-bg-subtle/30 backdrop-blur-sm">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand/20 text-brand flex items-center justify-center shadow-sm">
                    <LuTrophy size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-text-primary">Tỉ lệ thi đạt</h4>
                    <p className="text-xs text-text-tertiary font-black uppercase tracking-widest mt-0.5">Dựa trên {totalExams} lần thi thử</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-3 flex-1 bg-border/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand transition-all duration-1000 shadow-[0_0_12px_rgba(244,166,22,0.4)]" 
                        style={{ width: `${passRate}%` }}
                      />
                    </div>
                    <span className="text-xl font-black text-text-primary">{passRate}%</span>
                </div>
              </Card>

              <Card className="p-8 border-border/40 bg-bg-subtle/30 backdrop-blur-sm flex flex-col justify-between">
                <div className="flex items-center gap-5 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
                    <LuHistory size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-text-primary">Lịch sử ôn tập</h4>
                    <p className="text-xs text-text-tertiary font-black uppercase tracking-widest mt-0.5">Đã làm {passedExams} bài thi đạt</p>
                  </div>
                </div>
                <Link href="/profile" className="text-sm font-black text-purple-600 uppercase hover:underline flex items-center gap-2 tracking-widest">
                  XEM CHI TIẾT TIẾN ĐỘ <span className="text-lg">→</span>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
