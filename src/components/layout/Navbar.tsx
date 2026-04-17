"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import type { IconType } from "react-icons";
import {
  LuHouse,
  LuBookOpen,
  LuLayers,
  LuFileText,
  LuGamepad2,
  LuTriangleAlert,
  LuSettings,
  LuArrowLeft,
} from "react-icons/lu";

// ─── Nav structure ────────────────────────────────────────────────────────────

type NavItem =
  | { kind: "link"; href: string; label: string; icon: IconType }
  | {
      kind: "dropdown";
      id: string;
      label: string;
      icon: IconType;
      items: {
        href: string;
        label: string;
        icon: IconType;
        description?: string;
      }[];
    };

const navItems: NavItem[] = [
  { kind: "link", href: "/landing", label: "Trang chủ", icon: LuHouse },
  {
    kind: "dropdown",
    id: "hoc-tap",
    label: "Học tập",
    icon: LuBookOpen,
    items: [
      {
        href: "/flashcards",
        label: "Flash Card",
        icon: LuLayers,
        description: "Ôn tập với thẻ ghi nhớ",
      },
      {
        href: "/exam",
        label: "Luyện thi",
        icon: LuFileText,
        description: "Kiểm tra kiến thức",
      },
    ],
  },
  {
    kind: "dropdown",
    id: "tro-choi",
    label: "Trò chơi",
    icon: LuGamepad2,
    items: [
      {
        href: "/road-signs",
        label: "Biển báo đường",
        icon: LuTriangleAlert,
        description: "Nhận diện biển báo giao thông",
      },
    ],
  },
];

// ─── Chevron ──────────────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M2 4.5L6 8L10 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Desktop Dropdown ─────────────────────────────────────────────────────────

