import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  lowPerfMode: boolean;
  setLowPerfMode: (v: boolean) => void;
  lightsOff: boolean;
  setLightsOff: (v: boolean) => void;
  animationsOff: boolean;
  setAnimationsOff: (v: boolean) => void;
};

export default function LandingNav({
  lowPerfMode, setLowPerfMode,
  lightsOff, setLightsOff,
  animationsOff, setAnimationsOff
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4">
      <Link href="/landing" className="flex items-center gap-2.5">
        <Image src="/logo.webp" alt="Logo" width={32} height={32} className="rounded-xl" />
        <span className="font-serif font-medium text-[#1E1E1E] drop-shadow-sm">hocluatdema</span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 text-[#1E1E1E] shadow-sm backdrop-blur-sm transition hover:bg-white"
            title="Tùy chỉnh cấu hình"
          >
            ⚙️
          </button>

          {settingsOpen && (
            <div className="absolute right-0 top-12 mt-2 w-56 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                Tùy chỉnh hiển thị
              </h4>
              <div className="flex flex-col gap-3">
                <label className="flex cursor-pointer items-center justify-between text-sm font-medium text-gray-700">
                  <span>Cấu hình thấp</span>
                  <input
                    type="checkbox"
                    checked={lowPerfMode}
                    onChange={e => setLowPerfMode(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#F4A616] focus:ring-[#F4A616]"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between text-sm font-medium text-gray-700">
                  <span>Tắt ánh sáng 3D</span>
                  <input
                    type="checkbox"
                    checked={lightsOff}
                    onChange={e => setLightsOff(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#F4A616] focus:ring-[#F4A616]"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between text-sm font-medium text-gray-700">
                  <span>Tắt Animation</span>
                  <input
                    type="checkbox"
                    checked={animationsOff}
                    onChange={e => setAnimationsOff(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#F4A616] focus:ring-[#F4A616]"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        <Link
          href="/exam"
          className="rounded-xl bg-[#F4A616] px-5 py-2 text-sm font-semibold text-[#1E1E1E] shadow-sm transition hover:bg-[#e09510]"
        >
          Vào học →
        </Link>
      </div>
    </nav>
  )
}
