"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  Chip,
  Spinner,
  Label,
  ListBox,
  Select,
} from "@heroui/react";
import { LuShuffle, LuInbox } from "react-icons/lu";
import FlashCard from "@/components/ui/FlashCard";
import { createClient } from "@/lib/supabase/client";
import type { LicenseType, Question } from "@/lib/types/database";

export default function FlashcardsPage() {
  const supabase = createClient();

  const [a1Type, setA1Type] = useState<LicenseType | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch A1 license type + all topics once
  useEffect(() => {
    supabase
      .from("license_types")
      .select("*")
      .eq("code", "A1")
      .single()
      .then(({ data }) => {
        if (!data) return;
        setA1Type(data);
        // Fetch distinct topics from all A1 questions — independent of filter
        supabase
          .from("questions")
          .select("topic")
          .eq("license_type_id", data.id)
          .then(({ data: rows }) => {
            if (rows) {
              const unique = [
                ...new Set(rows.map((r) => r.topic).filter(Boolean)),
              ] as string[];
              setTopics(unique);
            }
          });
      });
  }, [supabase]);

  const fetchQuestions = useCallback(async () => {
    if (!a1Type) return;
    setLoading(true);

    let query = supabase
      .from("questions")
      .select("*, license_types(*)")
      .eq("license_type_id", a1Type.id)
      .order("question_number");

    if (selectedTopic !== "all") query = query.eq("topic", selectedTopic);

    const { data } = await query;
    if (data) {
      setQuestions(data);
      setCurrentIndex(0);
    }
    setLoading(false);
  }, [supabase, a1Type, selectedTopic]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const shuffle = () => {
    setQuestions((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="heading-sub-sm text-text-primary">Flashcard ôn luyện</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          Nhấn vào thẻ để lật xem đáp án
        </p>
      </div>

      {/* Filter bar */}
      <Card className="border border-border bg-bg-card">
        <Card.Content className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            {/* Topic select */}
            <div className="flex-1">
              <Select
                value={selectedTopic}
                onChange={(key) => setSelectedTopic(key as string)}
                placeholder="Tất cả chủ đề"
                aria-label="Filter chủ đề"
              >
                <Label className="text-[0.75rem] font-medium text-text-tertiary mb-1.5 block">
                  Chủ đề
                </Label>
                <Select.Trigger className="w-full rounded-xl border border-border bg-bg-card text-sm text-text-primary px-3 py-2.5 focus:outline-none focus:border-focus-blue">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="rounded-xl border border-border bg-bg-card shadow-lg overflow-hidden">
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

            <div className="flex flex-col gap-0 sm:shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onPress={shuffle}
                  className="rounded-xl px-4 py-2.5 border-border text-text-secondary whitespace-nowrap text-sm"
                >
                  <LuShuffle size={14} className="mr-1" /> Xáo trộn
                </Button>
                <div className="px-3 py-2.5 rounded-xl border border-border bg-bg-subtle text-sm font-medium text-brand whitespace-nowrap">
                  {questions.length} câu
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" />
          <p className="text-text-tertiary text-sm">Đang tải câu hỏi...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20">
          <LuInbox
            size={48}
            className="mx-auto mb-3 text-text-tertiary opacity-40"
          />
          <p className="font-medium text-text-primary">Không có câu hỏi</p>
          <p className="text-sm text-text-tertiary mt-1">
            Thử chọn chủ đề khác hoặc thêm câu hỏi qua Admin
          </p>
        </div>
      ) : (
        <FlashCard
          question={questions[currentIndex]}
          current={currentIndex + 1}
          total={questions.length}
          onNext={() =>
            setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))
          }
          onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
        />
      )}
    </div>
  );
}
