"use client";

import { useState, useEffect, useRef } from "react";
import { LuMaximize, LuMinimize } from "react-icons/lu";
import type { GamePhase } from "../_lib/gameTypes";

type Props = {
  phase: GamePhase;
  frame: number;
  score: number;
  hearts: number;
  onQuit: () => void;
  children?: React.ReactNode;
};

function getFramePath(phase: GamePhase, frame: number): string {
  const padded = String(frame).padStart(4, "0");
  if (phase === "animating-green") {
    return `/3dassets/animations/green_light/drive_green${padded}.png`;
  }
  if (phase === "animating-drive") {
    return `/3dassets/animations/normally_drive/normally_drive${padded}.png`;
  }
  // animating-red and question-open both show red frames
  return `/3dassets/animations/red_light/drive_red${padded}.png`;
}

export default function GameScreen({
  phase,
  frame,
  score,
  hearts,
  onQuit,
  children,
}: Props) {
  const src = getFramePath(phase, frame);
  const containerRef = useRef<HTMLDivElement>(null);
  const [confirming, setConfirming] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync fullscreen state with actual browser state (handles Escape key)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden shadow-2xl transition-all duration-500 ${
        isFullscreen
          ? "fixed inset-0 z-[9999] h-screen w-screen rounded-0 bg-black"
          : "aspect-[4/5] md:aspect-video min-h-[360px] md:min-h-0 rounded-3xl border border-[#1E1E1E]/10 bg-[#F5F0E8]"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={src}
        src={src}
        alt={`animation frame ${frame}`}
        className="h-full w-full object-contain"
        draggable={false}
      />

      {/* Overlay HUD - Integrated into the Game Scene */}
      <div className="absolute inset-x-0 top-0 z-[60] flex items-start justify-between p-3 md:p-5 pointer-events-none">
        {confirming ? (
          <div className="pointer-events-auto flex flex-col gap-3 rounded-2xl border border-white/20 bg-black/80 p-5 text-white backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-300 max-w-[280px]">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-bold">Bạn muốn dừng trò chơi?</p>
            </div>
            <p className="text-[10px] text-white/60">Tiến trình hiện tại sẽ không được lưu nếu bạn thoát nửa chừng.</p>
            <div className="mt-1 flex gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 rounded-xl bg-white/10 py-2.5 text-xs font-bold hover:bg-white/20 transition-colors"
              >
                Tiếp tục học
              </button>
              <button
                onClick={onQuit}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-xs font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Thoát game
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-1 rounded-2xl bg-black/30 px-3 py-2 backdrop-blur-sm shadow-inner">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-lg md:text-xl transition-all ${i >= hearts ? 'grayscale opacity-30 scale-90' : 'animate-pulse'}`}>
                  {i < hearts ? "❤️" : "🖤"}
                </span>
              ))}
            </div>

            <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
              <button
                onClick={toggleFullscreen}
                className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md shadow-lg transition-all hover:bg-white/30 hover:scale-105 active:scale-95 border border-white/10"
                title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
              >
                {isFullscreen ? <LuMinimize size={20} /> : <LuMaximize size={20} />}
              </button>

              <div className="rounded-2xl bg-[#F4A616] px-4 py-1.5 text-center shadow-lg border-b-4 border-[#e59b11]">
                <span className="block text-[9px] font-bold text-black/40 uppercase">Điểm</span>
                <p className="text-lg md:text-xl font-black text-[#1E1E1E] leading-tight">{score}</p>
              </div>

              <button
                onClick={() => setConfirming(true)}
                className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-white/90 text-[#1E1E1E] shadow-lg transition-all hover:bg-white hover:scale-105 active:scale-95"
                title="Dừng game"
              >
                <span className="text-xl md:text-2xl">⛔</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Render question children only if not confirming */}
      {!confirming && children}
    </div>
  );
}
