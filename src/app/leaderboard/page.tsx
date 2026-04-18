"use client";

import { useState, useEffect } from "react";
import { LuTrophy, LuStar, LuChevronLeft, LuTarget, LuMedal } from "react-icons/lu";
import Link from "next/link";

// Dữ liệu DEMO mẫu
const MOCK_DATA = [
  { id: "1", name: "Nguyễn Văn Nam", score: 25, rank: 1, title: "Huyền thoại" },
  { id: "2", name: "Trần Minh Huy", score: 24, rank: 2, title: "Huyền thoại" },
  { id: "3", name: "Lê Thị Linh", score: 23, rank: 3, title: "Huyền thoại" },
  { id: "4", name: "Hoàng Anh Tuấn", score: 21, rank: 4, title: "Chiến binh" },
  { id: "5", name: "Phạm Đức Minh", score: 19, rank: 5, title: "Chiến binh" },
];

export default function LeaderboardPage() {
  const [selectedTab, setSelectedType] = useState("A1");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F5F4ED] pb-20 font-sans">
      {/* Header Demo */}
      <div className="bg-[#1E1E1E] py-16 text-white mb-[-40px]">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/landing" className="inline-flex items-center gap-2 text-white/50 hover:text-[#F4A616] mb-8 font-bold text-xs uppercase tracking-widest transition-colors">
            <LuChevronLeft size={18} /> Quay lại trang chủ
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#F4A616] p-3 rounded-2xl rotate-12 shadow-lg shadow-[#F4A616]/20">
                <LuTrophy size={32} className="text-[#1E1E1E]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">BẢNG VÀNG CAO THỦ</h1>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-[#F4A616] flex items-center justify-center text-[#1E1E1E]">
                <LuTarget size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-white/40 leading-none mb-1">Vị trí của bạn</p>
                <p className="font-black text-xl text-white leading-none">TOP 12%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-[40px] p-6 md:p-10 shadow-2xl shadow-black/5 border border-black/5">
          {/* Tabs Tự Chế (Không lỗi) */}
          <div className="flex gap-2 p-1.5 bg-[#F5F4ED] rounded-2xl mb-10 w-fit">
            {["A1", "A2", "B1", "B2"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedType(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                  selectedTab === tab 
                  ? "bg-[#1E1E1E] text-white shadow-lg" 
                  : "text-[#1E1E1E]/40 hover:text-[#1E1E1E]"
                }`}
              >
                Hạng {tab}
              </button>
            ))}
          </div>

          {/* Bảng Demo Tự Chế (Không bao giờ lỗi Collection) */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#1E1E1E]/30 mb-2">
              <div className="col-span-2 text-center">Hạng</div>
              <div className="col-span-6">Người chơi</div>
              <div className="col-span-4 text-right">Điểm số</div>
            </div>

            <div className="space-y-3">
              {MOCK_DATA.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="grid grid-cols-12 items-center px-6 py-5 bg-[#F5F4ED]/50 rounded-[24px] border border-transparent hover:border-[#F4A616]/30 hover:bg-white hover:shadow-xl transition-all group"
                >
                  <div className="col-span-2 flex justify-center">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${
                      idx === 0 ? "bg-[#FFD700] text-[#1E1E1E]" : 
                      idx === 1 ? "bg-[#E0E0E0] text-[#1E1E1E]" : 
                      idx === 2 ? "bg-[#CD7F32] text-[#1E1E1E]" : 
                      "bg-white text-[#1E1E1E]/40"
                    }`}>
                      {item.rank}
                    </div>
                  </div>
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-[#1E1E1E]/5 flex items-center justify-center font-black text-xs text-[#1E1E1E]/60 shadow-inner">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-[#1E1E1E]">{item.name}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#F4A616]">{item.title}</p>
                    </div>
                  </div>
                  <div className="col-span-4 text-right flex items-center justify-end gap-2">
                    <span className="text-2xl font-black text-[#1E1E1E] italic tabular-nums">{item.score}</span>
                    <LuStar size={16} className="fill-[#F4A616] text-[#F4A616]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="p-8 rounded-[32px] bg-[#1E1E1E] text-white relative overflow-hidden group">
               <div className="relative z-10">
                 <p className="text-xl font-black mb-2 italic">BẠN CÓ THỂ LÀM TỐT HƠN?</p>
                 <p className="text-white/50 text-sm font-bold mb-6 italic">Hãy chứng minh thực lực của mình ngay bây giờ.</p>
                 <Link href="/exam">
                    <button className="bg-[#F4A616] text-[#1E1E1E] px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F4A616]/20">
                      THI THỬ NGAY →
                    </button>
                 </Link>
               </div>
               <LuTrophy className="absolute -right-6 -bottom-6 text-white/5 rotate-12" size={180} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
