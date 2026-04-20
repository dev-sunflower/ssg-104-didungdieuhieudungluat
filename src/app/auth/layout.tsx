import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/landing')

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[linear-gradient(160deg,#FFF4D6_0%,#FFE8A8_58%,#FFFFFF_100%)] p-4">
      {/* Blob decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] animate-blob rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,226,154,0.6) 0%, rgba(255,226,154,0) 70%)' }}
        />
        <div
          className="absolute top-[20%] -right-[10%] w-[45vw] h-[45vw] animate-blob animation-delay-2000 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(244,166,22,0.25) 0%, rgba(244,166,22,0) 70%)' }}
        />
        <div
          className="absolute -bottom-[20%] left-[15%] w-[60vw] h-[60vw] animate-blob animation-delay-4000 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(78,205,196,0.2) 0%, rgba(78,205,196,0) 70%)' }}
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

      <div className="relative w-full">
        {children}
      </div>
    </div>
  )
}
