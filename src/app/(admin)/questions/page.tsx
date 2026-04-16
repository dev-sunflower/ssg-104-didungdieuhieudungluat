import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteQuestionButton from './DeleteQuestionButton'

export default async function AdminQuestionsPage() {
  const supabase = await createClient()

  const { data: questions } = await supabase
    .from('questions')
    .select('*, license_types(code)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-sub-lg text-text-primary">❓ Quản lý câu hỏi</h1>
          <p className="text-text-secondary text-sm mt-1">
            {questions?.length ?? 0} câu hỏi
          </p>
        </div>
        <Link
          href="/admin/questions/new"
          className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-ivory text-sm font-medium shadow-ring-brand transition-colors flex items-center gap-2"
        >
          ➕ Thêm câu hỏi
        </Link>
      </div>

      {/* Table */}
      <div className="bg-bg-card rounded-2xl border border-border overflow-hidden shadow-whisper">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem] whitespace-nowrap">Số</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem]">Nội dung</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem] whitespace-nowrap">Hạng</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem] whitespace-nowrap">Chủ đề</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem] whitespace-nowrap">Điểm liệt</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {questions?.map((q) => (
                <tr key={q.id} className="hover:bg-bg-subtle transition-colors">
                  <td className="px-4 py-3 font-mono text-text-tertiary whitespace-nowrap">
                    #{q.question_number ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-text-primary max-w-xs">
                    <span className="line-clamp-2">{q.content}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-warm-sand border border-border-strong text-brand text-xs font-medium">
                      {(q.license_types as { code: string } | null)?.code ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap text-xs">
                    {q.topic ?? '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {q.is_critical ? (
                      <span className="text-crimson font-medium text-xs">⚠️ Có</span>
                    ) : (
                      <span className="text-text-tertiary text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/questions/${q.id}`}
                        className="px-3 py-1 rounded-lg border border-border text-text-secondary text-xs font-medium hover:bg-bg-subtle hover:text-text-primary transition-colors"
                      >
                        Sửa
                      </Link>
                      <DeleteQuestionButton id={q.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!questions || questions.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-text-tertiary">
                    <div className="text-3xl mb-2">📭</div>
                    Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
