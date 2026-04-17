import Navbar from '@/components/layout/Navbar'

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,#FFF4D6_0%,#FFF9EA_36%,#FFFFFF_100%)]">
      <Navbar />
      <main className="relative flex-1 w-full mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-8">
        <div className="pointer-events-none absolute inset-x-4 top-2 h-24 rounded-[28px] bg-[radial-gradient(circle_at_20%_30%,rgba(244,166,22,0.18),transparent_40%),radial-gradient(circle_at_85%_40%,rgba(78,205,196,0.18),transparent_34%)]" />
        <div className="relative rounded-[28px] border border-[#1E1E1E]/10 bg-white/80 p-4 shadow-[0_14px_40px_rgba(30,30,30,0.08)] backdrop-blur-sm md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
