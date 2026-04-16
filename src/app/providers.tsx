'use client'

// HeroUI v3 is CSS-first — theming is handled via @heroui/styles import in globals.css.
// This wrapper exists for future providers (e.g. next-themes dark mode toggle).
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
