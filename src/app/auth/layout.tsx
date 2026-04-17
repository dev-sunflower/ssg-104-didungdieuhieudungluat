import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/landing')

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(160deg,#FFF4D6_0%,#FFE8A8_58%,#FFFFFF_100%)] p-4">
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-[42%_58%_63%_37%/36%_45%_55%_64%] bg-[#FF6B6B]/25 blur-xl" />
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-[57%_43%_41%_59%/56%_49%_51%_44%] bg-[#4ECDC4]/25 blur-lg" />
        {children}
      </div>
    </div>
  )
}
