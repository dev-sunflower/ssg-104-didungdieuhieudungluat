"use client";

import { useState, useEffect } from "react";
import { Button, Card, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { LuTrophy, LuTimer, LuStar, LuSearch, LuChevronLeft } from "react-icons/lu";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

const mockLeaderboard = [
  { rank: 1, name: "Anh#42", score: 2450, time: "0:45", date: "2026-04-18" },
  { rank: 2, name: "Minh Quân", score: 2100, time: "0:52", date: "2026-04-18" },
  { rank: 3, name: "Thảo_cute", score: 1980, time: "0:48", date: "2026-04-17" },
  { rank: 4, name: "Đạt G", score: 1850, time: "1:02", date: "2026-04-18" },
  { rank: 5, name: "Hoàng Gia", score: 1720, time: "0:55", date: "2026-04-15" },
  { rank: 6, name: "Bảo Ngọc", score: 1600, time: "1:10", date: "2026-04-18" },
  { rank: 7, name: "Sơn Tùng", score: 1550, time: "1:05", date: "2026-04-16" },
];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState("today");
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) setPlayerName(savedName);
  }, []);

  // Mock checking if current player is in the list
  const isCurrentPlayer = (name: string) => playerName === name;

  return (
    <div className="min-h-screen bg-bg-page pb-20">
      <div className="bg-[linear-gradient(135deg,#1E1E1E_0%,#333333_100%)] py-16 md:py-24 text-white relative overflow-hidden mb-[-60px]">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <Link href="/landing" className="inline-flex items-center gap-2 text-white/50 hover:text-brand transition-colors mb-8 font-black text-xs uppercase tracking-widest">
            <LuChevronLeft size={18} />
            Quay lại trang chủ
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand p-3 rounded-[24px] shadow-2xl shadow-brand/20 rotate-12">
                  <LuTrophy size={32} className="text-[#1E1E1E]" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter">Bảng Xếp Hạng</h1>
              </div>
              <p className="text-white/60 font-bold text-lg max-w-md leading-relaxed">
                Những cao thủ đã chinh phục biển báo. <span className="text-brand">Bạn đang đứng ở đâu?</span>
              </p>
            </div>
            
            <div className="flex items-center gap-5 bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center text-[#1E1E1E] shadow-lg shadow-brand/20">
                    <LuStar size={28} className="fill-[#1E1E1E]" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Thứ hạng của bạn</p>
                    <p className="font-black text-2xl text-white">
                        {playerName ? (
                            <span className="flex items-center gap-2">
                                #84 <span className="text-sm font-bold text-white/40">{playerName}</span>
                            </span>
                        ) : "Chưa có"}
                    </p>
                </div>
            </div>
          </div>
        </div>
        
        <div className="absolute -right-20 -bottom-20 opacity-5 rotate-12 pointer-events-none">
            <LuTrophy size={500} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <Card className="rounded-[48px] border-none shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden bg-bg-card">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <Tabs 
                    aria-label="Filter" 
                    color="primary" 
                    variant="bordered"
                    selectedKey={filter}
                    onSelectionChange={(key) => setFilter(key.toString())}
                    classNames={{
                        tabList: "bg-bg-subtle p-2 rounded-[22px] border-none",
                        cursor: "rounded-[16px] bg-[#1E1E1E] shadow-xl",
                        tab: "h-11 px-8 font-black text-xs uppercase tracking-widest",
                        tabContent: "group-data-[selected=true]:text-white text-text-tertiary"
                    }}
                >
                  <Tab key="today" title="Hôm nay" />
                  <Tab key="week" title="Tuần" />
                  <Tab key="all" title="Tất cả" />
                </Tabs>

                <div className="relative group flex-1 md:max-w-[280px]">
                    <LuSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Tìm cao thủ..."
                        className="w-full h-14 pl-14 pr-6 rounded-[22px] bg-bg-subtle border-3 border-transparent focus:border-brand transition-all font-black text-sm outline-none placeholder:font-bold placeholder:text-text-tertiary shadow-inner"
                    />
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table 
                    aria-label="Leaderboard"
                    removeWrapper
                    classNames={{
                        th: "bg-transparent text-text-tertiary font-black uppercase tracking-[0.15em] text-[10px] border-b-2 border-border/50 py-6",
                        td: "py-6 border-b border-border/30 font-bold",
                        tr: "transition-all duration-300"
                    }}
                >
                    <TableHeader>
                        <TableColumn width={100}>XẾP HẠNG</TableColumn>
                        <TableColumn>VẬN ĐỘNG VIÊN</TableColumn>
                        <TableColumn>ĐIỂM SỐ</TableColumn>
                        <TableColumn>THỜI GIAN</TableColumn>
                        <TableColumn align="end">DANH HIỆU</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {mockLeaderboard.map((item) => (
                            <TableRow key={item.rank} className={isCurrentPlayer(item.name) ? "bg-brand/10 scale-[1.01] shadow-lg rounded-2xl" : "hover:bg-bg-subtle/50"}>
                                <TableCell>
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                                        item.rank === 1 ? "bg-[#FFD700] text-[#1E1E1E] shadow-lg shadow-[#FFD700]/20" : 
                                        item.rank === 2 ? "bg-[#E0E0E0] text-[#1E1E1E] shadow-lg shadow-[#E0E0E0]/20" : 
                                        item.rank === 3 ? "bg-[#CD7F32] text-[#1E1E1E] shadow-lg shadow-[#CD7F32]/20" : "bg-bg-subtle text-text-tertiary"
                                    }`}>
                                        {item.rank}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[18px] bg-bg-subtle border-2 border-white flex items-center justify-center text-sm font-black shadow-sm">
                                            {item.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className={`text-base font-black ${isCurrentPlayer(item.name) ? "text-[#1E1E1E]" : "text-text-primary"}`}>
                                                {item.name}
                                                {isCurrentPlayer(item.name) && (
                                                    <span className="ml-2 text-[9px] bg-[#1E1E1E] text-white px-2 py-1 rounded-lg tracking-tighter">YOU</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-xl font-black tabular-nums text-[#1E1E1E]">
                                        <LuStar size={16} className="fill-brand text-brand" />
                                        {item.score.toLocaleString()}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-text-secondary font-black tabular-nums">
                                        <LuTimer size={16} />
                                        {item.time}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        size="sm" 
                                        variant="flat" 
                                        color={item.rank <= 3 ? "warning" : "default"}
                                        classNames={{ 
                                            base: "h-7 rounded-lg px-3",
                                            content: "font-black text-[9px] uppercase tracking-widest" 
                                        }}
                                    >
                                        {item.rank <= 3 ? "LEGEND" : "CHALLENGER"}
                                    </Chip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>

              <div className="mt-16 flex flex-col items-center">
                 <div className="p-12 rounded-[40px] bg-bg-subtle border-3 border-dashed border-border/50 text-center max-w-xl w-full relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <p className="text-[#1E1E1E] font-black text-2xl mb-3">Sẵn sàng so tài?</p>
                        <p className="text-base text-text-tertiary font-bold mb-8">Chỉ mất 60 giây để ghi danh vào huyền thoại.</p>
                        <Link href="/road-signs">
                            <Button className="h-16 px-12 rounded-[24px] bg-[#1E1E1E] text-white font-black text-xl shadow-2xl shadow-black/20 hover:scale-105 transition-all active:scale-95">
                                CHƠI NGAY LEO TOP
                            </Button>
                        </Link>
                    </div>
                 </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

