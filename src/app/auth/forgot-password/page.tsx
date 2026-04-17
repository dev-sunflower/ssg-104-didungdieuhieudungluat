import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-sm px-4">
      <div className="rounded-3xl border border-[#1E1E1E]/10 bg-white/88 p-9 text-center shadow-[0_18px_40px_rgba(30,30,30,0.12)] backdrop-blur-sm">
        <h1 className="text-2xl font-extrabold text-[#1E1E1E]">Quên mật khẩu?</h1>
        <p className="mt-2 text-sm text-[#1E1E1E]/70">
          Hệ thống dùng đăng nhập bằng magic link. Bạn chỉ cần quay lại trang đăng nhập để nhận link mới.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex rounded-2xl bg-[#F4A616] px-6 py-2.5 text-sm font-semibold text-[#1E1E1E] transition-colors hover:bg-[#e59b11]"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  )
}
