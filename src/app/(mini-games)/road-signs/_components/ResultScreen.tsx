import type { GameSession } from '@/lib/types/database'
import Leaderboard from './Leaderboard'

type Props = {
  score: number
  questionsAnswered: number
  heartsRemaining: number
  sessionId: string | null
  leaderboard: GameSession[]
  onRestart: () => void
}

export default function ResultScreen({
  score,
  questionsAnswered,
  heartsRemaining,
  sessionId,
  leaderboard,
  onRestart,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl border border-[#F4A616]/30 bg-[linear-gradient(145deg,#FFF4D6_0%,#FFE8A8_100%)] p-6 text-center">
        <span className="text-5xl">{heartsRemaining > 0 ? '🏁' : '💀'}</span>
        <h2 className="mt-3 text-2xl font-extrabold text-[#1E1E1E]">
          {heartsRemaining > 0 ? 'Hoàn thành!' : 'Hết mạng!'}
        </h2>
        <div className="mt-4 flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-[#F4A616]">{score}</p>
            <p className="text-xs text-[#1E1E1E]/50">Điểm</p>
          </div>
          <div className="h-10 w-px bg-[#1E1E1E]/10" />
          <div className="text-center">
            <p className="text-3xl font-extrabold text-[#1E1E1E]">{questionsAnswered}</p>
            <p className="text-xs text-[#1E1E1E]/50">Câu đã trả lời</p>
          </div>
          <div className="h-10 w-px bg-[#1E1E1E]/10" />
          <div className="text-center">
            <div className="flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-base">{i < heartsRemaining ? '❤️' : '🖤'}</span>
              ))}
            </div>
            <p className="text-xs text-[#1E1E1E]/50">Mạng còn lại</p>
          </div>
        </div>
      </div>

      <Leaderboard entries={leaderboard} highlightId={sessionId ?? undefined} />

      <button
        onClick={onRestart}
        className="w-full rounded-2xl bg-[#F4A616] py-3.5 font-bold text-[#1E1E1E] transition hover:bg-[#e59b11]"
      >
        Chơi lại →
      </button>
    </div>
  )
}
