import { createClient } from "@/lib/supabase/server";
import { LuCircleHelp, LuPlus } from "react-icons/lu";
import Link from "next/link";
import QuestionsTable from "./_components/QuestionsTable";

export default async function AdminQuestionsPage() {
  const supabase = await createClient();

  const { data: questions } = await supabase
    .from("questions")
    .select("*, license_types(code)")
    .order("question_number", { ascending: true })
    .limit(500);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-sub-sm text-text-primary flex items-center gap-2">
            Quản lý câu hỏi
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {questions?.length ?? 0} câu hỏi
          </p>
        </div>
        <Link
          href="/admin/questions/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-ivory text-sm font-medium shadow-ring-brand transition-colors"
        >
          <LuPlus size={15} />
          Thêm câu hỏi
        </Link>
      </div>

      <QuestionsTable questions={questions ?? []} />
    </div>
  );
}
