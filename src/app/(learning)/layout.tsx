import Navbar from '@/components/layout/Navbar'

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[linear-gradient(180deg,#FFF4D6_0%,#FFF9EA_36%,#FFFFFF_100%)]">
      {/* Blob decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] animate-blob rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,226,154,0.55) 0%, rgba(255,226,154,0) 70%)' }}
        />
        <div
          className="absolute top-[15%] -right-[10%] w-[42vw] h-[42vw] animate-blob animation-delay-2000 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(244,166,22,0.2) 0%, rgba(244,166,22,0) 70%)' }}
        />
        <div
          className="absolute -bottom-[15%] left-[20%] w-[55vw] h-[55vw] animate-blob animation-delay-4000 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(78,205,196,0.15) 0%, rgba(78,205,196,0) 70%)' }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          }}
        />
      </div>

      <Navbar />
      <main className="relative flex-1 w-full px-4 py-6 pb-24 md:px-8 md:pb-8">
        {children}
      </main>
    </div>
  )
}
