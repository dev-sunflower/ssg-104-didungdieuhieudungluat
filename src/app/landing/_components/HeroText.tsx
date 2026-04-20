import { useState, useEffect, useRef } from "react";
import { FiMousePointer, FiRotateCcw, FiMaximize2 } from "react-icons/fi";

const MESSAGES = [
  "Ê! Quay lại học đi! 🎉",
  "Đừng chạy trốn! 🐸",
  "Hey, come back! It's fun! ✨",
  "Biển báo cần bạn! 🚦",
  "Tui đuổi bạn hoài à~ 🏃",
  "Học luật dễ lắm mà~ 📚",
  "Nhanh nào, bài thi gần rồi! 😤",
  "Psst... chỉ 5 phút thôi! 🥺",
];

type Props = {
  visible: boolean;
  opacity: number;
};

export default function HeroText({ visible, opacity }: Props) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [outside, setOutside] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (bubbleRef.current) {
        // Direct DOM update instead of React state for 60fps performance
        bubbleRef.current.style.left = `${e.clientX + 30}px`;
        bubbleRef.current.style.top = `${e.clientY - 15}px`;
      }
      const dx = e.clientX - window.innerWidth / 2;
      const dy = e.clientY - window.innerHeight / 2;
      setOutside(Math.sqrt(dx * dx + dy * dy) > 200);
    };
    const onLeave = () => {
      setOutside(false);
      setBubbleVisible(false);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Show bubble with a tiny delay so it doesn't flash on quick passes
  useEffect(() => {
    if (outside) {
      timeoutRef.current = setTimeout(() => setBubbleVisible(true), 300);
    } else {
      clearTimeout(timeoutRef.current!);
      setBubbleVisible(false);
    }
    return () => clearTimeout(timeoutRef.current!);
  }, [outside]);

  // Rotate messages while bubble is visible
  useEffect(() => {
    if (!bubbleVisible) return;
    intervalRef.current = setInterval(() => {
      setMsgIdx((i) => (i + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(intervalRef.current!);
  }, [bubbleVisible]);

  if (!visible && opacity < 0.01) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex flex-col px-6 text-center"
      style={{ opacity, transition: "opacity 0.3s ease" }}
    >
      {/* Title above the signs */}
      <h1
        className="mt-16 text-5xl font-bold text-[#1E1E1E] drop-shadow-sm sm:text-6xl md:text-8xl"
        style={{ fontFamily: "var(--font-good-dog)" }}
      >
        Học Luật Dễ Mà
      </h1>

      {/* Speech bubble wrapper — position updated via Ref for performance */}
      <div
        ref={bubbleRef}
        className="pointer-events-none fixed z-50 transition-opacity duration-300"
        style={{
          transform: "translate(-50%, -100%)",
          opacity: bubbleVisible ? 1 : 0,
        }}
      >
        <div
          className="relative whitespace-nowrap rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#1E1E1E] shadow-lg"
          style={{
            fontFamily: "var(--font-caveat)",
            fontSize: "1rem",
            animation: bubbleVisible
              ? "frog-bubble-pop 0.25s cubic-bezier(0.34,1.56,0.64,1) both"
              : "none",
          }}
        >
          {MESSAGES[msgIdx]}
          {/* tail angled toward the sign below-left */}
          <span
            className="absolute top-full border-8 border-transparent border-t-white"
            style={{
              left: "30%",
              filter: "drop-shadow(0 2px 1px rgba(0,0,0,0.08))",
            }}
          />
        </div>
      </div>

      {/* Minimal Frog Interaction Guide */}
      <div
        className="absolute top-[68%] left-1/2 flex -translate-x-1/2 items-center gap-4 sm:gap-6 text-[9px] sm:text-[11px] font-medium uppercase tracking-[0.15em] text-[#1E1E1E]/50"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <div className="flex items-center gap-2 transition-opacity hover:opacity-100 cursor-default">
          <FiMousePointer className="text-[12px]" />
          <span>Nhấn</span>
        </div>

        <div className="h-3 w-[1px] bg-[#1E1E1E]/20" />

        <div className="flex items-center gap-2 transition-opacity hover:opacity-100 cursor-default">
          <FiRotateCcw className="text-[12px]" />
          <span>Xoay</span>
        </div>

        <div className="h-3 w-[1px] bg-[#1E1E1E]/20" />

        <div className="flex items-center gap-2 transition-opacity hover:opacity-100 cursor-default">
          <FiMaximize2 className="text-[12px]" />
          <span>Zoom</span>
        </div>
      </div>

      {/* Spacer pushes scroll hint to bottom */}
      <div className="flex-1" />

      <p className="mb-10 animate-bounce text-sm text-[#1E1E1E]/50">
        ↓ Cuộn xuống để khám phá
      </p>

      <style>{`
        @keyframes frog-bubble-pop {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
