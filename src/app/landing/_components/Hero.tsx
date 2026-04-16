import Link from "next/link";
import { DisplayHeading, BodyLg } from "@/components/ui/Typography";

export function Hero() {
  return (
    <section className="bg-bg-page py-20 md:py-32 text-center">
      <div className="max-w-4xl mx-auto px-6">
        {/* Overline */}
        <p className="text-[0.63rem] font-medium tracking-[0.5px] uppercase text-text-tertiary mb-6">
          Ôn thi lý thuyết lái xe Việt Nam
        </p>

        <DisplayHeading className="text-[2rem] sm:text-[3rem] md:text-[4rem] mb-6">
          Đi đúng điệu, <span className="text-brand">Hiểu đúng luật.</span>
        </DisplayHeading>

        <BodyLg className="max-w-xl mx-auto mb-10">
          Ôn luyện lý thuyết lái xe{" "}
          <strong className="text-text-primary font-medium">A1</strong> miễn phí
          — flashcard, thi thử và trò chơi tương tác.
        </BodyLg>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/flashcards"
            className="inline-flex items-center justify-center bg-brand text-ivory rounded-xl px-8 py-3 font-medium text-sm shadow-ring-brand hover:bg-brand-hover transition-colors"
          >
            Học ngay
          </Link>
          <Link
            href="/exam"
            className="inline-flex items-center justify-center rounded-xl px-8 py-3 font-medium text-sm border border-border-strong text-text-primary hover:bg-bg-subtle transition-colors"
          >
            Thi thử ngay
          </Link>
        </div>
      </div>
    </section>
  );
}
