# SSG104 Design System Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Before writing HeroUI code:** invoke `heroui-react` skill.
> **Before writing Supabase code:** invoke `supabase` skill.
> **Per AGENTS.md:** check `node_modules/next/dist/docs/` before writing any Next.js code.

**Goal:** Refactor SSG104 codebase to follow DESIGN.md (warm editorial aesthetic) using Tailwind v4 `@theme` token system, HeroUI v3 semantic mapping, Georgia + Inter typography, full landing page editorial restructure, and Next.js/HeroUI/Supabase best practices throughout.

**Architecture:** Four CSS token files (`primitives → semantic → typography → dark`) as single source of truth. HeroUI v3 for component behavior/a11y; all visuals via design token utilities. Landing page rebuilt with alternating dark/light sections. Server Components fetch data; Client Components only where interactivity is required.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, HeroUI v3, Supabase SSR, Georgia (system) + Inter (Google Fonts)

---

## File Map

**Create:**
- `src/styles/tokens/primitives.css`
- `src/styles/tokens/semantic.css`
- `src/styles/tokens/typography.css`
- `src/styles/tokens/dark.css`
- `src/app/providers.tsx`
- `src/components/ui/Section.tsx`
- `src/components/ui/Typography.tsx`
- `src/app/landing/_components/Hero.tsx`
- `src/app/landing/_components/StatsStrip.tsx`
- `src/app/landing/_components/FeaturesSection.tsx`
- `src/app/landing/_components/LicenseTypesSection.tsx`
- `src/app/landing/_components/HowItWorksSection.tsx`
- `src/app/landing/_components/CtaBanner.tsx`
- `src/app/landing/_components/SiteFooter.tsx`

**Modify:**
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/landing/page.tsx`
- `src/app/auth/layout.tsx`
- `src/app/auth/login/page.tsx`
- `src/app/auth/signup/page.tsx`
- `src/app/(learning)/layout.tsx`
- `src/app/(mini-games)/layout.tsx`
- `src/app/(mini-games)/road-signs/page.tsx`
- `src/app/(admin)/layout.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/AdminSidebar.tsx`
- `src/components/ui/FlashCard.tsx`
- `src/components/ui/QuestionCard.tsx`
- `src/app/(learning)/flashcards/page.tsx`
- `src/app/(learning)/exam/page.tsx`

**Delete:**
- `src/components/ui/AppButton.tsx`
- `src/components/layout/LearnLayout.tsx`
- `src/components/layout/GamesLayout.tsx`

---

## Task 1: Token CSS files

**Files:**
- Create: `src/styles/tokens/primitives.css`
- Create: `src/styles/tokens/semantic.css`
- Create: `src/styles/tokens/typography.css`
- Create: `src/styles/tokens/dark.css`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Create `src/styles/tokens/primitives.css`**

```css
/* Raw DESIGN.md palette — never reference these directly in components */
@theme {
  /* Backgrounds */
  --color-parchment: #f5f4ed;
  --color-ivory: #faf9f5;
  --color-pure-white: #ffffff;
  --color-warm-sand: #e8e6dc;

  /* Dark surfaces */
  --color-near-black: #141413;
  --color-dark-surface: #30302e;
  --color-dark-warm: #3d3d3a;

  /* Brand */
  --color-terracotta: #c96442;
  --color-coral: #d97757;

  /* Error */
  --color-crimson: #b53333;

  /* Neutrals */
  --color-charcoal-warm: #4d4c48;
  --color-olive-gray: #5e5d59;
  --color-stone-gray: #87867f;
  --color-warm-silver: #b0aea5;

  /* Borders */
  --color-border-cream: #f0eee6;
  --color-border-warm: #e8e6dc;
  --color-border-dark: #30302e;

  /* Rings */
  --color-ring-warm: #d1cfc5;
  --color-ring-deep: #c2c0b6;

  /* Focus */
  --color-focus-blue: #3898ec;

  /* Shadows */
  --shadow-whisper: rgba(0, 0, 0, 0.05) 0px 4px 24px;
  --shadow-ring: 0 0 0 1px var(--color-ring-warm);
  --shadow-ring-brand: 0 0 0 1px var(--color-terracotta);

  /* Extra radius */
  --radius-4xl: 2rem;
}
```

- [ ] **Step 2: Create `src/styles/tokens/semantic.css`**

```css
/* Role-based tokens — components use ONLY these */
@theme {
  /* Page backgrounds */
  --color-bg-page: var(--color-parchment);
  --color-bg-card: var(--color-ivory);
  --color-bg-elevated: var(--color-pure-white);
  --color-bg-subtle: var(--color-warm-sand);
  --color-bg-dark: var(--color-near-black);
  --color-bg-dark-card: var(--color-dark-surface);
  --color-bg-dark-elevated: var(--color-dark-warm);

  /* Text */
  --color-text-primary: var(--color-near-black);
  --color-text-secondary: var(--color-olive-gray);
  --color-text-tertiary: var(--color-stone-gray);
  --color-text-inverted: var(--color-ivory);
  --color-text-inverted-secondary: var(--color-warm-silver);
  --color-text-brand: var(--color-terracotta);
  --color-text-link: var(--color-coral);
  --color-text-button: var(--color-charcoal-warm);

  /* Borders */
  --color-border: var(--color-border-cream);
  --color-border-strong: var(--color-border-warm);

  /* Brand */
  --color-brand: var(--color-terracotta);
  --color-brand-hover: var(--color-coral);

  /* Interactive */
  --color-ring: var(--color-ring-warm);
  --color-focus: var(--color-focus-blue);

  /* Status */
  --color-status-error: var(--color-crimson);
}
```

- [ ] **Step 3: Create `src/styles/tokens/typography.css`**

```css
@theme {
  --font-serif: Georgia, "Times New Roman", serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

/* Serif heading utilities — font-size + line-height + family + weight bundled */
@utility heading-display {
  font-size: 4rem;
  line-height: 1.1;
  font-family: var(--font-serif);
  font-weight: 500;
}

@utility heading-section {
  font-size: 3.25rem;
  line-height: 1.2;
  font-family: var(--font-serif);
  font-weight: 500;
}

@utility heading-sub-lg {
  font-size: 2.3rem;
  line-height: 1.3;
  font-family: var(--font-serif);
  font-weight: 500;
}

@utility heading-sub {
  font-size: 2rem;
  line-height: 1.1;
  font-family: var(--font-serif);
  font-weight: 500;
}

@utility heading-sub-sm {
  font-size: 1.6rem;
  line-height: 1.2;
  font-family: var(--font-serif);
  font-weight: 500;
}

@utility heading-feature {
  font-size: 1.3rem;
  line-height: 1.2;
  font-family: var(--font-serif);
  font-weight: 500;
}
```

- [ ] **Step 4: Create `src/styles/tokens/dark.css`**

```css
/* Dark mode overrides — only semantic tokens */
.dark {
  --color-bg-page: var(--color-near-black);
  --color-bg-card: var(--color-dark-surface);
  --color-bg-elevated: var(--color-dark-warm);
  --color-bg-subtle: var(--color-dark-surface);

  --color-text-primary: var(--color-ivory);
  --color-text-secondary: var(--color-warm-silver);
  --color-text-tertiary: var(--color-stone-gray);

  --color-border: var(--color-border-dark);
  --color-border-strong: var(--color-dark-warm);
}
```

- [ ] **Step 5: Rewrite `src/app/globals.css`**

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "../styles/tokens/primitives.css";
@import "../styles/tokens/semantic.css";
@import "../styles/tokens/typography.css";
@import "../styles/tokens/dark.css";

/* ─── Base ──────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }

html, body { height: 100%; }

body {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ─── Safe area for bottom nav on iOS ──────────────────── */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* ─── Flashcard 3D flip ─────────────────────────────────── */
.flashcard-scene {
  perspective: 1200px;
  position: relative;
}

.flashcard-inner {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit;
  transition: transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform-style: preserve-3d;
}

.flashcard-inner.flipped {
  transform: rotateY(180deg);
}

.flashcard-face {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 1rem;
}

.flashcard-back {
  transform: rotateY(180deg);
}

/* ─── Touch improvements ────────────────────────────────── */
.touch-manipulation {
  touch-action: manipulation;
}

.flashcard-scene * {
  user-select: none;
  -webkit-user-select: none;
}
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
cd C:\Users\hoang\Desktop\ssg104-website
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/styles/tokens/ src/app/globals.css
git commit -m "feat: add design token CSS layer (primitives, semantic, typography, dark)"
```

---

## Task 2: Root layout — Inter font + HeroUIProvider

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/providers.tsx`

- [ ] **Step 1: Create `src/app/providers.tsx`**

HeroUIProvider uses React context so it must be a Client Component.

```tsx
'use client'

import { HeroUIProvider } from '@heroui/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>
}
```

- [ ] **Step 2: Rewrite `src/app/layout.tsx`**

Add Inter font (with Vietnamese subset) alongside existing Geist Mono. Remove Geist Sans — Inter replaces it as the UI sans font.

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Geist_Mono } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'SSG104 — Đi Đúng Điều Hiểu Đúng Luật',
  description:
    'Nền tảng ôn luyện lý thuyết lái xe trực tuyến: câu hỏi thi sát hạch hạng A1, B2, C... Flashcard, đề thi thử và trò chơi tương tác.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${inter.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/providers.tsx src/app/layout.tsx
git commit -m "feat: add Inter font, HeroUIProvider wrapper"
```

