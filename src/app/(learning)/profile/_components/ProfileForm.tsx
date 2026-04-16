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

      const { error } = await supabase
        .from('profiles')
        .update({ display_name: name })
        .eq('id', user.id)

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
        <label className="text-sm font-medium text-text-primary">
          Tên hiển thị
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên hiển thị mới..."
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-card text-text-primary focus:border-focus-blue focus:outline-none focus:ring-0 shadow-sm transition-colors"
        />
      </div>

      <div className="flex items-center justify-between gap-4 mt-2">
        <p className="text-sm">
          {message === 'ok' ? (
            <span className="flex items-center gap-1.5 text-brand font-medium">
              <LuCircleCheck size={14} /> Đã cập nhật thành công
            </span>
          ) : message.startsWith('err:') ? (
            <span className="flex items-center gap-1.5 text-status-error font-medium">
              <LuCircleX size={14} /> Cập nhật thất bại: {message.slice(4)}
            </span>
          ) : null}
        </p>
        <button
          type="submit"
          disabled={loading || name === initialName}
          className="shrink-0 px-6 py-2.5 rounded-xl bg-brand text-ivory text-sm font-medium shadow-ring-brand hover:bg-brand-hover disabled:opacity-50 transition-colors"
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  )
}
