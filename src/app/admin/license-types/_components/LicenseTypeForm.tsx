'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LuPlus, LuLoader } from 'react-icons/lu'

interface Props {
  initial?: {
    id: string
    code: string
    name: string
    description: string | null
    total_questions: number
    pass_score: number
  }
  onDone?: () => void
}

export default function LicenseTypeForm({ initial, onDone }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const isEdit = !!initial

  const [form, setForm] = useState({
    code: initial?.code ?? '',
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    total_questions: initial?.total_questions?.toString() ?? '',
    pass_score: initial?.pass_score?.toString() ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      code: form.code.toUpperCase().trim(),
      name: form.name.trim(),
      description: form.description.trim() || null,
      total_questions: parseInt(form.total_questions),
      pass_score: parseInt(form.pass_score),
    }

    const { error: err } = isEdit
      ? await supabase.from('license_types').update(payload).eq('id', initial!.id)
      : await supabase.from('license_types').insert(payload)

    setSaving(false)
    if (err) { setError(err.message); return }

    if (!isEdit) setForm({ code: '', name: '', description: '', total_questions: '', pass_score: '' })
    onDone?.()
    router.refresh()
  }

  const inputCls = 'text-sm px-3 py-2 rounded-xl border border-border bg-bg-card text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-focus-blue w-full'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-secondary">Mã *</label>
          <input required value={form.code} onChange={e => set('code', e.target.value)}
            placeholder="A1" maxLength={4}
            className={inputCls} />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-medium text-text-secondary">Tên *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Xe máy dưới 175cc"
            className={inputCls} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-secondary">Tổng câu *</label>
          <input required type="number" min={1} value={form.total_questions}
            onChange={e => set('total_questions', e.target.value)}
            placeholder="35"
            className={inputCls} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-secondary">Điểm đạt *</label>
          <input required type="number" min={1} value={form.pass_score}
            onChange={e => set('pass_score', e.target.value)}
            placeholder="29"
            className={inputCls} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-text-secondary">Mô tả</label>
        <input value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Mô tả ngắn về hạng bằng..."
          className={inputCls} />
      </div>

      {error && <p className="text-xs text-crimson">{error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-ivory text-sm font-medium shadow-ring-brand transition-colors disabled:opacity-60"
        >
          {saving
            ? <LuLoader size={14} className="animate-spin" />
            : <LuPlus size={14} />
          }
          {isEdit ? 'Lưu thay đổi' : 'Thêm hạng bằng'}
        </button>
        {isEdit && onDone && (
          <button type="button" onClick={onDone}
            className="px-5 py-2 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-bg-subtle transition-colors"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  )
}
