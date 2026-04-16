'use client'

import { AuthProvider } from '@/contexts/AuthContext'

// HeroUI v3 is CSS-first — theming is handled via @heroui/styles import in globals.css.
export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
