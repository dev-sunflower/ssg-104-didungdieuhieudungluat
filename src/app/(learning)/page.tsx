'use client'

import Link from 'next/link'
import { LuLayers, LuFileText, LuGamepad2, LuStar, LuTrophy, LuHistory } from 'react-icons/lu'
import { Card, Button } from '@heroui/react'

export default function LearningDashboardPage() {
  const tools = [
    {
      title: 'Ôn tập Flashcards',
      description: 'Ghi nhớ nhanh các câu hỏi bằng phương pháp lặp lại ngắt quãng.',
      icon: LuLayers,
      href: '/flashcards',
      color: 'bg-orange-100 text-orange-600',
      btnColor: 'bg-orange-600'
    },
    {
      title: 'Thi sát hạch thử',
      description: 'Làm đề thi như thật với bộ câu hỏi sát thực tế và tính thời gian.',
      icon: LuFileText,
      href: '/exam',
      color: 'bg-blue-100 text-blue-600',
      btnColor: 'bg-blue-600'
    },
    {
      title: 'Học biển báo',
      description: 'Nhận diện và ghi nhớ ý nghĩa của tất cả các loại biển báo giao thông.',
      icon: LuGamepad2,
      href: '/road-signs',
      color: 'bg-emerald-100 text-emerald-600',
      btnColor: 'bg-emerald-600'
    }
  ]

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Chào mừng bạn trở lại! 👋</h1>
        <p className="text-text-secondary font-medium">Bạn muốn bắt đầu học gì hôm nay?</p>
      </div>

      {/* Main Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <Card className="h-full border-border/50 hover:border-brand/50 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300 overflow-hidden">
              <div className="p-6 flex flex-col h-full">
                <div className={`w-12 h-12 rounded-2xl ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon size={24} />
                </div>
                <h3 className="text-xl font-black text-text-primary mb-2">{tool.title}</h3>
                <p className="text-sm text-text-tertiary font-medium mb-6 flex-1">
                  {tool.description}
                </p>
                <div className="flex items-center text-sm font-black text-text-primary group-hover:gap-2 transition-all">
                  BẮT ĐẦU NGAY <span className="opacity-0 group-hover:opacity-100 transition-all">→</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats / Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <Card className="p-6 border-border/50 bg-bg-subtle/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand/20 text-brand flex items-center justify-center">
              <LuTrophy size={20} />
            </div>
            <div>
              <h4 className="font-black text-text-primary">Mục tiêu hôm nay</h4>
              <p className="text-xs text-text-tertiary font-bold uppercase tracking-wider">Hoàn thành 1 đề thi</p>
            </div>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <div className="h-full bg-brand w-1/3 rounded-full" />
          </div>
        </Card>

        <Card className="p-6 border-border/50 bg-bg-subtle/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <LuHistory size={20} />
            </div>
            <div>
              <h4 className="font-black text-text-primary">Lịch sử ôn tập</h4>
              <p className="text-xs text-text-tertiary font-bold uppercase tracking-wider">Xem lại tiến độ của bạn</p>
            </div>
          </div>
          <Link href="/profile" className="text-xs font-black text-purple-600 uppercase hover:underline">
            XEM CHI TIẾT →
          </Link>
        </Card>
      </div>
    </div>
  )
}
