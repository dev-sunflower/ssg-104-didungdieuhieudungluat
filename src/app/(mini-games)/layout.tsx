import Navbar from '@/components/layout/Navbar'

export default function MiniGamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-page">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}
