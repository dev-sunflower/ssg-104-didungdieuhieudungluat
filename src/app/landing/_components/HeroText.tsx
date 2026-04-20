"use client";
import { useState, useEffect, useRef } from "react";

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
  // Mouse position relative to viewport top-left
  const [mouse, setMouse] = useState({ x: -999, y: -999 });
  const [outside, setOutside] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
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
        className="mt-16 text-5xl font-bold text-[#1E1E1E] drop-shadow-sm sm:text-6xl md:text-7xl"
        style={{ fontFamily: "var(--font-finger-paint)" }}
      >
        Hoc Luat De Ma
      </h1>

      {/* Speech bubble — appears above the sign cluster (offset from cursor) */}
      {bubbleVisible && (
        <div
          className="pointer-events-none absolute"
          style={{
            left: mouse.x + 60,
            top: mouse.y - 80,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className="relative whitespace-nowrap rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#1E1E1E] shadow-lg"
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: "1rem",
              animation:
                "frog-bubble-pop 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
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
      )}

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
