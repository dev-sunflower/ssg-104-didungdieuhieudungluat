'use client'
import Image from 'next/image'
import { SIGN_DATA } from '../_data/signData'

type Props = {
  signId: number | null
  onClose: () => void
}

export default function SignInfoPanel({ signId, onClose }: Props) {
  const info = signId != null ? SIGN_DATA.find((s) => s.id === signId) : null

  return (
    <div
      className={[
        'fixed right-0 top-1/2 z-30 w-72 -translate-y-1/2 rounded-l-3xl border-2 border-r-0 border-[#F4A616]/40 bg-white/90 p-6 shadow-2xl backdrop-blur-md',
        'transition-transform duration-500 ease-out',
        info ? 'translate-x-0' : 'translate-x-full',
      ].join(' ')}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-xl font-bold text-[#1E1E1E]/40 transition-colors hover:text-[#1E1E1E]"
        aria-label="Đóng"
      >
        ×
      </button>
      {info && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl border-2 border-dashed border-[#F4A616]/60 bg-[#FFF4D6] p-3">
            <Image
              src={`/signs/${info.id}.png`}
              alt={info.name}
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <div className="text-center">
            <p
              className="text-sm font-semibold uppercase tracking-widest text-[#F4A616]"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Biển báo
            </p>
            <h3
              className="mt-1 text-xl font-bold text-[#1E1E1E]"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              {info.name}
            </h3>
            <p
              className="mt-2 text-base leading-relaxed text-[#1E1E1E]/70"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              {info.rule}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
