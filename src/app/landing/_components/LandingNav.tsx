'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4">
      <Link href="/landing" className="flex items-center gap-2.5">
        <Image src="/logo.webp" alt="Logo" width={32} height={32} className="rounded-xl" />
        <span className="font-serif font-medium text-[#1E1E1E] drop-shadow-sm">hocluatdema</span>
      </Link>
      <Link
        href="/auth/login"
        className="rounded-xl bg-white/80 px-5 py-2 text-sm font-semibold text-[#1E1E1E] shadow-sm backdrop-blur-sm transition hover:bg-white"
      >
        Đăng nhập
      </Link>
    </nav>
  )
}
