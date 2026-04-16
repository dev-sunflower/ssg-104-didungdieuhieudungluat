'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@heroui/react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const tabs = [
  { href: '/landing',    label: 'Trang chủ', icon: '🏠' },
  { href: '/flashcards', label: 'Flashcard',  icon: '📚' },
  { href: '/exam',       label: 'Luyện thi',  icon: '📝' },
  { href: '/road-signs', label: 'Trò chơi',   icon: '🎮' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    )
    return () => listener.subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/landing')
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/landing' && pathname.startsWith(href))

  return (
    <>
      {/* ── Desktop top bar ─────────────────────────────────────── */}
      <header className="hidden md:flex sticky top-0 z-40 py-4 min-h-[4.5rem] items-center bg-bg-page/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-8 w-full flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/landing" className="flex items-center gap-2.5 shrink-0">
              <span className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-ivory text-sm font-serif font-medium shadow-ring-brand">
                S
              </span>
              <span className="font-serif font-medium text-lg text-text-primary">SSG104</span>
            </Link>

            {/* Desktop nav */}
            <nav className="flex items-center gap-2">
              {tabs.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200',
                    isActive(href)
                      ? 'bg-bg-subtle text-text-primary'
                      : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary',
                  ].join(' ')}
                >
                  <span className="text-base">{icon}</span> {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/profile" 
                className="flex items-center gap-2 group px-2 py-1.5 rounded-xl hover:bg-bg-subtle transition-colors"
                title="Quản lý hồ sơ"
              >
                <span className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-[10px] text-ivory font-serif font-medium">
                  {(user.email || 'U').charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors max-w-[140px] truncate">
                  {user.email}
                </span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs border-border text-text-secondary hover:bg-bg-subtle"
                onPress={handleSignOut}
              >
                Đăng xuất
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button
                size="sm"
                className="bg-brand text-ivory rounded-xl text-sm font-medium px-5"
              >
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* ── Mobile top mini-bar ──────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-40 h-14 flex items-center justify-between px-4 bg-bg-page/90 backdrop-blur-md border-b border-border">
        <Link href="/landing" className="flex items-center gap-2 font-serif font-medium text-text-primary">
          <span className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-ivory text-xs">
            S
          </span>
          SSG104
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <Link 
              href="/profile" 
              className="w-7 h-7 rounded-full bg-bg-subtle border border-border flex items-center justify-center text-[10px] text-text-secondary font-medium font-serif"
            >
              {(user.email || 'U').charAt(0).toUpperCase()}
            </Link>
            <button
              onClick={handleSignOut}
              className="text-[11px] text-text-secondary px-3 py-1.5 rounded-lg border border-border bg-bg-card shadow-sm"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="text-xs font-medium text-ivory bg-brand px-3 py-1.5 rounded-lg"
          >
            Đăng nhập
          </Link>
        )}
      </header>

      {/* ── Mobile bottom tab bar ───────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-page/95 backdrop-blur-md border-t border-border safe-area-bottom">
        <div className="flex items-stretch h-16">
          {tabs.map(({ href, label, icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors relative',
                  active ? 'text-brand' : 'text-text-tertiary',
                ].join(' ')}
              >
                <span className={`text-xl transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                  {icon}
                </span>
                <span>{label}</span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-brand rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
