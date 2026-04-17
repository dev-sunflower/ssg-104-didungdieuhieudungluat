'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LuPencil, LuTrash2, LuX } from 'react-icons/lu'
import LicenseTypeForm from './LicenseTypeForm'
import type { LicenseType } from '@/lib/types/database'

export default function LicenseTypeRow({ licenseType: lt }: { licenseType: LicenseType }) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async () => {
    setDeleting(true)
    await supabase.from('license_types').delete().eq('id', lt.id)
    setDeleting(false)
    router.refresh()
  }

  if (editing) {
    return (
      <tr className="bg-bg-subtle">
        <td colSpan={6} className="px-4 py-4">
          <LicenseTypeForm
            initial={lt}
            onDone={() => setEditing(false)}
          />
        </td>
      </tr>
    )
  }

  return (
    <tr className="hover:bg-bg-subtle transition-colors">
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="px-2 py-0.5 rounded-full bg-warm-sand border border-border-strong text-brand text-xs font-medium">
          {lt.code}
        </span>
      </td>
      <td className="px-4 py-3 text-text-primary font-medium">{lt.name}</td>
      <td className="px-4 py-3 text-text-secondary font-mono text-xs">{lt.total_questions}</td>
      <td className="px-4 py-3 text-text-secondary font-mono text-xs">{lt.pass_score}</td>
      <td className="px-4 py-3 text-text-tertiary text-xs max-w-[200px] truncate">
        {lt.description ?? '—'}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">Xóa?</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-2.5 py-1 rounded-lg bg-crimson text-ivory text-xs font-medium hover:bg-crimson/90 transition-colors disabled:opacity-50"
            >
              {deleting ? '...' : 'Xác nhận'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="p-1 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-bg-card transition-colors"
            >
              <LuX size={13} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border text-text-secondary text-xs font-medium hover:bg-bg-subtle hover:text-text-primary transition-colors"
            >
              <LuPencil size={11} /> Sửa
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-crimson/10 text-crimson border border-crimson/20 text-xs font-medium hover:bg-crimson/20 transition-colors"
            >
              <LuTrash2 size={11} /> Xóa
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}
