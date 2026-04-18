"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card, RadioGroup, Radio } from "@heroui/react";
import { LuGamepad2, LuTrophy, LuTimer, LuZap, LuArrowRight, LuChevronLeft } from "react-icons/lu";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

type GameState = "START" | "PLAYING" | "RESULT";

export default function RoadSignsGame() {
  const [gameState, setGameState] = useState<GameState>("START");
  const [playerName, setPlayerName] = useState("");
  const [gameMode, setGameMode] = useState("classic");
  const [score, setScore] = useState(0);

  // Load name from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const handleStartGame = () => {
    if (!playerName.trim()) return;
    
    // Sanitize and save name
    let finalName = playerName.trim().substring(0, 15);
    
    // Add suffix if name is short or to make it unique-ish
    if (!finalName.includes('#')) {
        finalName += "#" + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }
    
    setPlayerName(finalName);
    localStorage.setItem("playerName", finalName);
    setGameState("PLAYING");
  };

  const handleFinish = () => {
    setGameState("RESULT");
  };

  if (gameState === "START") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <Reveal>
          <Card className="max-w-2xl w-full rounded-[48px] border-none shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden bg-bg-card">
            <div className="bg-[linear-gradient(135deg,#F4A616_0%,#FFD700_100%)] p-12 text-[#1E1E1E] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#1E1E1E] p-2.5 rounded-2xl text-white shadow-lg">
                    <LuGamepad2 size={24} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.3em] opacity-70">Mini Game v1.0</span>
                </div>
                <h1 className="text-5xl font-black leading-tight mb-4">Biển báo<br/>đường bộ</h1>
                <p className="text-[#1E1E1E]/80 text-base font-bold bg-white/30 inline-block px-5 py-2 rounded-2xl backdrop-blur-sm shadow-sm">
                   ⚡ Nhìn nhanh, chọn đúng, leo Top!
                </p>
              </div>
              <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12">
                <LuZap size={280} />
              </div>
            </div>
            
            <div className="p-12 space-y-10">
              <div className="space-y-5">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-black text-[#1E1E1E] uppercase tracking-[0.2em]">Danh tính của bạn</label>
                    <span className="text-[11px] font-bold text-text-tertiary">Tối đa 15 ký tự</span>
                </div>
                <Input
                  placeholder="Nhập tên của bạn..."
                  size="lg"
                  variant="flat"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  classNames={{
                    input: "font-black text-2xl placeholder:font-bold placeholder:text-text-tertiary px-4",
                    inputWrapper: "h-20 rounded-[24px] bg-bg-subtle focus-within:ring-4 focus-within:ring-brand/20 transition-all shadow-inner border-none"
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleStartGame()}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-[#1E1E1E] uppercase tracking-wider ml-1">Chế độ chơi</label>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setGameMode('classic')}
                        className={`p-4 rounded-[24px] border-3 transition-all flex flex-col items-center gap-2 ${gameMode === 'classic' ? 'border-brand bg-brand/10 shadow-lg shadow-brand/10' : 'border-bg-subtle bg-bg-subtle/50 opacity-60 hover:opacity-100'}`}
                    >
                        <LuTimer size={24} className={gameMode === 'classic' ? 'text-brand' : ''} />
                        <span className="font-black text-xs uppercase">Classic</span>
                    </button>
                    <button 
                        onClick={() => setGameMode('survival')}
                        className={`p-4 rounded-[24px] border-3 transition-all flex flex-col items-center gap-2 ${gameMode === 'survival' ? 'border-brand bg-brand/10 shadow-lg shadow-brand/10' : 'border-bg-subtle bg-bg-subtle/50 opacity-60 hover:opacity-100'}`}
                    >
                        <LuZap size={24} className={gameMode === 'survival' ? 'text-brand' : ''} />
                        <span className="font-black text-xs uppercase">Survival</span>
                    </button>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full h-18 rounded-[28px] bg-[#1E1E1E] text-white font-black text-xl shadow-2xl shadow-black/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                  onPress={handleStartGame}
                  isDisabled={!playerName.trim()}
                >
                  BẮT ĐẦU CHƠI
                  <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="mt-8 flex items-center justify-center gap-6">
                    <Link href="/leaderboard" className="flex items-center gap-2 text-xs font-black text-text-tertiary hover:text-brand transition-colors uppercase tracking-widest">
                        <LuTrophy size={14} />
                        Xếp hạng
                    </Link>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <button className="text-xs font-black text-text-tertiary hover:text-brand transition-colors uppercase tracking-widest">
                        Cách chơi
                    </button>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    );
  }

  if (gameState === "PLAYING") {
    return (
      <div className="min-h-[95vh] flex flex-col items-center p-4 max-w-5xl mx-auto w-full relative">
        {/* Fixed HUD */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl z-50">
            <div className="bg-white/95 backdrop-blur-2xl p-4 md:p-6 rounded-[40px] border-2 border-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] flex items-center justify-between">
                <div className="flex items-center gap-4 md:gap-8">
                    <div className="bg-brand/10 px-6 py-3 rounded-3xl border border-brand/20">
                        <p className="text-[10px] font-black text-brand uppercase tracking-widest leading-none mb-1.5">Score</p>
                        <p className="text-2xl md:text-4xl font-black text-[#1E1E1E] tabular-nums leading-none">{score.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#FF6B6B]/10 px-6 py-3 rounded-3xl border border-[#FF6B6B]/20 hidden sm:block">
                        <p className="text-[10px] font-black text-[#FF6B6B] uppercase tracking-widest leading-none mb-1.5">Combo</p>
                        <p className="text-2xl md:text-4xl font-black text-[#FF6B6B] flex items-center gap-1 leading-none">
                            x12 <LuZap size={20} className="fill-[#FF6B6B]" />
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-5">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none mb-1.5">Time Left</p>
                        <p className="text-2xl md:text-4xl font-black text-[#1E1E1E] tabular-nums leading-none">00:45</p>
                    </div>
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[28px] bg-[#1E1E1E] flex items-center justify-center text-white shadow-2xl">
                        <LuTimer size={36} />
                    </div>
                </div>
            </div>
            {/* Progress Bar */}
            <div className="mx-12 h-2 bg-bg-subtle rounded-b-full overflow-hidden border-x border-b border-border">
                <div className="h-full bg-brand w-[75%] transition-all duration-1000 shadow-[0_0_15px_rgba(244,166,22,0.5)]" />
            </div>
        </div>

        {/* Game Area */}
        <div className="w-full flex-1 flex flex-col items-center justify-center gap-14 mt-32">
            <Reveal>
                <div className="relative group">
                    <div className="absolute inset-0 bg-brand blur-[100px] opacity-30 group-hover:opacity-40 transition-opacity" />
                    <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-[72px] shadow-[0_50px_100px_rgba(0,0,0,0.2)] border-[16px] border-brand flex items-center justify-center p-10 relative z-10 transition-transform hover:scale-110 active:scale-95 will-change-transform">
                        <div className="w-full h-full bg-[#1E1E1E] rounded-full flex items-center justify-center text-white text-7xl font-black ring-[16px] ring-white shadow-inner">
                            (!)
                        </div>
                    </div>
                </div>
            </Reveal>

            <div className="w-full max-w-4xl">
                <p className="text-center font-black text-[#1E1E1E] uppercase tracking-[0.3em] text-sm mb-8 animate-pulse">Biển này báo gì? 🤔</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        "Nguy hiểm phía trước",
                        "Đoạn đường hay xảy ra tai nạn",
                        "Chú ý chướng ngại vật",
                        "Đường bị thu hẹp"
                    ].map((option, idx) => (
                        <Button 
                            key={idx}
                            className="w-full h-24 rounded-[32px] bg-white border-3 border-border/60 hover:border-brand hover:bg-brand/5 hover:scale-[1.03] active:scale-[0.97] font-bold text-text-primary transition-all text-left justify-start px-10 shadow-md hover:shadow-2xl hover:shadow-brand/15 group touch-manipulation will-change-transform"
                            onPress={() => {
                                setScore(s => s + 100);
                                if (score > 400) handleFinish();
                            }}
                        >
                            <span className="w-12 h-12 rounded-2xl bg-bg-subtle group-hover:bg-brand/20 group-hover:text-brand flex items-center justify-center text-lg mr-6 transition-colors font-black">{String.fromCharCode(65 + idx)}</span>
                            <span className="text-xl">{option}</span>
                        </Button>
                    ))}
                </div>
            </div>

            <Button 
                variant="light" 
                className="mt-8 font-black text-text-tertiary uppercase tracking-[0.2em] text-xs hover:text-[#FF6B6B] transition-colors"
                onPress={() => setGameState("START")}
            >
                Dừng cuộc chơi
            </Button>
        </div>
      </div>
    );
  }

  if (gameState === "RESULT") {
    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4">
            <Reveal>
                <Card className="max-w-2xl w-full rounded-[56px] border-none shadow-[0_50px_120px_rgba(0,0,0,0.2)] overflow-hidden bg-bg-card">
                    <div className="bg-[#1E1E1E] p-16 text-white text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-28 h-28 bg-brand rounded-[40px] flex items-center justify-center mx-auto mb-8 rotate-12 shadow-2xl shadow-brand/40">
                                <LuTrophy size={56} className="text-[#1E1E1E]" />
                            </div>
                            <h2 className="text-base font-black uppercase tracking-[0.4em] text-brand mb-4">Kết quả cuối cùng</h2>
                            <p className="text-7xl font-black mb-4 tabular-nums">{score.toLocaleString()}</p>
                            <p className="text-white/50 font-black uppercase tracking-[0.2em] text-xs">Tổng điểm đạt được</p>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(244,166,22,0.2),transparent_70%)]" />
                    </div>

                    <div className="p-12">
                        <div className="flex items-center justify-between p-8 rounded-[40px] bg-bg-subtle mb-10 border border-border/50 shadow-inner">
                            <div className="text-center flex-1 border-r border-border/60">
                                <p className="text-xs font-black text-text-tertiary uppercase tracking-widest mb-2">Thứ hạng</p>
                                <p className="text-4xl font-black text-[#1E1E1E]">#12</p>
                            </div>
                            <div className="text-center flex-1">
                                <p className="text-xs font-black text-text-tertiary uppercase tracking-widest mb-2">Chính xác</p>
                                <p className="text-4xl font-black text-[#1E1E1E]">94%</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Link href="/leaderboard">
                                <Button className="w-full h-20 rounded-[28px] bg-brand text-[#1E1E1E] font-black text-xl shadow-xl shadow-brand/20 hover:scale-105 transition-all">
                                    XẾP HẠNG
                                </Button>
                            </Link>
                            <Button 
                                variant="bordered" 
                                className="w-full h-20 rounded-[28px] border-3 border-border font-black text-xl hover:bg-bg-subtle transition-all"
                                onPress={() => {
                                    setScore(0);
                                    setGameState("PLAYING");
                                }}
                            >
                                CHƠI LẠI
                            </Button>
                        </div>

                        <Link href="/landing" className="flex items-center justify-center gap-2 mt-8 text-xs font-black text-text-tertiary hover:text-brand transition-colors uppercase tracking-widest">
                            <LuChevronLeft size={16} />
                            Về trang chủ
                        </Link>
                    </div>
                </Card>
            </Reveal>
        </div>
    )
  }

  return null;
}
