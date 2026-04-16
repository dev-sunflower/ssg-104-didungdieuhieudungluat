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
      <div className="bg-bg-card border border-border rounded-2xl p-10 shadow-whisper">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-bg-subtle border border-border-strong mb-4">
            <span className="font-serif font-medium text-brand text-xl">✎</span>
          </div>
          <h1 className="heading-sub text-text-primary" style={{ fontSize: '1.5rem' }}>Đăng ký tài khoản</h1>
          <p className="text-[0.88rem] text-text-secondary mt-1">Hoàn toàn miễn phí — không cần mật khẩu</p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">📬</div>
            <h2 className="heading-feature text-text-primary mb-2">Xác nhận email!</h2>
            <p className="text-[0.88rem] text-text-secondary leading-relaxed">
              Link xác nhận đã gửi đến{' '}
              <strong className="text-text-primary font-medium">{email}</strong>
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
                className="rounded-xl border border-border bg-bg-card text-text-primary placeholder:text-text-tertiary focus:border-focus-blue focus:outline-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-crimson/10 text-crimson text-sm border border-crimson/20">
                ⚠️ {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              isDisabled={loading}
              className="bg-brand text-ivory font-medium py-3 rounded-xl hover:bg-brand-hover transition-colors"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
            </Button>
          </form>
        )}

        <p className="text-center text-[0.75rem] text-text-tertiary mt-6">
          Đã có tài khoản?{' '}
          <Link href="/auth/login" className="text-brand hover:text-brand-hover font-medium transition-colors">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}
