"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input } from "@heroui/react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div className="w-full max-w-sm px-4">
      <div className="overflow-hidden rounded-3xl border border-[#1E1E1E]/10 bg-white/88 shadow-[0_18px_40px_rgba(30,30,30,0.12)] backdrop-blur-sm">
        {/* Top accent bar */}
        <div className="h-1.5 bg-[#F4A616]" />

        <div className="p-9">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4A616]">
              <span
                className="text-xl font-medium text-[#1E1E1E]"
                style={{ fontFamily: "var(--font-caveat)" }}
              >
                S
              </span>
            </div>
            <h1
              className="text-3xl font-extrabold text-[#1E1E1E]"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              SSG104
            </h1>
            <p className="mt-1 text-[0.88rem] text-[#1E1E1E]/70">
              Đăng nhập để theo dõi tiến độ học tập
            </p>
          </div>

          {sent ? (
            <div className="rounded-2xl bg-[linear-gradient(145deg,#FFF4D6,#FFE8A8)] py-6 px-4 text-center">
              <div className="mb-3 text-5xl">📬</div>
              <h2
                className="mb-2 text-xl font-bold text-[#1E1E1E]"
                style={{ fontFamily: "var(--font-caveat)" }}
              >
                Kiểm tra email!
              </h2>
              <p className="text-[0.88rem] leading-relaxed text-[#1E1E1E]/75">
                Link đăng nhập đã gửi đến{" "}
                <strong className="font-medium text-[#1E1E1E]">{email}</strong>
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="mt-4 text-sm font-medium text-[#F4A616] transition-colors hover:text-[#e59b11]"
              >
                Dùng email khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[0.88rem] font-medium text-text-primary">
                  Địa chỉ email
                </label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  fullWidth
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder="ban@example.com"
                  className="rounded-2xl border border-[#1E1E1E]/14 bg-white text-text-primary placeholder:text-text-tertiary focus:border-[#F4A616] focus:outline-none"
                />
              </div>
              {error && (
                <div className="rounded-xl border border-crimson/20 bg-crimson/10 px-3 py-2.5 text-sm text-crimson">
                  ⚠️ {error}
                </div>
              )}
              <Button
                type="submit"
                fullWidth
                isDisabled={loading}
                className="rounded-2xl bg-[#F4A616] py-3 font-semibold text-[#1E1E1E] hover:bg-[#e59b11]"
              >
                {loading ? "Đang gửi..." : "Gửi link đăng nhập"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-[0.75rem] text-text-tertiary">
            Chưa có tài khoản?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-[#F4A616] transition-colors hover:text-[#e59b11]"
            >
              Đăng ký miễn phí
            </Link>
          </p>
          <div className="mt-4 border-t border-[#1E1E1E]/10 pt-4 text-center">
            <Link
              href="/landing"
              className="text-sm text-text-tertiary transition-colors hover:text-text-secondary"
            >
              Tiếp tục không cần đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
