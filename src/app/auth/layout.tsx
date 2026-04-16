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
    <div className="min-h-screen flex items-center justify-center bg-bg-page p-4">
      {children}
    </div>
  )
}
