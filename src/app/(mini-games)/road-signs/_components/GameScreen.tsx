"use client";

import { useState } from "react";
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

export default function GameScreen({ phase, frame, score, hearts, onQuit, children }: Props) {
  const src = getFramePath(phase, frame);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* HUD */}
      <div className="flex items-center justify-between rounded-2xl border border-[#1E1E1E]/10 bg-[#FFF4D6] px-4 py-2 min-h-[52px]">
        {confirming ? (
          /* Confirmation bar */
          <div className="flex w-full items-center justify-between gap-3">
            <span className="text-sm font-semibold text-[#1E1E1E]">
              Dừng game? Điểm sẽ được lưu.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="rounded-xl border border-[#1E1E1E]/15 bg-white px-3 py-1 text-xs font-semibold text-[#1E1E1E] transition hover:bg-[#f0f0f0]"
              >
                Tiếp tục
              </button>
              <button
                onClick={onQuit}
                className="rounded-xl bg-red-500 px-3 py-1 text-xs font-bold text-white transition hover:bg-red-600"
              >
                Dừng
              </button>
            </div>
          </div>
        ) : (
          /* Normal HUD */
          <>
            <div className="flex gap-1 text-xl">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < hearts ? "❤️" : "🖤"}</span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-[#1E1E1E]/50">Điểm</span>
                <p className="text-lg font-extrabold text-[#F4A616]">{score}</p>
              </div>
              <button
                onClick={() => setConfirming(true)}
                title="Dừng game"
                className="rounded-xl border border-[#1E1E1E]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#1E1E1E]/60 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
              >
                ⛔ Dừng
              </button>
            </div>
          </>
        )}
      </div>

      {/* Animation frame — children render centered on top without full-page overlay */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-[#1E1E1E]/10 bg-[#F5F0E8] aspect-video">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`animation frame ${frame}`}
          className="h-full w-full object-contain"
          draggable={false}
        />
        {children}
      </div>
    </div>
  );
}
