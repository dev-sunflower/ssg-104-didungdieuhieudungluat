'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Card, Input } from '@heroui/react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleMagicLink = async (e: React.FormEvent) => {
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
        <div className="h-1.5 bg-gradient-to-r from-orange-400 via-rose-400 to-orange-500" />

        <Card.Content className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 shadow-lg shadow-orange-500/30 mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              <span className="text-orange-500">SSG</span>104
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Đăng nhập để theo dõi tiến độ học tập
            </p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">📬</div>
              <h2 className="font-bold text-slate-800 dark:text-white text-lg">Kiểm tra email!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Link đăng nhập đã gửi đến{' '}
                <strong className="text-slate-700 dark:text-slate-200">{email}</strong>
              </p>
              <Button
                variant="ghost"
                className="mt-4 text-orange-500"
                onPress={() => { setSent(false); setEmail('') }}
              >
                Dùng email khác
              </Button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Địa chỉ email
                </label>
                <Input
                  id="login-email"
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
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
              >
                {loading ? 'Đang gửi...' : '✉️ Gửi link đăng nhập'}
              </Button>
            </form>
          )}

          <p className="text-center text-xs text-slate-400 mt-6">
            Chưa có tài khoản?{' '}
            <Link href="/auth/signup" className="text-orange-500 font-medium hover:underline">
              Đăng ký miễn phí
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link href="/landing" className="text-sm text-slate-400 hover:text-slate-600">
              ← Tiếp tục không cần đăng nhập
            </Link>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}
