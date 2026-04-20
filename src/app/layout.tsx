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
      </body>
    </html>
  );
}
