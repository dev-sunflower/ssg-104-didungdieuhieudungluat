import type { Metadata } from "next";
import {
  Inter,
  Lora,
  Geist_Mono,
  Baloo_2,
  Finger_Paint,
} from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FaFacebook } from "react-icons/fa6";
import { SiTiktok } from "react-icons/si";
import { socialLinks } from "@/lib/socialLinks";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo2 = Baloo_2({
  variable: "--font-caveat",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const fingerPaint = Finger_Paint({
  variable: "--font-finger-paint",
  weight: "400",
});

const goodDog = localFont({
  src: "../fonts/SVN-Good Dog.ttf",
  variable: "--font-good-dog",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Học Luật Dễ Mà",
  description:
    "Nền tảng ôn luyện lý thuyết lái xe trực tuyến: câu hỏi thi sát hạch hạng A1 và Flashcard, đề thi thử và trò chơi tương tác.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${lora.variable} ${geistMono.variable} ${baloo2.variable} ${fingerPaint.variable} ${goodDog.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
        {/* Social Floating Icons (Bottom Left) - Desktop only */}
        <div className="hidden md:flex fixed bottom-6 left-6 z-[9999] flex-col gap-3">
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-xl transition-all hover:scale-110 hover:shadow-[#1877F2]/40 active:scale-95"
            title="Facebook"
          >
            <FaFacebook size={26} className="transition-transform group-hover:rotate-6" />
          </a>
          <a
            href={socialLinks.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-xl transition-all hover:scale-110 hover:shadow-black/40 active:scale-95"
            title="TikTok"
          >
            <SiTiktok size={22} className="transition-transform group-hover:-rotate-6" />
          </a>
        </div>
        {/* Global copyright badge - Desktop only */}
        <div className="hidden md:block fixed bottom-3 right-3 z-[9999] select-none">
          <div className="flex items-center gap-2 rounded-lg bg-black/20 px-2.5 py-1 text-[10px] font-medium text-white/60 backdrop-blur-sm transition-all hover:bg-black/30">
            <div className="flex items-center gap-2 border-r border-white/10 pr-2">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                title="Facebook"
              >
                <FaFacebook size={12} />
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                title="TikTok"
              >
                <SiTiktok size={11} />
              </a>
            </div>
            <p>
              signs: designed by{" "}
              <span className="text-white/80">Nydmeu</span>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
