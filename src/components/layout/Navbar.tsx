"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import Image from "next/image";
import type { IconType } from "react-icons";
import {
  LuHouse,
  LuLayers,
  LuFileText,
  LuGamepad2,
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
  { kind: "link", href: "/road-signs", label: "Chơi game", icon: LuGamepad2 },
  { kind: "link", href: "/flashcards", label: "Ôn tập", icon: LuLayers },
  { kind: "link", href: "/exam", label: "Thi thử", icon: LuFileText },
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
  const [mobileSheet, setMobileSheet] = useState<string | null>(null);

  useEffect(() => {
    setMobileSheet(null);
  }, [pathname]);

  return (
    <div className="relative z-50">
      <header className="hidden md:flex sticky top-0 py-4 min-h-[4.5rem] items-center bg-bg-page/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-8 w-full flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <Link
              href="/landing"
              className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.webp"
                alt="Logo"
                width={36}
                height={36}
                className="rounded-xl shadow-sm"
              />
              <span className="font-serif font-bold text-xl text-text-primary tracking-tight">
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
                        "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black transition-all duration-200 active:scale-95",
                        active
                          ? "bg-brand text-[#1E1E1E] shadow-lg shadow-brand/20"
                          : "text-text-secondary hover:bg-bg-subtle hover:text-text-primary",
                      ].join(" ")}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                }
                return null;
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/road-signs">
              <Button
                className="bg-[#1E1E1E] text-white rounded-xl text-sm font-black px-6 shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all"
              >
                CHƠI NGAY
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <header className="md:hidden sticky top-0 h-16 flex items-center justify-between p-4 bg-bg-page/95 backdrop-blur-md border-b border-border shadow-sm">
        <Link
          href="/landing"
          className="flex items-center gap-2 font-serif font-black text-text-primary text-lg"
        >
          <Image
            src="/logo.webp"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-lg shadow-sm"
          />
          hocluatdema
        </Link>

        <Link href="/road-signs">
          <Button
            size="sm"
            className="bg-brand text-[#1E1E1E] rounded-xl text-xs font-black px-5 shadow-lg shadow-brand/20 active:scale-95 transition-all"
          >
            CHƠI NGAY
          </Button>
        </Link>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-bg-page/95 backdrop-blur-xl border-t border-border shadow-[0_-10px_30px_rgba(0,0,0,0.05)] safe-area-bottom">
        <div className="flex items-stretch h-18">
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
                    "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-black transition-all relative active:scale-90",
                    active ? "text-brand" : "text-text-tertiary",
                  ].join(" ")}
                >
                  <Icon
                    size={22}
                    className={`transition-transform duration-300 ${active ? "scale-110" : ""}`}
                  />
                  <span className="uppercase tracking-tighter">{item.label}</span>
                  {active && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-10 bg-brand rounded-full shadow-[0_2px_10px_rgba(244,166,22,0.4)]" />
                  )}
                </Link>
              );
            }
            return null;
          })}
        </div>
      </nav>
    </div>
  );
}
