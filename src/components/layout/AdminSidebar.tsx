"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  LuLayoutDashboard,
  LuCircleHelp,
  LuCreditCard,
  LuArrowLeft,
} from "react-icons/lu";

const adminLinks: {
  href: string;
  label: string;
  icon: IconType;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Tổng quan", icon: LuLayoutDashboard, exact: true },
  { href: "/admin/questions", label: "Câu hỏi", icon: LuCircleHelp },
  { href: "/admin/license-types", label: "Hạng bằng lái", icon: LuCreditCard },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-bg-card border-r border-border min-h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image src="/logo.webp" alt="Logo" width={32} height={32} />
          <div className="leading-tight">
            <div className="font-serif font-medium text-sm text-text-primary">
              Học Luật Dễ Mà
            </div>
            <div className="text-[0.75rem] text-text-tertiary">
              Quản trị viên
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {adminLinks.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-bg-subtle text-text-primary"
                  : "text-text-secondary hover:bg-bg-subtle hover:text-text-primary",
              ].join(" ")}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="p-3 border-t border-border">
        <Link
          href="/landing"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-text-tertiary hover:text-text-secondary hover:bg-bg-subtle transition-colors"
        >
          <LuArrowLeft size={13} />
          Về trang chính
        </Link>
      </div>
    </aside>
  );
}
