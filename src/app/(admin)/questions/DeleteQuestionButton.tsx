'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteQuestionButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('Xác nhận xóa câu hỏi này?')) return
    setLoading(true)
    await supabase.from('questions').delete().eq('id', id)
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1 rounded-lg bg-crimson/10 text-crimson border border-crimson/20 text-xs font-medium hover:bg-crimson/20 transition-colors disabled:opacity-40"
    >
      {loading ? '...' : 'Xóa'}
    </button>
  )
}
