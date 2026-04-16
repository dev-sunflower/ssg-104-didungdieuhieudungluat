import Navbar from '@/components/layout/Navbar'

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      {/* pb-20 gives room for the mobile bottom nav */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}
