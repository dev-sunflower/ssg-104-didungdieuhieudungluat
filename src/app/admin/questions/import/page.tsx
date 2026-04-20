'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase/client'
import type { LicenseType } from '@/lib/types/database'
import { LuArrowLeft, LuFileSpreadsheet, LuFolder, LuUpload, LuX, LuCheck, LuTriangleAlert } from 'react-icons/lu'

type ParsedRow = {
  index: number        // 1-based row number in xlsx
  question: string
  answers: string[]    // [A, B, C, D]
  correct: string      // 'A' | 'B' | 'C' | 'D'
  imageFile: File | null
}

type ImportStatus = 'idle' | 'importing' | 'done' | 'error'

const ANSWER_LETTER_TO_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 }

export default function ImportQuestionsPage() {
  const router = useRouter()
  const supabase = createClient()

  const xlsxRef = useRef<HTMLInputElement>(null)
  const folderRef = useRef<HTMLInputElement>(null)

  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([])
  const [licenseTypeId, setLicenseTypeId] = useState('')
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [imageMap, setImageMap] = useState<Map<number, File>>(new Map())
  const [xlsxName, setXlsxName] = useState('')
  const [folderName, setFolderName] = useState('')
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    supabase.from('license_types').select('*').order('code').then(({ data }) => {
      if (data) setLicenseTypes(data)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Merge image map into rows whenever either changes
  useEffect(() => {
    setRows((prev) =>
      prev.map((r) => ({ ...r, imageFile: imageMap.get(r.index) ?? null }))
    )
  }, [imageMap])

  function parseXlsx(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer)
      const wb = XLSX.read(data, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      // raw: true → keep strings as-is; header: 1 → array-of-arrays
      const raw: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

      // Skip header row if first cell looks like a label
      const firstCell = String(raw[0]?.[0] ?? '').toLowerCase()
      const startIdx = firstCell.includes('question') || firstCell.includes('câu') ? 1 : 0

      const parsed: ParsedRow[] = []
      for (let i = startIdx; i < raw.length; i++) {
        const row = raw[i]
        const question = String(row[0] ?? '').trim()
        if (!question) continue
        const answers = [
          String(row[1] ?? '').trim(),
          String(row[2] ?? '').trim(),
          String(row[3] ?? '').trim(),
          String(row[4] ?? '').trim(),
        ]
        const correct = String(row[5] ?? '').trim().toUpperCase()
        const rowIndex = i + 1 // actual xlsx row number (1-based, includes header offset)
        parsed.push({ index: rowIndex, question, answers, correct, imageFile: imageMap.get(rowIndex) ?? null })
      }
      setRows(parsed)
      setXlsxName(file.name)
    }
    reader.readAsArrayBuffer(file)
  }

  function handleXlsxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    parseXlsx(file)
  }

  function handleFolderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    // Infer folder name from first file's webkitRelativePath
    const folder = files[0].webkitRelativePath.split('/')[0]
    setFolderName(folder)

    // Build map: index -> File, by matching filename "stt-anh-<n>" (case-insensitive)
    const map = new Map<number, File>()
    for (const f of files) {
      const name = f.name.replace(/\.[^/.]+$/, '') // strip extension
      const match = name.match(/-anh-(\d+)/i)
      if (match) {
        map.set(parseInt(match[1], 10), f)
      }
    }
    setImageMap(map)
  }

  async function handleImport() {
    if (!rows.length) return
    if (!licenseTypeId) { setErrorMsg('Vui lòng chọn hạng bằng trước khi import.'); return }
    setErrorMsg('')
    setImportStatus('importing')
    setProgress(0)

    let failed = 0
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      let imageUrl: string | null = null

      if (row.imageFile) {
        const ext = row.imageFile.name.split('.').pop() ?? 'jpg'
        const path = `questions/import-${Date.now()}-${row.index}.${ext}`
        const { error } = await supabase.storage
          .from('question-images')
          .upload(path, row.imageFile, { upsert: false })
        if (!error) {
          const { data: urlData } = supabase.storage.from('question-images').getPublicUrl(path)
          imageUrl = urlData.publicUrl
        }
      }

      const correctIdx = ANSWER_LETTER_TO_INDEX[row.correct] ?? 0
      const options = ['A', 'B', 'C', 'D'].map((key, idx) => ({ key, text: row.answers[idx] ?? '' })).filter((o) => o.text)

      const { error } = await supabase.from('questions').insert({
        license_type_id: licenseTypeId,
        content: row.question,
        image_url: imageUrl,
        options,
        correct_answer: row.correct,
        explanation: null,
        is_critical: false,
        topic: null,
      })
      if (error) failed++

      setProgress(Math.round(((i + 1) / rows.length) * 100))
    }

    setImportStatus(failed === 0 ? 'done' : 'error')
    if (failed > 0) setErrorMsg(`${failed} câu hỏi bị lỗi khi import.`)
  }

  const canImport = rows.length > 0 && licenseTypeId && importStatus === 'idle'

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <LuArrowLeft size={15} />
          Quay lại
        </button>
        <h1 className="heading-sub-sm text-text-primary">Import câu hỏi từ Excel</h1>
      </div>

      {/* Format guide */}
      <div className="rounded-2xl border border-border bg-bg-subtle p-4 text-xs text-text-secondary flex flex-col gap-1">
        <p className="font-semibold text-text-primary mb-1">Định dạng file Excel</p>
        <p>• Cột A: Câu hỏi &nbsp;|&nbsp; B: Đáp án A &nbsp;|&nbsp; C: Đáp án B &nbsp;|&nbsp; D: Đáp án C &nbsp;|&nbsp; E: Đáp án D &nbsp;|&nbsp; F: Đáp án đúng (A/B/C/D)</p>
        <p>• Dòng đầu có thể là tiêu đề — hệ thống tự bỏ qua nếu phát hiện.</p>
        <p className="font-semibold text-text-primary mt-2 mb-1">Định dạng thư mục ảnh</p>
        <p>• Tên file ảnh: <code className="bg-bg-card px-1 rounded">stt-anh-1.png</code>, <code className="bg-bg-card px-1 rounded">stt-anh-2.jpg</code>, ... (khớp với số thứ tự dòng trong Excel)</p>
      </div>

      <div className="bg-bg-card rounded-2xl border border-border shadow-whisper p-6 flex flex-col gap-5">
        {/* Step 1: xlsx */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-primary">1. Chọn file Excel (.xlsx)</label>
          <input ref={xlsxRef} type="file" accept=".xlsx,.xls" onChange={handleXlsxChange} className="hidden" />
          <button
            type="button"
            onClick={() => xlsxRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border bg-bg-subtle text-sm text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
          >
            <LuFileSpreadsheet size={15} />
            {xlsxName || 'Chọn file .xlsx'}
            {xlsxName && <LuCheck size={13} className="ml-auto text-green-500" />}
          </button>
          {rows.length > 0 && (
            <p className="text-xs text-text-tertiary">Đã đọc được <span className="font-semibold text-text-primary">{rows.length}</span> câu hỏi</p>
          )}
        </div>

        {/* Step 2: image folder */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-primary">2. Chọn thư mục ảnh (tùy chọn)</label>
          <input
            ref={folderRef}
            type="file"
            // @ts-expect-error webkitdirectory is non-standard but widely supported
            webkitdirectory=""
            multiple
            accept="image/*"
            onChange={handleFolderChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => folderRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border bg-bg-subtle text-sm text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
          >
            <LuFolder size={15} />
            {folderName || 'Chọn thư mục ảnh'}
            {imageMap.size > 0 && <span className="ml-auto text-xs text-green-500">{imageMap.size} ảnh</span>}
          </button>
        </div>

        {/* Step 3: license type */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-primary">3. Chọn hạng bằng *</label>
          <select
            value={licenseTypeId}
            onChange={(e) => setLicenseTypeId(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg-card text-sm text-text-primary px-3 py-2 focus:outline-none focus:border-focus-blue"
          >
            <option value="">-- Chọn hạng bằng --</option>
            {licenseTypes.map((lt) => (
              <option key={lt.id} value={lt.id}>{lt.code} — {lt.name}</option>
            ))}
          </select>
        </div>

        {/* Preview table */}
        {rows.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-primary">Xem trước ({rows.length} câu)</label>
            <div className="overflow-auto rounded-xl border border-border max-h-72">
              <table className="w-full text-xs text-left">
                <thead className="bg-bg-subtle sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-text-secondary font-medium w-10">#</th>
                    <th className="px-3 py-2 text-text-secondary font-medium">Câu hỏi</th>
                    <th className="px-3 py-2 text-text-secondary font-medium w-16 text-center">Đúng</th>
                    <th className="px-3 py-2 text-text-secondary font-medium w-14 text-center">Ảnh</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.index} className="border-t border-border hover:bg-bg-subtle">
                      <td className="px-3 py-2 text-text-tertiary">{r.index}</td>
                      <td className="px-3 py-2 text-text-primary max-w-xs truncate">{r.question}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-brand/10 text-brand font-bold text-[11px]">
                          {r.correct}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        {r.imageFile
                          ? <LuCheck size={13} className="mx-auto text-green-500" />
                          : <LuX size={13} className="mx-auto text-text-tertiary" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <LuTriangleAlert size={14} />
            {errorMsg}
          </div>
        )}

        {/* Progress */}
        {importStatus === 'importing' && (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Đang import...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-bg-subtle overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {importStatus === 'done' && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            <LuCheck size={14} />
            Import thành công {rows.length} câu hỏi!
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-border">
          <button
            type="button"
            disabled={!canImport}
            onClick={handleImport}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-ivory font-medium text-sm transition-colors disabled:opacity-50 shadow-ring-brand"
          >
            <LuUpload size={15} />
            {importStatus === 'importing' ? 'Đang import...' : `Import ${rows.length > 0 ? rows.length + ' câu' : ''}`}
          </button>
          {importStatus === 'done' && (
            <button
              type="button"
              onClick={() => router.push('/admin/questions')}
              className="px-6 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-bg-subtle transition-colors"
            >
              Xem danh sách
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
