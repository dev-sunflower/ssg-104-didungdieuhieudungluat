import type { GamePhase } from "../_lib/gameTypes";

type Props = {
  phase: GamePhase;
  frame: number;
  score: number;
  hearts: number;
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

export default function GameScreen({ phase, frame, score, hearts }: Props) {
  const src = getFramePath(phase, frame);

  return (
    <div className="flex flex-col gap-4">
      {/* HUD */}
      <div className="flex items-center justify-between rounded-2xl border border-[#1E1E1E]/10 bg-[#FFF4D6] px-4 py-2">
        <div className="flex gap-1 text-xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < hearts ? "❤️" : "🖤"}</span>
          ))}
        </div>
        <div className="text-right">
          <span className="text-xs text-[#1E1E1E]/50">Điểm</span>
          <p className="text-lg font-extrabold text-[#F4A616]">{score}</p>
        </div>
      </div>

      {/* Animation frame */}
      <div
        className="relative w-full overflow-hidden rounded-3xl border border-[#1E1E1E]/10 bg-[#F5F0E8] aspect-video"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`animation frame ${frame}`}
          className="h-full w-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}