---

## Task 3: Shared UI primitives — Section + Typography

**Files:**
- Create: `src/components/ui/Section.tsx`
- Create: `src/components/ui/Typography.tsx`

- [ ] **Step 1: Create `src/components/ui/Section.tsx`**

Alternating dark/light section wrapper with max-width container.

```tsx
interface SectionProps {
  dark?: boolean
  children: React.ReactNode
  className?: string
  id?: string
}

export function Section({ dark = false, children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={[
        'py-20 md:py-28',
        dark ? 'bg-near-black' : 'bg-bg-page',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-6xl mx-auto px-6">{children}</div>
    </section>
  )
}
```

- [ ] **Step 2: Create `src/components/ui/Typography.tsx`**

Named heading + body components using the typography token utilities from Task 1.

```tsx
interface TypoProps {
  children: React.ReactNode
  className?: string
}

export function DisplayHeading({ children, className }: TypoProps) {
  return (
    <h1 className={['heading-display text-text-primary', className].filter(Boolean).join(' ')}>
      {children}
    </h1>
  )
}

export function SectionHeading({ children, className }: TypoProps) {
  return (
    <h2 className={['heading-section text-text-primary', className].filter(Boolean).join(' ')}>
      {children}
    </h2>
  )
}

export function SubheadingLg({ children, className }: TypoProps) {
  return (
    <h2 className={['heading-sub-lg text-text-primary', className].filter(Boolean).join(' ')}>
      {children}
    </h2>
  )
}

export function Subheading({ children, className }: TypoProps) {
  return (
    <h3 className={['heading-sub text-text-primary', className].filter(Boolean).join(' ')}>
      {children}
    </h3>
  )
}

export function SubheadingSm({ children, className }: TypoProps) {
  return (
    <h3 className={['heading-sub-sm text-text-primary', className].filter(Boolean).join(' ')}>
      {children}
    </h3>
  )
}

export function FeatureTitle({ children, className }: TypoProps) {
  return (
    <h4 className={['heading-feature text-text-primary', className].filter(Boolean).join(' ')}>
      {children}
    </h4>
  )
}

export function BodyLg({ children, className }: TypoProps) {
  return (
    <p className={['text-[1.25rem] leading-[1.6] font-sans text-text-secondary', className].filter(Boolean).join(' ')}>
      {children}
    </p>
  )
}

export function Body({ children, className }: TypoProps) {
  return (
    <p className={['text-base leading-[1.6] font-sans text-text-secondary', className].filter(Boolean).join(' ')}>
      {children}
    </p>
  )
}

export function Caption({ children, className }: TypoProps) {
  return (
    <p className={['text-[0.88rem] leading-[1.43] font-sans text-text-tertiary', className].filter(Boolean).join(' ')}>
      {children}
    </p>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Delete unused component files**

```bash
rm "src/components/ui/AppButton.tsx"
```

If `LearnLayout.tsx` and `GamesLayout.tsx` exist:
```bash
rm "src/components/layout/LearnLayout.tsx"
rm "src/components/layout/GamesLayout.tsx"
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Section.tsx src/components/ui/Typography.tsx
git rm --cached src/components/ui/AppButton.tsx 2>/dev/null || true
git commit -m "feat: add Section and Typography shared primitives, remove unused stubs"
```

---

## Task 4: Navbar refactor

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

Replace all orange/slate colors with design token classes. Keep all logic unchanged.

- [ ] **Step 1: Rewrite `src/components/layout/Navbar.tsx`**

```tsx
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
      <header className="hidden md:flex sticky top-0 z-40 h-16 items-center bg-bg-page/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 w-full flex items-center gap-6">
          {/* Logo */}
          <Link href="/landing" className="flex items-center gap-2 shrink-0 font-medium text-lg font-serif text-text-primary">
            <span className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-sm text-ivory shadow-sm">
              ⊕
            </span>
            SSG104
          </Link>

          {/* Desktop nav */}
          <nav className="flex items-center gap-1 flex-1">
            {tabs.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={[
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-200',
                  isActive(href)
                    ? 'bg-warm-sand text-text-primary'
                    : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary',
                ].join(' ')}
              >
                <span className="text-base">{icon}</span> {label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-tertiary max-w-[140px] truncate">{user.email}</span>
              <Button
                variant="bordered"
                size="sm"
                className="rounded-xl text-xs border-border text-text-secondary"
                onPress={handleSignOut}
              >
                Đăng xuất
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button
                size="sm"
                className="bg-brand text-ivory rounded-xl text-sm font-medium px-5 shadow-ring-brand"
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
          <span className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-xs text-ivory">
            ⊕
          </span>
          SSG104
        </Link>

        {user ? (
          <button
            onClick={handleSignOut}
            className="text-xs text-text-secondary px-3 py-1.5 rounded-lg border border-border"
          >
            Đăng xuất
          </button>
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "refactor(navbar): apply design token colors, Georgia serif logo"
```

---

## Task 5: Landing page section components

**Files:**
- Create: `src/app/landing/_components/Hero.tsx`
- Create: `src/app/landing/_components/StatsStrip.tsx`
- Create: `src/app/landing/_components/FeaturesSection.tsx`
- Create: `src/app/landing/_components/LicenseTypesSection.tsx`
- Create: `src/app/landing/_components/HowItWorksSection.tsx`
- Create: `src/app/landing/_components/CtaBanner.tsx`
- Create: `src/app/landing/_components/SiteFooter.tsx`

All are Server Components (no `'use client'` needed — pure display).

- [ ] **Step 1: Create `src/app/landing/_components/Hero.tsx`**

```tsx
import Link from 'next/link'
import { Button } from '@heroui/react'
import { DisplayHeading, BodyLg } from '@/components/ui/Typography'

export function Hero() {
  return (
    <section className="bg-bg-page py-20 md:py-32 text-center">
      <div className="max-w-4xl mx-auto px-6">
        {/* Overline badge */}
        <p className="text-[0.63rem] font-sans font-medium tracking-[0.5px] uppercase text-text-tertiary mb-6">
          Ôn thi lý thuyết lái xe Việt Nam
        </p>

        <DisplayHeading className="text-[2rem] sm:text-[3rem] md:text-[4rem] mb-6">
          Đi đúng đường,<br />
          <span className="text-brand">Hiểu đúng luật.</span>
        </DisplayHeading>

        <BodyLg className="max-w-xl mx-auto mb-10">
          Ôn luyện lý thuyết lái xe{' '}
          <strong className="text-text-primary font-medium">A1, A2, B1, B2</strong>{' '}
          miễn phí — flashcard, thi thử và trò chơi tương tác.
        </BodyLg>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/flashcards">
            <Button className="bg-brand text-ivory rounded-xl px-8 py-3 font-medium shadow-ring-brand hover:bg-brand-hover transition-colors">
              Học ngay
            </Button>
          </Link>
          <Link href="/exam">
            <Button
              variant="bordered"
              className="rounded-xl px-8 py-3 font-medium border-border-strong text-text-primary hover:bg-bg-subtle transition-colors"
            >
              Thi thử ngay
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `src/app/landing/_components/StatsStrip.tsx`**

```tsx
import { SubheadingSm, Caption } from '@/components/ui/Typography'

const stats = [
  { value: '600+', label: 'Câu hỏi thi' },
  { value: '4',    label: 'Hạng bằng lái' },
  { value: '100%', label: 'Miễn phí hoàn toàn' },
]

export function StatsStrip() {
  return (
    <section className="bg-bg-subtle border-y border-border">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <SubheadingSm className="text-brand mb-1">{s.value}</SubheadingSm>
              <Caption>{s.label}</Caption>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `src/app/landing/_components/FeaturesSection.tsx`**

Dark section — ivory text on near-black.

```tsx
import Link from 'next/link'
import { Button } from '@heroui/react'
import { SectionHeading, Body, BodyLg } from '@/components/ui/Typography'
import { Section } from '@/components/ui/Section'

const features = [
  {
    title: 'Flashcard ôn luyện',
    desc: 'Lật thẻ từng câu — hiển thị đáp án và giải thích chi tiết. Lọc theo hạng bằng và chủ đề.',
    href: '/flashcards',
    cta: 'Học ngay',
    badge: 'Phổ biến',
  },
  {
    title: 'Thi thử sát hạch',
    desc: 'Đề thi mô phỏng theo đúng cấu trúc Bộ GTVT. Chấm điểm tự động, có câu điểm liệt.',
    href: '/exam',
    cta: 'Luyện thi',
    badge: 'Hiệu quả',
  },
  {
    title: 'Trò chơi biển báo',
    desc: 'Nhận biết biển báo theo thời gian. Học mà chơi, chơi mà học!',
    href: '/road-signs',
    cta: 'Xem trước',
    badge: 'Sắp ra mắt',
  },
]

export function FeaturesSection() {
  return (
    <Section dark id="features">
      <div className="text-center mb-14">
        <SectionHeading className="text-ivory text-[2rem] md:text-[3.25rem]">
          Tất cả công cụ<br />bạn cần
        </SectionHeading>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-bg-dark-card border border-border-dark rounded-2xl p-8 flex flex-col gap-5 shadow-whisper"
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.63rem] font-sans uppercase tracking-[0.5px] text-text-inverted-secondary">
                {f.badge}
              </span>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <h3 className="heading-feature text-ivory">{f.title}</h3>
              <Body className="text-warm-silver leading-relaxed">{f.desc}</Body>
            </div>
            <Link href={f.href}>
              <Button
                variant="bordered"
                fullWidth
                className="rounded-xl border-border-dark text-ivory hover:bg-dark-warm transition-colors"
              >
                {f.cta} →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 4: Create `src/app/landing/_components/LicenseTypesSection.tsx`**

Light section — license type cards on warm-sand.

```tsx
import Link from 'next/link'
import { SubheadingLg, Body, Caption } from '@/components/ui/Typography'
import { Section } from '@/components/ui/Section'

const licenseTypes = [
  { code: 'A1', name: 'Xe máy dưới 175cc',      total: 25, pass: 21 },
  { code: 'A2', name: 'Xe máy trên 175cc',       total: 25, pass: 21 },
  { code: 'B1', name: 'Ô tô không kinh doanh',   total: 30, pass: 24 },
  { code: 'B2', name: 'Ô tô kinh doanh vận tải', total: 35, pass: 29 },
]

export function LicenseTypesSection() {
  return (
    <Section id="license-types">
      <div className="text-center mb-14">
        <SubheadingLg className="text-[2rem] md:text-[2.3rem]">
          Chọn hạng bằng lái
        </SubheadingLg>
        <Body className="mt-3">
          Ngân hàng câu hỏi theo đúng quy định Bộ GTVT
        </Body>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {licenseTypes.map((lt) => (
          <Link key={lt.code} href={`/exam?type=${lt.code}`}>
            <div className="group flex items-center gap-5 bg-bg-card border border-border rounded-xl p-6 hover:shadow-whisper hover:border-border-strong transition-all duration-200">
              <div className="w-14 h-14 shrink-0 rounded-xl bg-warm-sand border border-border-strong flex items-center justify-center">
                <span className="heading-feature text-brand">{lt.code}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans font-medium text-text-primary text-sm mb-1">{lt.name}</p>
                <Caption>
                  {lt.total} câu · Đạt {lt.pass}/{lt.total}
                </Caption>
              </div>
              <span className="text-text-tertiary group-hover:text-brand transition-colors text-lg">→</span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 5: Create `src/app/landing/_components/HowItWorksSection.tsx`**

Dark section — numbered steps.

```tsx
import { SectionHeading, Body } from '@/components/ui/Typography'
import { Section } from '@/components/ui/Section'

const steps = [
  {
    number: '01',
    title: 'Chọn hạng bằng',
    desc: 'Chọn hạng A1, A2, B1 hoặc B2 tùy theo loại xe bạn muốn lái.',
  },
  {
    number: '02',
    title: 'Ôn với Flashcard',
    desc: 'Học từng câu với thẻ lật — xem đáp án và giải thích ngay lập tức.',
  },
  {
    number: '03',
    title: 'Kiểm tra với đề thi thử',
    desc: 'Thi mô phỏng đúng cấu trúc sát hạch, theo dõi điểm số và xem lại câu sai.',
  },
]

export function HowItWorksSection() {
  return (
    <Section dark id="how-it-works">
      <div className="text-center mb-14">
        <SectionHeading className="text-ivory text-[2rem] md:text-[3.25rem]">
          Cách sử dụng
        </SectionHeading>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s) => (
          <div key={s.number} className="flex flex-col gap-4">
            <span className="heading-sub-sm text-terracotta">{s.number}</span>
            <div className="w-full h-px bg-border-dark" />
            <h3 className="heading-feature text-ivory">{s.title}</h3>
            <Body className="text-warm-silver">{s.desc}</Body>
          </div>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 6: Create `src/app/landing/_components/CtaBanner.tsx`**

Light section — single large serif CTA.

```tsx
import Link from 'next/link'
import { Button } from '@heroui/react'
import { SectionHeading, Body } from '@/components/ui/Typography'
import { Section } from '@/components/ui/Section'

export function CtaBanner() {
  return (
    <Section id="cta">
      <div className="text-center max-w-2xl mx-auto">
        <SectionHeading className="text-[2rem] md:text-[3.25rem] mb-6">
          Bắt đầu ôn thi<br />ngay hôm nay
        </SectionHeading>
        <Body className="mb-10">
          Miễn phí hoàn toàn. Không cần tạo tài khoản để học.
        </Body>
        <Link href="/flashcards">
          <Button className="bg-brand text-ivory rounded-xl px-10 py-3.5 font-medium shadow-ring-brand hover:bg-brand-hover transition-colors">
            Bắt đầu học ngay →
          </Button>
        </Link>
      </div>
    </Section>
  )
}
```

- [ ] **Step 7: Create `src/app/landing/_components/SiteFooter.tsx`**

Near-black footer.

```tsx
export function SiteFooter() {
  return (
    <footer className="bg-near-black border-t border-border-dark py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="font-serif font-medium text-ivory text-lg mb-2">SSG104</p>
        <p className="text-[0.88rem] text-warm-silver mb-1">Đi Đúng Điều Hiểu Đúng Luật</p>
        <p className="text-[0.88rem] text-stone-gray">
          Dữ liệu câu hỏi theo quy định Bộ Giao thông Vận tải Việt Nam · © 2025
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 8: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add src/app/landing/_components/
git commit -m "feat(landing): add editorial section components (hero, stats, features, license-types, how-it-works, cta, footer)"
```

---

## Task 6: Landing page restructure

**Files:**
- Modify: `src/app/landing/page.tsx`

- [ ] **Step 1: Rewrite `src/app/landing/page.tsx`**

Remove all old sections. Compose the new section components in editorial order. Navbar is rendered first (it's sticky), then sections alternate dark/light.

```tsx
import Navbar from '@/components/layout/Navbar'
import { Hero } from './_components/Hero'
import { StatsStrip } from './_components/StatsStrip'
import { FeaturesSection } from './_components/FeaturesSection'
import { LicenseTypesSection } from './_components/LicenseTypesSection'
import { HowItWorksSection } from './_components/HowItWorksSection'
import { CtaBanner } from './_components/CtaBanner'
import { SiteFooter } from './_components/SiteFooter'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-page pb-16 md:pb-0">
      <Navbar />
      <Hero />
      <StatsStrip />
      <FeaturesSection />        {/* dark */}
      <LicenseTypesSection />    {/* light */}
      <HowItWorksSection />      {/* dark */}
      <CtaBanner />              {/* light */}
      <SiteFooter />             {/* near-black */}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/landing/page.tsx
git commit -m "refactor(landing): restructure with editorial alternating dark/light sections"
```

---

## Task 7: Auth layout + pages

**Files:**
- Modify: `src/app/auth/layout.tsx`
- Modify: `src/app/auth/login/page.tsx`
- Modify: `src/app/auth/signup/page.tsx`

- [ ] **Step 1: Rewrite `src/app/auth/layout.tsx`**

```tsx
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
```

- [ ] **Step 2: Rewrite `src/app/auth/login/page.tsx`**

Fix auth callback URL: change `/api/auth/callback` → `/auth/callback`.

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Input } from '@heroui/react'
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
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="w-full max-w-sm px-4">
      <div className="bg-bg-card border border-border rounded-2xl p-10 shadow-whisper">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand mb-4">
            <span className="text-ivory text-xl">⊕</span>
          </div>
          <h1 className="heading-sub text-text-primary text-[1.5rem]">SSG104</h1>
          <p className="text-[0.88rem] text-text-secondary mt-1">
            Đăng nhập để theo dõi tiến độ học tập
          </p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">📬</div>
            <h2 className="heading-feature text-text-primary mb-2">Kiểm tra email!</h2>
            <p className="text-[0.88rem] text-text-secondary leading-relaxed">
              Link đăng nhập đã gửi đến{' '}
              <strong className="text-text-primary font-medium">{email}</strong>
            </p>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              className="mt-4 text-sm text-brand hover:text-brand-hover transition-colors"
            >
              Dùng email khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[0.88rem] font-medium text-text-primary">
                Địa chỉ email
              </label>
              <Input
                id="login-email"
                type="email"
                required
                fullWidth
                variant="bordered"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="ban@example.com"
                classNames={{
                  inputWrapper: 'rounded-xl border-border bg-bg-card focus-within:border-focus-blue',
                  input: 'text-text-primary',
                }}
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
              className="bg-brand text-ivory font-medium py-3 rounded-xl shadow-ring-brand hover:bg-brand-hover transition-colors"
            >
              {loading ? 'Đang gửi...' : 'Gửi link đăng nhập'}
            </Button>
          </form>
        )}

        <p className="text-center text-[0.75rem] text-text-tertiary mt-6">
          Chưa có tài khoản?{' '}
          <Link href="/auth/signup" className="text-brand hover:text-brand-hover font-medium transition-colors">
            Đăng ký miễn phí
          </Link>
        </p>

        <div className="mt-4 pt-4 border-t border-border text-center">
          <Link href="/landing" className="text-sm text-text-tertiary hover:text-text-secondary transition-colors">
            ← Tiếp tục không cần đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite `src/app/auth/signup/page.tsx`**

```tsx
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-warm-sand border border-border-strong mb-4">
            <span className="text-brand text-xl font-serif font-medium">✎</span>
          </div>
          <h1 className="heading-sub text-text-primary text-[1.5rem]">Đăng ký tài khoản</h1>
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
                variant="bordered"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="ban@example.com"
                classNames={{
                  inputWrapper: 'rounded-xl border-border bg-bg-card focus-within:border-focus-blue',
                  input: 'text-text-primary',
                }}
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
              className="bg-brand text-ivory font-medium py-3 rounded-xl shadow-ring-brand hover:bg-brand-hover transition-colors"
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
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/auth/
git commit -m "refactor(auth): apply design tokens, fix callback URL to /auth/callback"
```

---

## Task 8: Learning + Mini-games layouts

**Files:**
- Modify: `src/app/(learning)/layout.tsx`
- Modify: `src/app/(mini-games)/layout.tsx`

- [ ] **Step 1: Rewrite `src/app/(learning)/layout.tsx`**

```tsx
import Navbar from '@/components/layout/Navbar'

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-page">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `src/app/(mini-games)/layout.tsx`**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(learning)/layout.tsx src/app/(mini-games)/layout.tsx
git commit -m "refactor(layouts): apply bg-bg-page token"
```

---

## Task 9: FlashCard component

**Files:**
- Modify: `src/components/ui/FlashCard.tsx`

Replace all orange/emerald/slate colors with design token classes. Keep all 3D flip logic and props unchanged.

- [ ] **Step 1: Rewrite `src/components/ui/FlashCard.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { Button, Card, Chip } from '@heroui/react'
import type { Question } from '@/lib/types/database'

interface FlashCardProps {
  question: Question
  onNext: () => void
  onPrev: () => void
  current: number
  total: number
}

export default function FlashCard({ question, onNext, onPrev, current, total }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false)
  const correctOption = question.options.find(o => o.key === question.correct_answer)
  const progress = (current / total) * 100

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Progress row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-text-primary">
            {current}<span className="font-normal text-text-tertiary">/{total}</span>
          </span>
          {question.is_critical && (
            <Chip
              size="sm"
              classNames={{ base: 'bg-crimson/10 border border-crimson/20', content: 'text-crimson text-[10px] font-medium' }}
            >
              ⚠ Điểm liệt
            </Chip>
          )}
          {question.topic && (
            <Chip
              size="sm"
              classNames={{ base: 'bg-bg-subtle border border-border', content: 'text-text-tertiary text-[10px]' }}
            >
              {question.topic}
            </Chip>
          )}
        </div>
        <span className="text-xs text-text-tertiary shrink-0">{Math.round(progress)}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-bg-subtle rounded-full overflow-hidden">
        <div
          className="h-full bg-brand rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 3D card */}
      <div
        className="w-full min-h-[280px] md:min-h-[320px] cursor-pointer select-none flashcard-scene"
        onClick={() => setFlipped(f => !f)}
      >
        <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`} style={{ minHeight: 'inherit' }}>

          {/* Front */}
          <Card
            classNames={{ base: 'flashcard-face shadow-whisper border border-border bg-bg-card overflow-hidden' }}
          >
            <div className="h-1 bg-brand" />
            <Card.Content className="p-5 md:p-7 flex flex-col justify-between h-full">
              <div className="flex-1 flex flex-col justify-center gap-4">
                {question.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={question.image_url}
                    alt="Hình ảnh câu hỏi"
                    className="max-h-32 object-contain mx-auto rounded-xl"
                  />
                )}
                {question.question_number && (
                  <p className="text-xs font-mono text-text-tertiary">Câu #{question.question_number}</p>
                )}
                <p className="text-base md:text-lg font-medium text-text-primary leading-relaxed">
                  {question.content}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-2 text-text-tertiary text-xs">
                Nhấn để xem đáp án
              </div>
            </Card.Content>
          </Card>

          {/* Back */}
          <Card
            classNames={{ base: 'flashcard-face flashcard-back shadow-whisper border border-border-strong bg-bg-card overflow-hidden' }}
          >
            <div className="h-1 bg-brand" />
            <Card.Content className="p-5 md:p-7 flex flex-col justify-between h-full">
              <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-9 h-9 rounded-xl bg-brand text-ivory flex items-center justify-center font-medium text-sm shadow-ring-brand">
                    {question.correct_answer}
                  </span>
                  <p className="text-base font-medium text-text-primary leading-relaxed">
                    {correctOption?.text}
                  </p>
                </div>
                {question.explanation && (
                  <div className="p-4 bg-bg-subtle border border-border-strong rounded-xl text-sm text-text-secondary leading-relaxed">
                    💡 {question.explanation}
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-2 text-text-tertiary text-xs">
                Nhấn để quay lại câu hỏi
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          fullWidth
          variant="bordered"
          isDisabled={current <= 1}
          onPress={() => { setFlipped(false); onPrev() }}
          classNames={{ base: 'rounded-xl py-3 border-border text-text-secondary disabled:opacity-40' }}
        >
          ← Trước
        </Button>
        <Button
          fullWidth
          isDisabled={current >= total}
          onPress={() => { setFlipped(false); onNext() }}
          classNames={{ base: 'rounded-xl py-3 bg-brand text-ivory disabled:opacity-40 shadow-ring-brand' }}
        >
          Tiếp theo →
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/FlashCard.tsx
git commit -m "refactor(flashcard): apply design token colors, terracotta progress bar"
```

---

## Task 10: QuestionCard component

**Files:**
- Modify: `src/components/ui/QuestionCard.tsx`

Replace color logic with design token classes. Correct answer → brand terracotta. Wrong answer → crimson. Keep all props/logic unchanged.

- [ ] **Step 1: Rewrite `src/components/ui/QuestionCard.tsx`**

```tsx
'use client'

import { Card, Chip } from '@heroui/react'
import type { Question } from '@/lib/types/database'

interface QuestionCardProps {
  question: Question
  selectedAnswer: string | null
  onAnswer: (key: string) => void
  showResult: boolean
}

export default function QuestionCard({ question, selectedAnswer, onAnswer, showResult }: QuestionCardProps) {
  const getOptionStyle = (key: string): string => {
    if (!showResult) {
      if (selectedAnswer === key)
        return 'border-brand bg-warm-sand/60 text-text-primary'
      return 'border-border text-text-secondary hover:border-border-strong hover:bg-bg-subtle active:scale-[0.99]'
    }
    if (key === question.correct_answer)
      return 'border-brand bg-warm-sand/40 text-text-primary'
    if (key === selectedAnswer)
      return 'border-crimson bg-crimson/5 text-crimson'
    return 'border-border text-text-tertiary opacity-60'
  }

  return (
    <Card classNames={{ base: 'shadow-whisper border border-border bg-bg-card' }}>
      <Card.Content className="p-5 flex flex-col gap-4">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {question.question_number && (
            <span className="text-xs font-mono text-text-tertiary">#{question.question_number}</span>
          )}
          {question.topic && (
            <Chip
              size="sm"
              classNames={{ base: 'bg-bg-subtle border border-border', content: 'text-[10px] text-text-secondary font-medium' }}
            >
              {question.topic}
            </Chip>
          )}
          {question.is_critical && (
            <Chip
              size="sm"
              classNames={{ base: 'bg-crimson/10 border border-crimson/20', content: 'text-[10px] text-crimson font-medium' }}
            >
              ⚠ Điểm liệt
            </Chip>
          )}
        </div>

        {/* Image */}
        {question.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={question.image_url}
            alt="Hình minh họa"
            className="max-h-44 object-contain rounded-xl border border-border mx-auto"
          />
        )}

        {/* Content */}
        <p className="text-base font-medium text-text-primary leading-relaxed">
          {question.content}
        </p>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => !showResult && onAnswer(opt.key)}
              disabled={showResult}
              className={`flex items-start gap-3 w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${getOptionStyle(opt.key)}`}
            >
              <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-bg-subtle border border-border font-medium text-xs text-text-secondary">
                {opt.key}
              </span>
              <span className="text-sm leading-relaxed flex-1">{opt.text}</span>
              {showResult && opt.key === question.correct_answer && (
                <span className="ml-auto shrink-0 text-brand font-bold">✓</span>
              )}
              {showResult && opt.key === selectedAnswer && opt.key !== question.correct_answer && (
                <span className="ml-auto shrink-0 text-crimson font-bold">✗</span>
              )}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showResult && question.explanation && (
          <div className="p-4 bg-bg-subtle border border-border-strong rounded-xl text-sm text-text-secondary leading-relaxed">
            💡 <strong className="text-text-primary font-medium">Giải thích:</strong> {question.explanation}
          </div>
        )}
      </Card.Content>
    </Card>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/QuestionCard.tsx
git commit -m "refactor(question-card): apply design tokens, terracotta selected/correct, crimson wrong"
```

---

## Task 11: Flashcards page

**Files:**
- Modify: `src/app/(learning)/flashcards/page.tsx`

Replace all orange/slate utility classes with design token equivalents. Keep all Supabase fetching logic and filter logic unchanged.

- [ ] **Step 1: Read the full current file**

```bash
cat src/app/(learning)/flashcards/page.tsx
```

- [ ] **Step 2: Apply token replacements throughout the file**

Apply these substitution rules:
- `bg-white dark:bg-slate-*` → `bg-bg-card`
- `text-slate-800 dark:text-white` / `text-slate-900 dark:text-white` → `text-text-primary`
- `text-slate-500 dark:text-slate-400` → `text-text-secondary`
- `text-slate-400` → `text-text-tertiary`
- `border-slate-200 dark:border-slate-*` → `border-border`
- `bg-slate-100 dark:bg-slate-*` → `bg-bg-subtle`
- `text-orange-*` / `ring-orange-*` / `focus:ring-orange-*` → use `text-brand` / `ring-brand` / `focus:ring-focus-blue`
- `bg-orange-*` → `bg-warm-sand`
- `rounded-2xl` → `rounded-xl` (keep `rounded-xl` as-is)
- Header `h1`: change to `heading-sub-sm text-text-primary` and remove emoji
- Filter selects: apply `border-border bg-bg-card text-text-primary focus:ring-0 focus:border-focus-blue` classes
- Filter labels: `text-[0.75rem] font-medium text-text-tertiary`
- Shuffle button: `bg-warm-sand text-text-button border border-border rounded-xl`
- Empty state text: `text-text-secondary`
- Spinner: keep as-is (HeroUI default)

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/(learning)/flashcards/page.tsx
git commit -m "refactor(flashcards): apply design token colors"
```

---

## Task 12: Exam page

**Files:**
- Modify: `src/app/(learning)/exam/page.tsx`

Same token substitution approach as Task 11. Keep all exam logic unchanged.

- [ ] **Step 1: Read the full current file**

```bash
cat src/app/(learning)/exam/page.tsx
```

- [ ] **Step 2: Apply token replacements throughout the file**

Apply the same substitution rules as Task 11, plus:
- Result card passed state: `border-brand` instead of `border-emerald-300`
- Result card failed state: `border-crimson` instead of `border-red-300`
- Passed color heading: `text-brand` instead of `text-emerald-600 dark:text-emerald-400`
- Failed color heading: `text-crimson` instead of `text-red-600`
- Score percentage color logic: replace `text-emerald-500` → `text-brand`, `text-orange-500` → `text-coral`, `text-red-500` → `text-crimson`
- Top accent bar on result card: `bg-brand` for passed, `bg-crimson` for failed
- Divider: `bg-border` instead of `bg-slate-200 dark:bg-slate-700`
- License type select: apply `border-border bg-bg-card text-text-primary focus:ring-0 focus:border-focus-blue`
- Start button: `bg-brand text-ivory rounded-xl shadow-ring-brand`
- Navigation buttons: same as FlashCard (prev: bordered, next: bg-brand)

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/(learning)/exam/page.tsx
git commit -m "refactor(exam): apply design token colors, terracotta pass/crimson fail states"
```

---

## Task 13: Admin layout + AdminSidebar

**Files:**
- Modify: `src/app/(admin)/layout.tsx`
- Modify: `src/components/layout/AdminSidebar.tsx`

- [ ] **Step 1: Rewrite `src/app/(admin)/layout.tsx`**

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/admin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen flex bg-bg-page">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-text-tertiary">
            Đăng nhập:{' '}
            <span className="font-medium text-text-primary">{user.email}</span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-warm-sand border border-border-strong text-text-button font-medium">
            Admin
          </span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `src/components/layout/AdminSidebar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const adminLinks = [
  { href: '/admin',           label: 'Tổng quan',      icon: '◈', exact: true },
  { href: '/admin/questions', label: 'Câu hỏi',        icon: '❓' },
  { href: '/admin/license-types', label: 'Hạng bằng lái', icon: '🪪' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-bg-card border-r border-border min-h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-ivory text-sm">⊕</span>
          <div className="leading-tight">
            <div className="font-serif font-medium text-sm text-text-primary">SSG104</div>
            <div className="text-[0.75rem] text-text-tertiary">Quản trị viên</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {adminLinks.map(({ href, label, icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-warm-sand text-text-primary'
                  : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary',
              ].join(' ')}
            >
              <span>{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Back to site */}
      <div className="p-3 border-t border-border">
        <Link
          href="/landing"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-text-tertiary hover:text-text-secondary hover:bg-bg-subtle transition-colors"
        >
          ← Về trang chính
        </Link>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/(admin)/layout.tsx src/components/layout/AdminSidebar.tsx
git commit -m "refactor(admin): apply design tokens to layout and sidebar"
```

---

## Task 14: Road signs + Admin questions pages

**Files:**
- Modify: `src/app/(mini-games)/road-signs/page.tsx`
- Modify: `src/app/(admin)/` — questions pages (read each file, apply token substitution)

- [ ] **Step 1: Rewrite `src/app/(mini-games)/road-signs/page.tsx`**

Dark section "Coming Soon" matching DESIGN.md editorial style.

```tsx
import Link from 'next/link'

export default function RoadSignsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-4">
      <div>
        <p className="text-[0.63rem] font-sans uppercase tracking-[0.5px] text-text-tertiary mb-4">
          Sắp ra mắt
        </p>
        <h1 className="heading-sub-lg text-text-primary text-[1.6rem] md:text-[2.3rem] mb-4">
          Nhận biết biển báo
        </h1>
        <p className="text-[1rem] leading-[1.6] text-text-secondary max-w-md mx-auto">
          Trò chơi đang được phát triển. Hãy ôn luyện qua{' '}
          <Link href="/flashcards" className="text-brand hover:text-brand-hover font-medium transition-colors">
            Flashcard
          </Link>{' '}
          trong thời gian này.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/flashcards"
          className="px-6 py-2.5 rounded-xl bg-brand text-ivory font-medium text-sm shadow-ring-brand hover:bg-brand-hover transition-colors"
        >
          Học Flashcard
        </Link>
        <Link
          href="/landing"
          className="px-6 py-2.5 rounded-xl border border-border text-text-secondary font-medium text-sm hover:bg-bg-subtle transition-colors"
        >
          ← Trang chủ
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Apply token substitution to admin questions pages**

Read each file under `src/app/(admin)/`:
```bash
cat src/app/(admin)/page.tsx
cat src/app/(admin)/questions/page.tsx
cat src/app/(admin)/questions/[id]/page.tsx
```

Apply the same substitution rules:
- `text-slate-*` → appropriate `text-text-*` token
- `border-slate-*` → `border-border` or `border-border-strong`
- `bg-white dark:bg-slate-*` → `bg-bg-card`
- `bg-slate-50 dark:bg-slate-*` → `bg-bg-subtle`
- `bg-orange-*` → `bg-warm-sand`
- `text-orange-*` → `text-brand`
- `font-black` / `font-bold` headings using serif context → `heading-feature` or `heading-sub-sm` + remove `font-black`
- Input fields: apply `border-border bg-bg-card text-text-primary rounded-xl focus:border-focus-blue`
- Submit/primary buttons: `bg-brand text-ivory rounded-xl shadow-ring-brand`
- Delete/danger buttons: `bg-crimson/10 text-crimson border border-crimson/20`
- Table header row: `bg-bg-subtle text-text-tertiary text-[0.75rem]`
- Table rows: `border-b border-border hover:bg-bg-subtle`

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/(mini-games)/road-signs/page.tsx src/app/(admin)/
git commit -m "refactor(admin + road-signs): apply design token colors throughout"
```

---

## Task 15: Final verification + build

- [ ] **Step 1: Run full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: Build completes with no errors. Warnings about missing env vars (Supabase URL/key) are acceptable in build environment.

- [ ] **Step 3: Verify no references to removed colors remain**

```bash
grep -r "orange-" src/ --include="*.tsx" --include="*.ts" | grep -v ".next"
grep -r "slate-" src/ --include="*.tsx" --include="*.ts" | grep -v ".next"
grep -r "emerald-" src/ --include="*.tsx" --include="*.ts" | grep -v ".next"
grep -r "from-orange" src/ --include="*.tsx" | grep -v ".next"
```

Expected: Only matches inside comments or data strings (not class names). Fix any remaining class name references by applying the appropriate design token.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final design token cleanup — remove all remaining orange/slate/emerald class references"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Token system (4 CSS files)
- ✅ Tailwind v4 `@theme` + `@utility` for type scale
- ✅ Georgia + Inter typography
- ✅ HeroUIProvider (providers.tsx)
- ✅ Dark mode via `.dark` semantic overrides
- ✅ All button variants in components
- ✅ Landing page editorial restructure (Hero → Stats → Features dark → LicenseTypes → HowItWorks dark → CTA → Footer)
- ✅ Auth layout + pages refactored, callback URL fixed
- ✅ Learning/mini-games layouts refactored
- ✅ FlashCard + QuestionCard refactored
- ✅ Flashcards + Exam page refactored
- ✅ Admin layout + sidebar refactored
- ✅ Road signs refactored
- ✅ Server vs Client component split maintained
- ✅ Unused files deleted (AppButton, LearnLayout, GamesLayout)
- ✅ Auth callback URL consolidated to `/auth/callback`

**Type consistency:**
- `Section` component from `@/components/ui/Section` used in landing section components
- `Typography` components from `@/components/ui/Typography` used in landing section components
- `Card.Content` API kept as-is (matches existing working codebase)
- `Chip classNames` prop used for styling (HeroUI v3 pattern)
