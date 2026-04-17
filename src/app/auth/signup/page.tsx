'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Input } from '@heroui/react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="w-full max-w-sm px-4">
      <div className="rounded-3xl border border-[#1E1E1E]/10 bg-white/88 p-9 shadow-[0_18px_40px_rgba(30,30,30,0.12)] backdrop-blur-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1E1E1E]/12 bg-[#FFF4D6]">
            <span className="text-xl font-medium text-[#F4A616]">✎</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1E1E1E]">Đăng ký tài khoản</h1>
          <p className="mt-1 text-[0.88rem] text-[#1E1E1E]/70">Hoàn toàn miễn phí, không cần mật khẩu</p>
        </div>

        {sent ? (
          <div className="py-4 text-center">
            <div className="mb-3 text-4xl">📬</div>
            <h2 className="mb-2 text-lg font-bold text-[#1E1E1E]">Xác nhận email!</h2>
            <p className="text-[0.88rem] leading-relaxed text-[#1E1E1E]/75">
              Link xác nhận đã gửi đến <strong className="font-medium text-[#1E1E1E]">{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[0.88rem] font-medium text-text-primary">Địa chỉ email</label>
              <Input
                id="signup-email"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="ban@example.com"
                className="rounded-2xl border border-[#1E1E1E]/14 bg-white text-text-primary placeholder:text-text-tertiary focus:border-[#F4A616] focus:outline-none"
              />
            </div>

            {error && <div className="rounded-xl border border-crimson/20 bg-crimson/10 px-3 py-2.5 text-sm text-crimson">⚠️ {error}</div>}

            <Button type="submit" fullWidth isDisabled={loading} className="rounded-2xl bg-[#F4A616] py-3 font-semibold text-[#1E1E1E] hover:bg-[#e59b11]">
              {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-[0.75rem] text-text-tertiary">
          Đã có tài khoản?{' '}
          <Link href="/auth/login" className="font-medium text-[#F4A616] transition-colors hover:text-[#e59b11]">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}
