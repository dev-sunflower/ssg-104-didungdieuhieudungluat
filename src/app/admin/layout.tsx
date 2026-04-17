import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/");

  return (
    <div className="h-screen flex overflow-hidden bg-bg-page overflow-hidden">
      {/* Sticky sidebar */}
      <aside className="shrink-0 h-full overflow-y-auto">
        <AdminSidebar />
      </aside>

      {/* Right column: sticky header + scrollable content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="shrink-0 bg-bg-card border-b border-border px-6 py-4 flex items-center gap-3">
          <div className="text-sm text-text-tertiary">
            Đăng nhập:{" "}
            <span className="font-medium text-text-primary">{user.email}</span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-bg-subtle border border-border-strong text-text-button font-medium">
            Admin
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