function DesktopDropdown({
  item,
  pathname,
}: {
  item: Extract<NavItem, { kind: "dropdown" }>;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = item.items.some(
    (i) => pathname === i.href || pathname.startsWith(i.href),
  );

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const TriggerIcon = item.icon;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 select-none",
          active || open
            ? "bg-bg-subtle text-text-primary"
            : "text-text-secondary hover:bg-bg-subtle hover:text-text-primary",
        ].join(" ")}
      >
        <TriggerIcon size={15} />
        {item.label}
        <Chevron open={open} />
      </button>

      {/* Dropdown panel */}
      <div
        className={[
          "absolute top-full left-0 mt-1.5 w-56 rounded-2xl bg-bg-card border border-border shadow-lg shadow-black/10",
          "overflow-hidden transition-all duration-200 origin-top",
          open
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none",
        ].join(" ")}
      >
        <div className="p-1.5">
          {item.items.map(({ href, label, icon: ItemIcon, description }) => {
            const isActive = pathname === href || pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={[
                  "flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 group",
                  isActive ? "bg-bg-subtle" : "hover:bg-bg-subtle",
                ].join(" ")}
              >
                <ItemIcon
                  size={17}
                  className="mt-0.5 shrink-0 text-text-tertiary group-hover:text-text-secondary transition-colors"
                />
                <div>
                  <div
                    className={`text-sm font-medium leading-none mb-1 ${isActive ? "text-text-primary" : "text-text-primary"}`}
                  >
                    {label}
                  </div>
                  {description && (
                    <div className="text-xs text-text-tertiary leading-snug">
                      {description}
                    </div>
                  )}
                </div>
                {isActive && (
                  <span className="ml-auto mt-0.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileSheet({
  item,
  open,
  onClose,
  pathname,
}: {
  item: Extract<NavItem, { kind: "dropdown" }>;
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={[
          "fixed bottom-16 left-2 right-2 z-50 rounded-2xl bg-bg-card border border-border shadow-xl",
          "transition-all duration-250 ease-out",
          open
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="p-3">
          <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest px-2 mb-2">
            {item.label}
          </p>
          {item.items.map(({ href, label, icon: ItemIcon, description }) => {
            const isActive = pathname === href || pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={[
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors",
                  isActive
                    ? "bg-bg-subtle"
                    : "hover:bg-bg-subtle active:bg-bg-subtle",
                ].join(" ")}
              >
                <ItemIcon
                  size={20}
                  className={isActive ? "text-brand" : "text-text-tertiary"}
                />
                <div>
                  <div
                    className={`text-sm font-medium ${isActive ? "text-text-primary" : "text-text-secondary"}`}
                  >
                    {label}
                  </div>
                  {description && (
                    <div className="text-xs text-text-tertiary">
                      {description}
                    </div>
                  )}
                </div>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-brand shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, signOut } = useAuth();
  const [mobileSheet, setMobileSheet] = useState<string | null>(null);

  useEffect(() => {
    setMobileSheet(null);
  }, [pathname]);

  return (
    <>
      <header className="hidden md:flex sticky top-0 z-40 py-4 min-h-[4.5rem] items-center bg-bg-page/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-8 w-full flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <Link
              href="/landing"
              className="flex items-center gap-2.5 shrink-0"
            >
              <Image
                src="/logo.webp"
                alt="Logo"
                width={36}
                height={36}
                className="rounded-xl"
              />
              <span className="font-serif font-medium text-lg text-text-primary">
                hocluatdema
              </span>
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                if (item.kind === "link") {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/landing" &&
                      pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200",
                        active
                          ? "bg-bg-subtle text-text-primary"
                          : "text-text-secondary hover:bg-bg-subtle hover:text-text-primary",
                      ].join(" ")}
                    >
                      <Icon size={15} />
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <DesktopDropdown
                    key={item.id}
                    item={item}
                    pathname={pathname}
                  />
                );
              })}
            </nav>
          </div>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              {role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-border-strong bg-bg-subtle text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
                >
                  <LuSettings size={13} />
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 group px-2 py-1.5 rounded-xl hover:bg-bg-subtle transition-colors"
                title="Quản lý hồ sơ"
              >
                <span className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-[10px] text-ivory font-serif font-medium">
                  {(user.email || "U").charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors max-w-[140px] truncate">
                  {user.email}
                </span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs border-border text-text-secondary hover:bg-bg-subtle"
                onPress={signOut}
              >
                Đăng xuất
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button
                size="sm"
                className="bg-brand text-ivory rounded-xl text-sm font-medium px-5"
              >
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </header>

      <header className="md:hidden sticky top-0 z-40 h-14 flex items-center justify-between p-4 bg-bg-page/90 backdrop-blur-md border-b border-border">
        <Link
          href="/landing"
          className="flex items-center gap-2 font-serif font-medium text-text-primary"
        >
          <Image
            src="/logo.webp"
            alt="Logo"
            width={36}
            height={36}
            className="rounded-xl"
          />
          hocluatdema
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <Link
                href="/questions"
                className="flex items-center gap-1 text-[11px] font-medium text-text-secondary px-2.5 py-1.5 rounded-lg border border-border-strong bg-bg-subtle"
              >
                <LuSettings size={12} />
                Admin
              </Link>
            )}
            <Link
              href="/profile"
              className="w-7 h-7 rounded-full bg-bg-subtle border border-border flex items-center justify-center text-[10px] text-text-secondary font-medium font-serif"
            >
              {(user.email || "U").charAt(0).toUpperCase()}
            </Link>
            <button
              onClick={signOut}
              className="text-[11px] text-text-secondary px-3 py-1.5 rounded-lg border border-border bg-bg-card shadow-sm"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="text-xs font-medium text-ivory bg-brand px-3 py-1.5 rounded-lg"
          >
            Đăng nhập
          </Link>
        )}
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-page/95 backdrop-blur-md border-t border-border safe-area-bottom">
        <div className="flex items-stretch h-16">
          {navItems.map((item) => {
            if (item.kind === "link") {
              const active =
                pathname === item.href ||
                (item.href !== "/landing" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors relative",
                    active ? "text-brand" : "text-text-tertiary",
                  ].join(" ")}
                >
                  <Icon
                    size={22}
                    className={`transition-transform duration-200 ${active ? "scale-110" : ""}`}
                  />
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-brand rounded-full" />
                  )}
                </Link>
              );
            }

            const active = item.items.some(
              (i) => pathname === i.href || pathname.startsWith(i.href),
            );
            const isOpen = mobileSheet === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setMobileSheet(isOpen ? null : item.id)}
                className={[
                  "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors relative",
                  active || isOpen ? "text-brand" : "text-text-tertiary",
                ].join(" ")}
              >
                <Icon
                  size={22}
                  className={`transition-transform duration-200 ${active || isOpen ? "scale-110" : ""}`}
                />
                <span className="flex items-center gap-0.5">
                  {item.label}
                  <Chevron open={isOpen} />
                </span>
                {(active || isOpen) && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-brand rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {navItems
        .filter(
          (i): i is Extract<NavItem, { kind: "dropdown" }> =>
            i.kind === "dropdown",
        )
        .map((item) => (
          <MobileSheet
            key={item.id}
            item={item}
            open={mobileSheet === item.id}
            onClose={() => setMobileSheet(null)}
            pathname={pathname}
          />
        ))}
    </>
  );
}
