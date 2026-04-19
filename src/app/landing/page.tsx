'use client'
import { useRef, useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { QUIZ_DATA } from './_data/quizData'
import LandingNav from './_components/LandingNav'
import HeroText from './_components/HeroText'
import SignInfoPanel from './_components/SignInfoPanel'
import QuizPanel from './_components/QuizPanel'
import { SiteFooter } from './_components/SiteFooter'
import type { Phase } from './_components/LandingCanvas'

const LandingCanvas = dynamic(() => import('./_components/LandingCanvas'), { ssr: false })

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef({ progress: 0 })
  const phaseRef = useRef<Phase>('hero')

  const [phase, setPhase] = useState<Phase>('hero')
  const [selectedSign, setSelectedSign] = useState<number | null>(null)
  const [heroOpacity, setHeroOpacity] = useState(1)
  const [quizOpacity, setQuizOpacity] = useState(0)

  const quizSignId = useMemo(
    () => QUIZ_DATA[Math.floor(Math.random() * QUIZ_DATA.length)].signId,
    [],
  )

  // ─── GSAP ScrollTrigger (outside R3F — avoids React reconciler timing issues) ─

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const container = containerRef.current
    if (!container) return

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress
        scrollProgressRef.current.progress = p

        // Hero text opacity: full until 20%, fades out during transition
        if (p < 0.2) {
          setHeroOpacity(1)
        } else if (p < 0.4) {
          setHeroOpacity(Math.max(1 - ((p - 0.2) / 0.2) * 3, 0))
        } else {
          setHeroOpacity(0)
        }

        // Quiz panel opacity: fades in during transition to quiz
        if (p < 0.7) {
          setQuizOpacity(0)
        } else if (p < 0.8) {
          setQuizOpacity((p - 0.7) / 0.1)
        } else {
          setQuizOpacity(1)
        }

        // Phase transitions (few state updates = cheap)
        const newPhase: Phase = p < 0.4 ? 'hero' : p < 0.75 ? 'explore' : 'quiz'
        if (newPhase !== phaseRef.current) {
          phaseRef.current = newPhase
          setPhase(newPhase)
        }
      },
    })

    return () => st.kill()
  }, [])

  return (
    <>
      <LandingNav />

      {/* flex-none prevents body's flex-col from shrinking the 500vh container */}
      <div
        ref={containerRef}
        className="relative flex-none"
        style={{
          height: '500vh',
          background: 'linear-gradient(135deg, #FFF4D6 0%, #FFE29A 50%, #F4A616 100%)',
        }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <LandingCanvas
            scrollProgressRef={scrollProgressRef}
            onSignSelect={setSelectedSign}
            quizSignId={quizSignId}
            phase={phase}
          />

          <div className="pointer-events-none absolute inset-0">
            <HeroText
              visible={phase === 'hero' || heroOpacity > 0.01}
              opacity={heroOpacity}
            />
            <QuizPanel
              visible={phase === 'quiz' || quizOpacity > 0.01}
              opacity={quizOpacity}
            />
          </div>

          <SignInfoPanel signId={selectedSign} onClose={() => setSelectedSign(null)} />

          {phase === 'explore' && (
            <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-[#1E1E1E]/70 backdrop-blur-sm">
              Nhấn vào lá bài để xem chi tiết
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </>
  )
}
