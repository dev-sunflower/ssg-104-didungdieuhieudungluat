"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { QUIZ_DATA } from "./_data/quizData";
import LandingNav from "./_components/LandingNav";
import HeroText from "./_components/HeroText";
import SignInfoPanel from "./_components/SignInfoPanel";
import QuizPanel from "./_components/QuizPanel";
import { SiteFooter } from "./_components/SiteFooter";
import type { Phase } from "./_components/LandingCanvas";

const LandingCanvas = dynamic(() => import("./_components/LandingCanvas"), {
  ssr: false,
});

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef({ progress: 0 });
  const phaseRef = useRef<Phase>("hero");

  const [phase, setPhase] = useState<Phase>("hero");
  const [selectedSign, setSelectedSign] = useState<number | null>(null);
  const [frogMenuOpen, setFrogMenuOpen] = useState(false);
  const handleFrogClick = useCallback(() => setFrogMenuOpen(true), []);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [quizOpacity, setQuizOpacity] = useState(0);
  const [quizSignId, setQuizSignId] = useState(
    () => QUIZ_DATA[Math.floor(Math.random() * QUIZ_DATA.length)].signId,
  );

  // ─── Performance Settings ──────────────────────────────────────────────────
  const [lowPerfMode, setLowPerfMode] = useState(false);
  const [lightsOff, setLightsOff] = useState(false);
  const [animationsOff, setAnimationsOff] = useState(false);
  const quizTransitionEnteredRef = useRef(false);

  // ─── GSAP ScrollTrigger (outside R3F — avoids React reconciler timing issues) ─

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = containerRef.current;
    if (!container) return;

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        scrollProgressRef.current.progress = p;

        // Hero text opacity: full until 20%, fades out during transition
        if (p < 0.2) {
          setHeroOpacity(1);
        } else if (p < 0.4) {
          setHeroOpacity(Math.max(1 - ((p - 0.2) / 0.2) * 3, 0));
        } else {
          setHeroOpacity(0);
        }

        // Quiz panel opacity: fades in during transition to quiz
        if (p < 0.7) {
          setQuizOpacity(0);
          quizTransitionEnteredRef.current = false;
        } else if (p < 0.8) {
          if (!quizTransitionEnteredRef.current) {
            quizTransitionEnteredRef.current = true;
            setQuizSignId(
              QUIZ_DATA[Math.floor(Math.random() * QUIZ_DATA.length)].signId,
            );
          }
          setQuizOpacity((p - 0.7) / 0.1);
        } else {
          setQuizOpacity(1);
        }

        // Phase transitions (few state updates = cheap)
        const newPhase: Phase =
          p < 0.4 ? "hero" : p < 0.75 ? "explore" : "quiz";
        if (newPhase !== phaseRef.current) {
          phaseRef.current = newPhase;
          setPhase(newPhase);
        }
      },
    });

    return () => st.kill();
  }, []);

  return (
    <>
      <LandingNav
        lowPerfMode={lowPerfMode} setLowPerfMode={setLowPerfMode}
        lightsOff={lightsOff} setLightsOff={setLightsOff}
        animationsOff={animationsOff} setAnimationsOff={setAnimationsOff}
      />

      {/* flex-none prevents body's flex-col from shrinking the 500vh container */}
      <div
        ref={containerRef}
        className={`relative flex-none bg-[#FFF8E7]${animationsOff ? " [&_.animate-blob]:animation-none" : ""}`}
        style={{ height: "500vh" }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Dynamic Animated Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] animate-blob" 
                 style={{ background: "radial-gradient(circle, rgba(255,226,154,0.6) 0%, rgba(255,226,154,0) 70%)" }} />
            <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] animate-blob animation-delay-2000" 
                 style={{ background: "radial-gradient(circle, rgba(255,209,102,0.5) 0%, rgba(255,209,102,0) 70%)" }} />
            <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] animate-blob animation-delay-4000" 
                 style={{ background: "radial-gradient(circle, rgba(244,166,22,0.3) 0%, rgba(244,166,22,0) 70%)" }} />

            {/* Subtle noise texture for a premium feel */}
            <div
              className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
              }}
            />
          </div>

          <LandingCanvas
            scrollProgressRef={scrollProgressRef}
            onSignSelect={setSelectedSign}
            quizSignId={quizSignId}
            onFrogClick={handleFrogClick}
            lightsOff={lightsOff}
            animationsOff={animationsOff}
            lowPerfMode={lowPerfMode}
          />

          <div className="pointer-events-none absolute inset-0">
            <HeroText
              visible={phase === "hero" || heroOpacity > 0.01}
              opacity={heroOpacity}
            />
            <QuizPanel
              visible={phase === "quiz" || quizOpacity > 0.01}
              opacity={quizOpacity}
            />
          </div>

          <SignInfoPanel
            signId={selectedSign}
            onClose={() => setSelectedSign(null)}
          />

          {phase === "explore" && (
            <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-[#1E1E1E]/70 backdrop-blur-sm">
              Nhấn vào lá bài để xem chi tiết
            </div>
          )}

          {/* Placeholder Frog Menu */}
          {frogMenuOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
                <button
                  onClick={() => setFrogMenuOpen(false)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-800"
                >
                  ✕
                </button>
                <h3 className="mb-4 text-xl font-bold font-[var(--font-caveat)] text-[#F4A616]">Interactive Frog! 🐸</h3>
                <p className="text-gray-600">Đây là menu giữ chỗ (placeholder) bật lên khi bấm vào con ếch. Bạn có thể thay đổi nội dung này sau.</p>
                <button 
                  onClick={() => setFrogMenuOpen(false)}
                  className="mt-6 w-full rounded-2xl bg-[#FFE29A] py-3 font-semibold text-[#1E1E1E] transition hover:bg-[#F4A616]"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
