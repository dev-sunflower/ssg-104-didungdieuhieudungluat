'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { LicenseType, QuestionOption } from '@/lib/types/database'
import { LuArrowLeft, LuPlus, LuPencil, LuTriangleAlert, LuSave } from 'react-icons/lu'

const TOPICS = ['Biển báo', 'Tốc độ', 'Quyền ưu tiên', 'Sa hình', 'Văn hóa giao thông', 'Kỹ thuật lái xe', 'Pháp luật', 'Khác']
const OPTION_KEYS = ['A', 'B', 'C', 'D']

export default function QuestionFormPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  const supabase = createClient()

  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    license_type_id: '',
    question_number: '',
    content: '',
    image_url: '',
    options: OPTION_KEYS.map(key => ({ key, text: '' })) as QuestionOption[],
    correct_answer: 'A',
    explanation: '',
    is_critical: false,
    topic: '',
  })

  useEffect(() => {
    supabase.from('license_types').select('*').order('code').then(({ data }) => {
      if (data) setLicenseTypes(data)
    })
  }, [supabase])

  useEffect(() => {
    if (isNew) return
    setLoading(true)
    supabase.from('questions').select('*').eq('id', params.id as string).single().then(({ data }) => {
      if (data) {
        setForm({
          license_type_id: data.license_type_id ?? '',
          question_number: data.question_number?.toString() ?? '',
          content: data.content,
          image_url: data.image_url ?? '',
          options: data.options,
          correct_answer: data.correct_answer,
          explanation: data.explanation ?? '',
          is_critical: data.is_critical,
          topic: data.topic ?? '',
        })
      }
      setLoading(false)
    })
  }, [supabase, isNew, params.id])

  const updateOption = (index: number, text: string) => {
    setForm(f => ({
      ...f,
      options: f.options.map((opt, i) => i === index ? { ...opt, text } : opt),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      license_type_id: form.license_type_id || null,
      question_number: form.question_number ? parseInt(form.question_number) : null,
      content: form.content,
      image_url: form.image_url || null,
      options: form.options.filter(o => o.text.trim()),
      correct_answer: form.correct_answer,
      explanation: form.explanation || null,
      is_critical: form.is_critical,
      topic: form.topic || null,
    }

    if (isNew) {
      await supabase.from('questions').insert(payload)
    } else {
      await supabase.from('questions').update(payload).eq('id', params.id as string)
    }

    setSaving(false)
    router.push('/admin/questions')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <LuArrowLeft size={15} />
          Quay lại
        </button>
        <h1 className="heading-sub-lg text-text-primary flex items-center gap-2">
          {isNew
            ? <><LuPlus size={22} className="text-text-secondary" /> Thêm câu hỏi mới</>
            : <><LuPencil size={20} className="text-text-secondary" /> Chỉnh sửa câu hỏi</>
          }
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-bg-card rounded-2xl border border-border shadow-whisper p-6 flex flex-col gap-5">

        {/* Row: License type + Number + Topic */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-primary">Hạng bằng *</label>
            <select
              required
              value={form.license_type_id}
              onChange={e => setForm(f => ({ ...f, license_type_id: e.target.value }))}
              className="text-sm px-3 py-2 rounded-xl border border-border bg-bg-card text-text-primary focus:outline-none focus:border-focus-blue"
            >
              <option value="">-- Chọn --</option>
              {licenseTypes.map(lt => (
                <option key={lt.id} value={lt.id}>{lt.code} — {lt.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-primary">Số câu</label>
            <input
              type="number"
              min={1}
              value={form.question_number}
              onChange={e => setForm(f => ({ ...f, question_number: e.target.value }))}
              placeholder="Ví dụ: 1"
              className="text-sm px-3 py-2 rounded-xl border border-border bg-bg-card text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-focus-blue"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-primary">Chủ đề</label>
            <select
              value={form.topic}
              onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
              className="text-sm px-3 py-2 rounded-xl border border-border bg-bg-card text-text-primary focus:outline-none focus:border-focus-blue"
            >
              <option value="">-- Chọn chủ đề --</option>
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Question content */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-primary">Nội dung câu hỏi *</label>
          <textarea
            required
            rows={3}
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="Nhập nội dung câu hỏi..."
            className="text-sm px-3 py-2 rounded-xl border border-border bg-bg-card text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-focus-blue resize-none"
          />
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-primary">URL hình ảnh (tùy chọn)</label>
          <input
            type="url"
            value={form.image_url}
            onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
            placeholder="https://..."
            className="text-sm px-3 py-2 rounded-xl border border-border bg-bg-card text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-focus-blue"
          />
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium text-text-primary">Các đáp án *</label>
          {form.options.map((opt, i) => (
            <div key={opt.key} className="flex items-center gap-2">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-bg-subtle border border-border flex items-center justify-center font-medium text-sm text-text-secondary">
                {opt.key}
              </span>
              <input
                type="text"
                value={opt.text}
                onChange={e => updateOption(i, e.target.value)}
                placeholder={`Đáp án ${opt.key}...`}
                className="flex-1 text-sm px-3 py-2 rounded-xl border border-border bg-bg-card text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-focus-blue"
              />
              <input
                type="radio"
                name="correct_answer"
                value={opt.key}
                checked={form.correct_answer === opt.key}
                onChange={() => setForm(f => ({ ...f, correct_answer: opt.key }))}
                className="w-4 h-4 accent-brand cursor-pointer"
                title={`Đáp án đúng: ${opt.key}`}
              />
            </div>
          ))}
          <p className="text-xs text-text-tertiary">• Chọn nút tròn bên phải để đánh dấu đáp án đúng</p>
        </div>

        {/* Explanation */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-primary">Giải thích (tùy chọn)</label>
          <textarea
            rows={2}
            value={form.explanation}
            onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
            placeholder="Giải thích tại sao đáp án này đúng..."
            className="text-sm px-3 py-2 rounded-xl border border-border bg-bg-card text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-focus-blue resize-none"
          />
        </div>

        {/* Critical flag */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_critical}
            onChange={e => setForm(f => ({ ...f, is_critical: e.target.checked }))}
            className="w-4 h-4 rounded accent-crimson border-border cursor-pointer"
          />
          <div>
            <span className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
              <LuTriangleAlert size={14} className="text-crimson" />
              Câu điểm liệt
            </span>
            <p className="text-xs text-text-tertiary">Trả lời sai câu này sẽ tự động trượt</p>
          </div>
        </label>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-ivory font-medium text-sm transition-colors disabled:opacity-60 shadow-ring-brand"
          >
            {saving ? (
              'Đang lưu...'
            ) : isNew ? (
              <><LuPlus size={15} /> Thêm câu hỏi</>
            ) : (
              <><LuSave size={15} /> Lưu thay đổi</>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}
