'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LuTrash2, LuX } from 'react-icons/lu'

export default function DeleteQuestionButton({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    await supabase.from('questions').delete().eq('id', id)
    setLoading(false)
    router.refresh()
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-text-secondary">Xóa?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2.5 py-1 rounded-lg bg-crimson text-ivory text-xs font-medium hover:bg-crimson/90 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Xác nhận'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="p-1 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-bg-subtle transition-colors"
        >
          <LuX size={12} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-crimson/10 text-crimson border border-crimson/20 text-xs font-medium hover:bg-crimson/20 transition-colors"
    >
      <LuTrash2 size={11} /> Xóa
    </button>
  )
}
