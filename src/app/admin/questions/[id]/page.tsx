"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { LicenseType, QuestionOption } from "@/lib/types/database";
import {
  LuArrowLeft,
  LuPlus,
  LuTriangleAlert,
  LuSave,
  LuUpload,
  LuX,
  LuImage,
} from "react-icons/lu";
import {
  Checkbox,
  Label,
  ListBox,
  Radio,
  RadioGroup,
  Select,
} from "@heroui/react";

const TOPICS = [
  "Biển báo",
  "Tốc độ",
  "Quyền ưu tiên",
  "Sa hình",
  "Văn hóa giao thông",
  "Kỹ thuật lái xe",
  "Pháp luật",
  "Khác",
];
const OPTION_KEYS = ["A", "B", "C", "D"];

const selectTriggerCls =
  "w-full rounded-xl border border-border bg-bg-card text-sm text-text-primary px-3 py-2 focus:outline-none focus:border-focus-blue";
const selectPopoverCls =
  "rounded-xl border border-border bg-bg-card shadow-lg overflow-hidden";

export default function QuestionFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";
  const supabase = createClient();

  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    license_type_id: "",
    content: "",
    image_url: "",
    options: OPTION_KEYS.map((key) => ({ key, text: "" })) as QuestionOption[],
    correct_answer: "A",
    explanation: "",
    is_critical: false,
    topic: "",
  });

  useEffect(() => {
    supabase
      .from("license_types")
      .select("*")
      .order("code")
      .then(({ data }) => {
        if (data) setLicenseTypes(data);
      });
  }, [supabase]);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    supabase
      .from("questions")
      .select("*")
      .eq("id", params.id as string)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            license_type_id: data.license_type_id ?? "",
            content: data.content,
            image_url: data.image_url ?? "",
            options: data.options,
            correct_answer: data.correct_answer,
            explanation: data.explanation ?? "",
            is_critical: data.is_critical,
            topic: data.topic ?? "",
          });
          if (data.image_url) setImagePreview(data.image_url);
        }
        setLoading(false);
      });
  }, [supabase, isNew, params.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setForm((f) => ({ ...f, image_url: "" }));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setForm((f) => ({ ...f, image_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateOption = (index: number, text: string) => {
    setForm((f) => ({
      ...f,
      options: f.options.map((opt, i) =>
        i === index ? { ...opt, text } : opt,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let finalImageUrl = form.image_url || null;
    setUploadError("");

    if (imageFile) {
      const ext = imageFile.name.split(".").pop() ?? "jpg";
      const path = `questions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("question-images")
        .upload(path, imageFile, { upsert: false });
      if (error) {
        setUploadError(`Tải ảnh thất bại: ${error.message}`);
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("question-images")
        .getPublicUrl(path);
      finalImageUrl = urlData.publicUrl;
    }

    const payload = {
      license_type_id: form.license_type_id || null,
      content: form.content,
      image_url: finalImageUrl,
      options: form.options.filter((o) => o.text.trim()),
      correct_answer: form.correct_answer,
      explanation: form.explanation || null,
      is_critical: form.is_critical,
      topic: form.topic || null,
    };

    if (isNew) {
      await supabase.from("questions").insert(payload);
    } else {
      await supabase
        .from("questions")
        .update(payload)
        .eq("id", params.id as string);
    }

    setSaving(false);
    router.push("/admin/questions");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <LuArrowLeft size={15} />
          Quay lại
        </button>
        <h1 className="heading-sub-sm text-text-primary">
          {isNew ? "Thêm câu hỏi mới" : "Chỉnh sửa câu hỏi"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-bg-card rounded-2xl border border-border shadow-whisper p-6 flex flex-col gap-5"
      >
        {/* Row: License type + Topic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hạng bằng */}
          <Select
            value={form.license_type_id}
            onChange={(key) =>
              setForm((f) => ({ ...f, license_type_id: key as string }))
            }
            placeholder="-- Chọn --"
          >
            <Label className="text-xs font-medium text-text-primary mb-1 block">
              Hạng bằng *
            </Label>
            <Select.Trigger className={selectTriggerCls}>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className={selectPopoverCls}>
              <ListBox>
                {licenseTypes.map((lt) => (
                  <ListBox.Item
                    key={lt.id}
                    id={lt.id}
                    textValue={`${lt.code} — ${lt.name}`}
                  >
                    {lt.code} — {lt.name}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          {/* Chủ đề */}
          <Select
            value={form.topic}
            onChange={(key) => setForm((f) => ({ ...f, topic: key as string }))}
            placeholder="-- Chọn chủ đề --"
          >
            <Label className="text-xs font-medium text-text-primary mb-1 block">
              Chủ đề
            </Label>
            <Select.Trigger className={selectTriggerCls}>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className={selectPopoverCls}>
              <ListBox>
                {TOPICS.map((t) => (
                  <ListBox.Item key={t} id={t} textValue={t}>
                    {t}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Question content */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-primary">
            Nội dung câu hỏi *
          </label>
          <textarea
            required
            rows={3}
            value={form.content}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
            placeholder="Nhập nội dung câu hỏi..."
            className="text-sm px-3 py-2 rounded-xl border border-border bg-bg-card text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-focus-blue resize-none"
          />
        </div>

        {/* Image upload */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-text-primary">
            Hình ảnh (tùy chọn)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview ? (
            <div className="relative w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 max-w-full rounded-xl border border-border object-contain bg-bg-subtle"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-crimson hover:border-crimson transition-colors shadow-sm"
              >
                <LuX size={12} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border border-dashed border-border bg-bg-subtle text-sm text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
            >
              <LuImage size={15} />
              Chọn ảnh để tải lên
              <LuUpload size={13} className="ml-auto text-text-tertiary" />
            </button>
          )}
          {imagePreview && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 w-fit text-xs text-text-tertiary hover:text-text-secondary transition-colors"
            >
              <LuUpload size={12} /> Thay ảnh khác
            </button>
          )}
          {uploadError && (
            <p className="text-xs text-crimson">{uploadError}</p>
          )}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium text-text-primary">
            Các đáp án *
          </label>
          <RadioGroup
            aria-label="Chọn đáp án đúng"
            value={form.correct_answer}
            onChange={(val) =>
              setForm((f) => ({ ...f, correct_answer: val as string }))
            }
            className="flex flex-col gap-2"
          >
            {form.options.map((opt, i) => (
              <div key={opt.key} className="flex items-center gap-2">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-bg-subtle border border-border flex items-center justify-center font-medium text-sm text-text-secondary">
                  {opt.key}
                </span>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Đáp án ${opt.key}...`}
                  className="flex-1 text-sm px-3 py-2 rounded-xl border border-border bg-bg-card text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-focus-blue"
                />
                <Radio value={opt.key} aria-label={`Đáp án đúng: ${opt.key}`} className="self-center !items-center">
                  <Radio.Control style={{ marginTop: 0 }}>
                    <Radio.Indicator />
                  </Radio.Control>
                </Radio>
              </div>
            ))}
          </RadioGroup>
          <p className="text-xs text-text-tertiary">
            • Chọn nút tròn bên phải để đánh dấu đáp án đúng
          </p>
        </div>

        {/* Explanation */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-primary">
            Giải thích (tùy chọn)
          </label>
          <textarea
            rows={2}
            value={form.explanation}
            onChange={(e) =>
              setForm((f) => ({ ...f, explanation: e.target.value }))
            }
            placeholder="Giải thích tại sao đáp án này đúng..."
            className="text-sm px-3 py-2 rounded-xl border border-border bg-bg-card text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-focus-blue resize-none"
          />
        </div>

        {/* Critical flag */}
        <Checkbox
          isSelected={form.is_critical}
          onChange={(val) => setForm((f) => ({ ...f, is_critical: val }))}
        >
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label className="flex items-center gap-1.5 text-sm font-medium text-text-primary cursor-pointer">
              <LuTriangleAlert size={14} className="text-crimson" />
              Câu điểm liệt
            </Label>
            <p className="text-xs text-text-tertiary">
              Trả lời sai câu này sẽ tự động trượt
            </p>
          </Checkbox.Content>
        </Checkbox>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-ivory font-medium text-sm transition-colors disabled:opacity-60 shadow-ring-brand"
          >
            {saving ? (
              "Đang lưu..."
            ) : isNew ? (
              <>
                <LuPlus size={15} /> Thêm câu hỏi
              </>
            ) : (
              <>
                <LuSave size={15} /> Lưu thay đổi
              </>
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
  );
}
