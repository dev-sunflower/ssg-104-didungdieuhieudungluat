'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button, Input, Card, Spinner } from '@heroui/react'
import { createClient } from '@/lib/supabase/client'
import type { LeaderboardEntry, LicenseType } from '@/lib/types/database'
import { LuTrophy, LuUser, LuTrendingUp, LuMedal, LuTarget, LuZap } from 'react-icons/lu'

interface LeaderboardProps {
  score: number
  licenseType: LicenseType
  onClose: () => void
}

const STORAGE_ID_KEY = 'ssg104_player_id'
const STORAGE_NAME_KEY = 'ssg104_player_name'

export default function Leaderboard({ score, licenseType, onClose }: LeaderboardProps) {
  const supabase = createClient()
  
  const [playerName, setPlayerName] = useState<string>('')
  const [playerId, setPlayerId] = useState<string>('')
  const [isNewPlayer, setIsNewPlayer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [topEntries, setTopEntries] = useState<LeaderboardEntry[]>([])
  const [rankPercent, setRankPercent] = useState<number | null>(null)
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [bestScore, setBestScore] = useState<number | null>(null)

  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_ID_KEY)
    const storedName = localStorage.getItem(STORAGE_NAME_KEY)

    if (storedId && storedName) {
      setPlayerId(storedId)
      setPlayerName(storedName)
      setIsNewPlayer(false)
      fetchLeaderboard(storedId)
    } else {
      setIsNewPlayer(true)
      setLoading(false)
    }
  }, [])

  const fetchLeaderboard = useCallback(async (currentId: string) => {
    setLoading(true)
    try {
      // 1. Fetch Top 10 THẬT
      const { data: topData } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('license_type_id', licenseType.id)
        .order('best_score', { ascending: false })
        .limit(10)
      
      if (topData) setTopEntries(topData)

      // 2. Fetch điểm cao nhất hiện tại của user
      const { data: playerData } = await supabase
        .from('leaderboard')
        .select('best_score')
        .eq('player_id', currentId)
        .eq('license_type_id', licenseType.id)
        .maybeSingle()
      
      const currentBest = playerData?.best_score ?? 0
      setBestScore(currentBest)

      // 3. Cập nhật điểm mới nếu cao hơn kỷ lục cũ
      if (score > currentBest) {
        const { error } = await supabase
          .from('leaderboard')
          .upsert({
            player_id: currentId,
            license_type_id: licenseType.id,
            name: localStorage.getItem(STORAGE_NAME_KEY) || 'Anonymous',
            best_score: score,
            updated_at: new Date().toISOString()
          }, { onConflict: 'player_id,license_type_id' })
        
        if (!error) {
          setBestScore(score)
          const { data: updatedTop } = await supabase
            .from('leaderboard')
            .select('*')
            .eq('license_type_id', licenseType.id)
            .order('best_score', { ascending: false })
            .limit(10)
          if (updatedTop) setTopEntries(updatedTop)
        }
      }

      // 4. Tính % thật so với toàn bộ database
      const finalScore = Math.max(score, currentBest)
      const { count: totalCount } = await supabase
        .from('leaderboard')
        .select('*', { count: 'exact', head: true })
        .eq('license_type_id', licenseType.id)
      
      const { count: higherCount } = await supabase
        .from('leaderboard')
        .select('*', { count: 'exact', head: true })
        .eq('license_type_id', licenseType.id)
        .gt('best_score', finalScore)

      const total = totalCount || 1
      const higher = higherCount || 0
      let percent = Math.round((higher / total) * 100)
      if (percent === 0) percent = 1
      
      setRankPercent(percent)
      setTotalPlayers(total)
    } catch (err) {
      console.error('Leaderboard error:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, licenseType.id, score])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim()) return
    const newId = crypto.randomUUID()
    localStorage.setItem(STORAGE_ID_KEY, newId)
    localStorage.setItem(STORAGE_NAME_KEY, playerName.trim())
    setPlayerId(newId)
    setIsNewPlayer(false)
    fetchLeaderboard(newId)
  }

  const getMotivationalMessage = (percent: number) => {
    if (percent <= 10) return { text: "Pro rồi 🔥", color: "text-brand" }
    if (percent <= 30) return { text: "Ổn áp 😎", color: "text-[#4ECDC4]" }
    if (percent <= 70) return { text: "Cố thêm chút nữa 👀", color: "text-[#F4A616]" }
    return { text: "Try hard đi bro 🥲", color: "text-crimson" }
  }

  if (isNewPlayer) {
    return (
      <Card className="rounded-3xl border border-[#1E1E1E]/10 bg-white p-6 shadow-xl">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF4D6] text-[#F4A616]">
              <LuUser size={32} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-text-primary">Lưu kỷ lục của bạn</h2>
          <p className="mt-2 text-sm text-text-secondary">Nhập tên để xem vị trí của bạn trên bảng xếp hạng.</p>
          <form onSubmit={handleRegister} className="mt-6 flex flex-col gap-4">
            <Input
              fullWidth
              placeholder="Tên của bạn..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              variant="bordered"
              classNames={{ inputWrapper: 'rounded-2xl border-border' }}
              autoFocus
            />
            <Button type="submit" fullWidth className="rounded-2xl bg-[#F4A616] py-6 font-bold text-[#1E1E1E]">
              Xem xếp hạng →
            </Button>
          </form>
        </div>
      </Card>
    )
  }

  return (
    <Card className="rounded-3xl border border-[#1E1E1E]/10 bg-white p-5 shadow-xl md:p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
          <LuTrophy className="text-[#F4A616]" /> Bảng xếp hạng {licenseType.code}
        </h2>
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Spinner color="warning" />
          <p className="text-sm text-text-tertiary">Đang tính toán thứ hạng...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Rank % Summary - THẬT */}
          <div className="rounded-2xl bg-[#FFF4D6] p-4 text-center border border-[#F4A616]/20 relative overflow-hidden">
            <div className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Vị trí của bạn</div>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-4xl font-serif font-bold text-text-primary italic">TOP {rankPercent}%</span>
            </div>
            {rankPercent !== null && (
              <p className={`mt-1 font-bold ${getMotivationalMessage(rankPercent).color}`}>
                {getMotivationalMessage(rankPercent).text}
              </p>
            )}
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-text-secondary">
              <span className="flex items-center gap-1"><LuTarget size={12}/> Kỷ lục: {bestScore}đ</span>
              <span className="flex items-center gap-1"><LuTrendingUp size={12}/> {totalPlayers} người chơi</span>
            </div>
            <LuZap className="absolute -right-2 -bottom-2 text-[#F4A616]/10" size={60} />
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-text-primary">
              <LuMedal className="text-brand" /> Top 10 cao thủ
            </div>
            
            <div className="divide-y divide-border/50 border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 gap-2 bg-bg-subtle/50 px-3 py-2 text-[10px] font-black uppercase text-text-tertiary">
                <div className="col-span-2">#</div>
                <div className="col-span-7">Người chơi</div>
                <div className="col-span-3 text-right">Điểm</div>
              </div>
              {topEntries.length > 0 ? topEntries.map((item, idx) => (
                <div key={item.id} className={`grid grid-cols-12 gap-2 px-3 py-3 items-center ${item.player_id === playerId ? 'bg-brand/10' : ''}`}>
                  <div className="col-span-2">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-lg text-[9px] font-bold ${
                      idx === 0 ? "bg-[#FFD700] text-[#1E1E1E]" : "bg-bg-subtle text-text-tertiary"
                    }`}>
                      {idx + 1}
                    </span>
                  </div>
                  <div className="col-span-7">
                    <span className={`text-xs truncate block ${item.player_id === playerId ? 'font-bold text-brand' : 'text-text-primary'}`}>
                      {item.name} {item.player_id === playerId && '(Bạn)'}
                    </span>
                  </div>
                  <div className="col-span-3 text-right text-xs font-mono font-bold">{item.best_score}</div>
                </div>
              )) : (
                <div className="py-8 text-center text-xs text-text-tertiary italic">
                  Hãy là người đầu tiên ghi danh!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
