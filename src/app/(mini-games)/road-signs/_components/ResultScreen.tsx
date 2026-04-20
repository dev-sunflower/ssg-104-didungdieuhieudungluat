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
  const won = heartsRemaining > 0

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl border border-[#F4A616]/30 bg-[linear-gradient(145deg,#FFF4D6_0%,#FFE8A8_100%)] p-6 text-center">
        <span className="inline-block text-6xl animate-bounce">{won ? '🏁' : '💀'}</span>
        <h2 className="mt-3 text-3xl font-bold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-caveat)' }}>
          {won ? 'Hoàn thành!' : 'Hết mạng!'}
        </h2>

        <div className="mt-5 flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-5xl font-bold text-[#F4A616]" style={{ fontFamily: 'var(--font-caveat)' }}>{score}</p>
            <p className="mt-1 text-xs text-[#1E1E1E]/50">Điểm</p>
          </div>
          <div className="h-12 w-px bg-[#1E1E1E]/10" />
          <div className="text-center">
            <p className="text-5xl font-bold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-caveat)' }}>{questionsAnswered}</p>
            <p className="mt-1 text-xs text-[#1E1E1E]/50">Câu đã trả lời</p>
          </div>
          <div className="h-12 w-px bg-[#1E1E1E]/10" />
          <div className="text-center">
            <div className="flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-lg">{i < heartsRemaining ? '❤️' : '🖤'}</span>
              ))}
            </div>
            <p className="mt-1 text-xs text-[#1E1E1E]/50">Mạng còn lại</p>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <Leaderboard entries={leaderboard} highlightId={sessionId ?? undefined} />
      </div>

      <button
        onClick={onRestart}
        className="group w-full rounded-2xl bg-[#F4A616] py-3.5 font-bold text-[#1E1E1E] transition hover:bg-[#e59b11]"
      >
        Chơi lại <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </button>
    </div>
  )
}
