'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Card, Input } from '@heroui/react'
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
      options: { emailRedirectTo: `${location.origin}/api/auth/callback` },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="w-full max-w-sm px-4">
      <Card className="shadow-2xl border-0 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500" />
        <Card.Content className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/30 mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Đăng ký tài khoản</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Hoàn toàn miễn phí — không cần mật khẩu</p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="font-bold text-slate-800 dark:text-white text-lg">Xác nhận email!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Link xác nhận đã gửi đến <strong>{email}</strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Địa chỉ email</label>
                <Input
                  id="signup-email"
                  type="email"
                  required
                  fullWidth
                  variant="outline"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="ban@example.com"
                  className="rounded-xl"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm">
                  <span>⚠️</span> {error}
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                isDisabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl"
              >
                {loading ? 'Đang xử lý...' : '🚀 Đăng ký ngay'}
              </Button>
            </form>
          )}

          <p className="text-center text-xs text-slate-400 mt-6">
            Đã có tài khoản?{' '}
            <Link href="/auth/login" className="text-orange-500 font-medium hover:underline">Đăng nhập</Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  )
}
