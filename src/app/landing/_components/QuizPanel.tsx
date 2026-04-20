"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { QUIZ_DATA } from "../_data/quizData";

type Props = {
  visible: boolean;
  opacity: number;
  quizSignId: number;
};

export default function QuizPanel({ visible, opacity, quizSignId }: Props) {
  const quiz = QUIZ_DATA.find((q) => q.signId === quizSignId) ?? QUIZ_DATA[0];
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [quizSignId]);

  if (!visible && opacity < 0.01 && selected === null) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-4"
      style={{ opacity, transition: "opacity 0.4s ease" }}
    >
      <div className="pointer-events-auto w-full max-w-md rounded-3xl border-2 border-[#F4A616]/30 bg-white/90 p-6 shadow-2xl backdrop-blur-md">
        <span
          className="inline-flex rounded-full bg-[#FFF4D6] px-3 py-1 text-sm font-bold text-[#F4A616]"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          🚦 Thử thách biển báo
        </span>
        <p
          className="mt-3 text-xl font-bold text-[#1E1E1E]"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          {quiz.question}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2">
          {quiz.answers.map((ans, i) => {
            const isCorrect = i === quiz.correct;
            const isSelected = selected === i;
            let cls =
              "bg-[#FFF4D6] hover:bg-[#FFE29A] border-[#F4A616]/30 text-[#1E1E1E]";
            if (isSelected && isCorrect)
              cls = "bg-green-100 border-green-400 text-[#1E1E1E]";
            if (isSelected && !isCorrect)
              cls = "bg-red-100 border-red-400 text-[#1E1E1E]";
            if (selected !== null && isCorrect && !isSelected)
              cls = "bg-green-50 border-green-300 text-[#1E1E1E]";
            return (
              <button
                key={i}
                disabled={selected !== null}
                onClick={() => setSelected(i)}
                className={`w-full rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${cls}`}
              >
                {ans}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div className="mt-4 rounded-2xl bg-[#1E1E1E] p-4 text-sm text-white/90">
            {quiz.explanation}
          </div>
        )}
        <Link
          href="/flashcards"
          className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[#F4A616] py-3 text-sm font-bold text-[#1E1E1E] transition hover:scale-[1.02]"
        >
          Thử thêm
        </Link>
      </div>
    </div>
  );
}
