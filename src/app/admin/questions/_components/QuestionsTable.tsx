"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { LuSearch, LuTriangleAlert, LuInbox, LuX } from "react-icons/lu";
import { Select, ListBox, Label } from "@heroui/react";
import DeleteQuestionButton from "../DeleteQuestionButton";
import type { Question } from "@/lib/types/database";

interface Props {
  questions: (Question & { license_types: { code: string } | null })[];
}

export default function QuestionsTable({ questions }: Props) {
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [criticalFilter, setCriticalFilter] = useState<"all" | "yes" | "no">(
    "all",
  );

  const topics = useMemo(
    () =>
      [
        ...new Set(questions.map((q) => q.topic).filter(Boolean) as string[]),
      ].sort(),
    [questions],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return questions.filter((item) => {
      if (
        q &&
        !item.content.toLowerCase().includes(q) &&
        !String(item.question_number ?? "").includes(q)
      )
        return false;
      if (topicFilter !== "all" && item.topic !== topicFilter) return false;
      if (criticalFilter === "yes" && !item.is_critical) return false;
      if (criticalFilter === "no" && item.is_critical) return false;
      return true;
    });
  }, [questions, search, topicFilter, criticalFilter]);

  const hasFilter = search || topicFilter !== "all" || criticalFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setTopicFilter("all");
    setCriticalFilter("all");
  };

  const triggerCls =
    "w-full rounded-xl border border-border bg-bg-card text-sm text-text-primary px-3 py-2 focus:outline-none focus:border-focus-blue";
  const popoverCls =
    "rounded-xl border border-border bg-bg-card shadow-lg overflow-hidden";

  return (
    <div className="flex flex-col gap-3">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-2 items-end">
        {/* Search */}
        <div className="relative flex-1">
          <LuSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm nội dung, số câu..."
            className="w-full text-sm pl-8 pr-3 py-2 rounded-xl border border-border bg-bg-card text-text-primary focus:outline-none focus:border-focus-blue"
          />
        </div>

        {/* Topic filter */}
        <div className="shrink-0 w-full sm:w-48">
          <Select
            value={topicFilter}
            onChange={(key) => setTopicFilter(key as string)}
            placeholder="Tất cả chủ đề"
            aria-label="Filter chủ đề"
          >
            <Select.Trigger className={triggerCls}>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className={popoverCls}>
              <ListBox>
                <ListBox.Item id="all" textValue="Tất cả chủ đề">
                  Tất cả chủ đề
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                {topics.map((t) => (
                  <ListBox.Item key={t} id={t} textValue={t}>
                    {t}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Critical filter */}
        <div className="shrink-0 w-full sm:w-40">
          <Select
            value={criticalFilter}
            onChange={(key) => setCriticalFilter(key as "all" | "yes" | "no")}
            placeholder="Tất cả loại"
            aria-label="Filter loại"
          >
            <Select.Trigger className={triggerCls}>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className={popoverCls}>
              <ListBox>
                <ListBox.Item id="all" textValue="Tất cả loại">
                  Tất cả loại
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="yes" textValue="Điểm liệt">
                  Điểm liệt
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="no" textValue="Thường">
                  Thường
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Clear */}
        {hasFilter && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs text-text-secondary hover:bg-bg-subtle transition-colors shrink-0"
          >
            <LuX size={12} /> Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-text-tertiary">
        Hiển thị{" "}
        <span className="font-medium text-text-secondary">
          {filtered.length}
        </span>{" "}
        / {questions.length} câu hỏi
      </p>

      {/* Table */}
      <div className="bg-bg-card rounded-2xl border border-border overflow-hidden shadow-whisper">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem] whitespace-nowrap">
                  Số
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem]">
                  Nội dung
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem] whitespace-nowrap">
                  Hạng
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem] whitespace-nowrap">
                  Chủ đề
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem] whitespace-nowrap">
                  Điểm liệt
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-bg-subtle transition-colors">
                  <td className="px-4 py-3 font-mono text-text-tertiary whitespace-nowrap text-xs">
                    #{q.question_number ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-text-primary max-w-xs">
                    <span className="line-clamp-2">{q.content}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-warm-sand border border-border-strong text-brand text-xs font-medium">
                      {(q.license_types as { code: string } | null)?.code ??
                        "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap text-xs">
                    {q.topic ?? "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {q.is_critical ? (
                      <span className="flex items-center gap-1 text-crimson font-medium text-xs">
                        <LuTriangleAlert size={13} /> Có
                      </span>
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
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-text-tertiary"
                  >
                    <LuInbox size={32} className="mx-auto mb-2 opacity-40" />
                    {hasFilter
                      ? "Không có câu hỏi nào khớp với bộ lọc."
                      : "Chưa có câu hỏi nào."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
