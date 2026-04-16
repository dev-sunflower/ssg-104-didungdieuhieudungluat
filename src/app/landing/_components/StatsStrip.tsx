import { SubheadingSm, Caption } from "@/components/ui/Typography";

const stats = [
  { value: "200+", label: "Câu hỏi thi" },
  { value: "1", label: "Hạng bằng lái" },
  { value: "100%", label: "Miễn phí hoàn toàn" },
];

export function StatsStrip() {
  return (
    <section className="bg-bg-subtle border-y border-border">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <SubheadingSm className="text-brand mb-1">{s.value}</SubheadingSm>
              <Caption>{s.label}</Caption>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
