'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LuCircleCheck, LuCircleX } from 'react-icons/lu'

export function ProfileForm({ initialName }: { initialName: string | null }) {
  const [name, setName] = useState(initialName ?? '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (!user) throw new Error('Không tìm thấy phiên đăng nhập')

      const { error } = await supabase.from('profiles').update({ display_name: name }).eq('id', user.id)
      if (error) throw error

      setMessage('ok')
      router.refresh()
    } catch (err: any) {
      setMessage('err:' + (err.message || 'Lỗi không xác định'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary">Tên hiển thị</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên hiển thị mới..."
          className="w-full rounded-2xl border border-[#1E1E1E]/14 bg-white px-4 py-2.5 text-text-primary shadow-sm transition-colors focus:border-[#F4A616] focus:outline-none focus:ring-0"
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <p className="text-sm">
          {message === 'ok' ? (
            <span className="flex items-center gap-1.5 font-medium text-[#22B8A8]">
              <LuCircleCheck size={14} /> Đã cập nhật thành công
            </span>
          ) : message.startsWith('err:') ? (
            <span className="flex items-center gap-1.5 font-medium text-status-error">
              <LuCircleX size={14} /> Cập nhật thất bại: {message.slice(4)}
            </span>
          ) : null}
        </p>
        <button
          type="submit"
          disabled={loading || name === initialName}
          className="shrink-0 rounded-2xl bg-[#F4A616] px-6 py-2.5 text-sm font-semibold text-[#1E1E1E] transition-colors hover:bg-[#e59b11] disabled:opacity-50"
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  )
}
