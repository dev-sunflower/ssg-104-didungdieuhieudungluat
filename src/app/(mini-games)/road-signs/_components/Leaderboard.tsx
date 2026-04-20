import type { GameSession } from '@/lib/types/database'

type Props = {
  entries: GameSession[]
  highlightId?: string
}

export default function Leaderboard({ entries, highlightId }: Props) {
  return (
    <div className="w-full rounded-3xl border border-[#1E1E1E]/10 bg-white p-4 shadow-[0_12px_30px_rgba(30,30,30,0.08)]">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#1E1E1E]/50">🏆 Bảng xếp hạng</h3>
      {entries.length === 0 ? (
        <p className="py-4 text-center text-sm text-[#1E1E1E]/40">Chưa có kết quả nào</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {entries.map((entry, i) => {
            const isHighlight = entry.id === highlightId
            const medals = ['🥇', '🥈', '🥉']
            return (
              <li
                key={entry.id}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm ${isHighlight ? 'bg-[#FFF4D6] font-bold' : 'bg-[#FAFAFA]'}`}
              >
                <span className="w-6 text-center text-base">{medals[i] ?? `${i + 1}`}</span>
                <span className="flex-1 truncate text-[#1E1E1E]">{entry.player_name}</span>
                <span className="font-bold text-[#F4A616]">{entry.score} pts</span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
