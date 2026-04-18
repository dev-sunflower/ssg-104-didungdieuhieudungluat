"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card } from "@heroui/react";
import { LuGamepad2, LuTrophy, LuTimer, LuZap, LuArrowRight, LuChevronLeft, LuStar, LuTarget, LuMedal } from "react-icons/lu";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

type GameState = "START" | "PLAYING" | "RESULT";

// Dữ liệu Demo mẫu để luôn đẹp và không lỗi
const MOCK_LEADERBOARD = [
  { id: "1", name: "Nam Kỹ Năng", score: 4500, rank: 1, title: "Huyền thoại" },
  { id: "2", name: "Minh Thần Tốc", score: 4200, rank: 2, title: "Huyền thoại" },
  { id: "3", name: "Linh Phản Xạ", score: 3900, rank: 3, title: "Huyền thoại" },
  { id: "4", name: "Huy Biển Báo", score: 3500, rank: 4, title: "Chiến binh" },
  { id: "5", name: "Đạt G-Speed", score: 3100, rank: 5, title: "Chiến binh" },
];

export default function RoadSignsGame() {
  const [gameState, setGameState] = useState<GameState>("START");
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedName = localStorage.getItem("playerName");
    if (savedName) setPlayerName(savedName);
  }, []);

  const handleStartGame = () => {
    if (!playerName.trim()) return;
    localStorage.setItem("playerName", playerName.trim());
    setGameState("PLAYING");
  };

  if (!mounted) return null;

  // --- MÀN HÌNH BẮT ĐẦU (KÈM XẾP HẠNG) ---
  if (gameState === "START") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 md:p-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* CỘT TRÁI: NHẬP THÔNG TIN */}
          <Reveal>
            <Card className="h-full rounded-[48px] border-none shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden bg-white flex flex-col">
              <div className="bg-[linear-gradient(135deg,#F4A616_0%,#FFD700_100%)] p-12 text-[#1E1E1E] relative overflow-hidden shrink-0">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#1E1E1E] p-2.5 rounded-2xl text-white"><LuGamepad2 size={24} /></div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] opacity-70">Mini Game v1.0</span>
                  </div>
                  <h1 className="text-5xl font-black leading-tight mb-4 italic">Biển báo<br/>đường bộ</h1>
                  <p className="text-[#1E1E1E]/80 text-base font-bold bg-white/30 inline-block px-5 py-2 rounded-2xl backdrop-blur-sm shadow-sm">
                     ⚡ Nhìn nhanh, chọn đúng, leo Top!
                  </p>
                </div>
                <LuZap className="absolute -right-12 -bottom-12 opacity-10 rotate-12" size={280} />
              </div>
              
              <div className="p-10 space-y-8 flex-1 flex flex-col justify-center">
                <div className="space-y-4">
                  <label className="text-xs font-black text-[#1E1E1E]/40 uppercase tracking-[0.2em] ml-1">Danh tính của bạn</label>
                  <Input
                    placeholder="Nhập tên của bạn..."
                    size="lg"
                    variant="flat"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="font-black text-2xl"
                    onKeyDown={(e) => e.key === "Enter" && handleStartGame()}
                  />
                </div>

                <Button 
                  className="h-20 rounded-[28px] bg-[#1E1E1E] text-white font-black text-xl shadow-2xl hover:scale-[1.03] active:scale-95 transition-all w-full flex items-center justify-center gap-3 group"
                  onPress={handleStartGame}
                  isDisabled={!playerName.trim()}
                >
                  BẮT ĐẦU CHƠI <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </Reveal>

          {/* CỘT PHẢI: BẢNG XẾP HẠNG */}
          <Reveal>
            <Card className="h-full rounded-[48px] border-none shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden bg-[#1E1E1E] text-white flex flex-col">
              <div className="p-10 md:p-12 flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#F4A616] p-3 rounded-2xl rotate-12 shadow-lg shadow-[#F4A616]/20">
                      <LuTrophy size={28} className="text-[#1E1E1E]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Bảng Vàng</h2>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Huyền thoại phản xạ</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3">
                    <LuTarget className="text-[#F4A616]" size={16} />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Top 12%</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {MOCK_LEADERBOARD.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className="grid grid-cols-12 items-center px-6 py-4 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all group"
                    >
                      <div className="col-span-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-sm ${
                          idx === 0 ? "bg-[#FFD700] text-[#1E1E1E]" : 
                          idx === 1 ? "bg-[#E0E0E0] text-[#1E1E1E]" : 
                          idx === 2 ? "bg-[#CD7F32] text-[#1E1E1E]" : 
                          "bg-white/10 text-white/40"
                        }`}>
                          {item.rank}
                        </div>
                      </div>
                      <div className="col-span-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-[10px] text-white/60 border border-white/10 shrink-0">
                          {item.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-sm truncate">{item.name}</p>
                          <p className="text-[8px] font-black uppercase text-[#F4A616]/70 tracking-widest">{item.title}</p>
                        </div>
                      </div>
                      <div className="col-span-4 text-right flex items-center justify-end gap-2">
                        <span className="text-lg font-black tabular-nums">{item.score.toLocaleString()}</span>
                        <LuStar size={12} className="fill-[#F4A616] text-[#F4A616]" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Cập nhật mỗi 5 giây</p>
                </div>
              </div>
            </Card>
          </Reveal>

        </div>
      </div>
    );
  }

  // --- MÀN HÌNH CHƠI ---
  if (gameState === "PLAYING") {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center p-4">
        <div className="bg-[#1E1E1E] p-8 rounded-[40px] text-white w-full max-w-4xl shadow-2xl relative overflow-hidden border-2 border-white/5">
            <div className="flex justify-between items-center mb-12 relative z-10">
                <div className="flex gap-6">
                    <div className="text-center bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Score</p>
                        <p className="text-3xl font-black tabular-nums leading-none">{score}</p>
                    </div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-[#F4A616] flex items-center justify-center text-[#1E1E1E] shadow-lg shadow-[#F4A616]/20">
                    <LuTimer size={32} />
                </div>
            </div>

            <div className="flex flex-col items-center gap-10 relative z-10">
                <div className="w-48 h-48 bg-white rounded-[48px] flex items-center justify-center p-8 shadow-[0_0_50px_rgba(244,166,22,0.3)]">
                    <div className="w-full h-full bg-[#1E1E1E] rounded-full flex items-center justify-center text-white text-5xl font-black italic">(!)</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {["Nguy hiểm", "Cấm đi", "Chướng ngại", "Hẹp đường"].map((opt, i) => (
                        <Button 
                            key={i}
                            className="h-20 rounded-3xl bg-white/5 border border-white/10 hover:border-[#F4A616] hover:bg-white/10 text-xl font-bold transition-all text-left justify-start px-8"
                            onPress={() => {
                                setScore(s => s + 500);
                                if (score >= 2000) setGameState("RESULT");
                            }}
                        >
                            <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 font-black">{String.fromCharCode(65+i)}</span>
                            {opt}
                        </Button>
                    ))}
                </div>
            </div>
            <LuGamepad2 className="absolute -right-20 -bottom-20 text-white/5 rotate-12" size={400} />
        </div>
      </div>
    );
  }

  // --- MÀN HÌNH KẾT QUẢ ---
  if (gameState === "RESULT") {
    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4">
            <Reveal>
                <Card className="max-w-2xl w-full rounded-[56px] border-none shadow-[0_50px_120px_rgba(0,0,0,0.2)] overflow-hidden bg-bg-card flex flex-col items-stretch">
                    <div className="bg-[#1E1E1E] p-16 text-white text-center relative overflow-hidden">
                        <div className="w-24 h-24 bg-[#F4A616] rounded-[32px] flex items-center justify-center mx-auto mb-8 rotate-12 shadow-2xl shadow-[#F4A616]/30">
                            <LuTrophy size={48} className="text-[#1E1E1E]" />
                        </div>
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#F4A616] mb-4">Màn chơi kết thúc</h2>
                        <p className="text-7xl font-black mb-4 tabular-nums italic leading-none">{score}</p>
                        <p className="text-white/30 font-black uppercase text-[10px] tracking-widest">Tổng điểm đạt được</p>
                    </div>

                    <div className="p-10 space-y-4">
                        <Button className="h-20 rounded-[28px] bg-[#F4A616] text-[#1E1E1E] font-black text-xl shadow-xl shadow-[#F4A616]/20 hover:scale-105 transition-all w-full" onPress={() => setGameState("PLAYING")}>
                            THỬ LẠI NGAY
                        </Button>
                        <Button variant="bordered" className="h-20 rounded-[28px] border-3 border-[#1E1E1E]/10 font-black text-xl hover:bg-bg-subtle transition-all w-full" onPress={() => setGameState("START")}>
                            VỀ MENU CHÍNH
                        </Button>
                        <Link href="/landing" className="flex items-center justify-center gap-2 pt-4 text-xs font-black text-text-tertiary hover:text-[#F4A616] transition-colors uppercase tracking-widest">
                            <LuChevronLeft size={16} /> Về trang chủ
                        </Link>
                    </div>
                </Card>
            </Reveal>
        </div>
    )
  }

  return null;
}
