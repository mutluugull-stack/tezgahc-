"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";
import { UserIcon, GearIcon, GridViewIcon, UsersIcon, ChevronDownIcon } from "./Icons";

type MenuItem = { href: string; label: string; icon: React.ReactNode };

export default function UserMenu({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

useEffect(() => {
  setOpen(false);
}, [pathname]);

useEffect(() => {
  if (!open) return;
  function onClick(e: MouseEvent) {
    if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
  }
  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
  }
  document.addEventListener("mousedown", onClick);
  document.addEventListener("keydown", onKey);
  return () => {
    document.removeEventListener("mousedown", onClick);
    document.removeEventListener("keydown", onKey);
  };
}, [open]);

const user = session.user;
  const isTeamMember = !!user.parentDealerId;

const items: MenuItem[] = [];
  if (user.isAdmin) {
    items.push({ href: "/admin", label: "Yönetici Paneli", icon: <GridViewIcon className="h-4 w-4" /> });
    items.push({ href: "/admin/ayarlar", label: "Ayarlar", icon: <GearIcon className="h-4 w-4" /> });
  } else if (user.accountType === "BAYI") {
    items.push({ href: "/bayi-panel", label: "Bayi Panelim", icon: <GridViewIcon className="h-4 w-4" /> });
    if (!isTeamMember) {
      items.push({ href: "/bayi-panel/ekip", label: "Ekip Listesi", icon: <UsersIcon className="h-4 w-4" /> });
    }
    items.push({ href: "/bayi-panel/ayarlar", label: "Ayarlar", icon: <GearIcon className="h-4 w-4" /> });
  } else {
    items.push({ href: "/ayarlar", label: "Ayarlar", icon: <GearIcon className="h-4 w-4" /> });
  }

const roleLabel = user.isAdmin
  ? "Site Yöneticisi"
  : user.accountType === "BAYI"
  ? isTeamMember
  ? "Ekip Üyesi"
  : "Bayi Hesabı"
  : "Üye";

return (
  <div className="relative" ref={ref}>
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-haspopup="menu"
      aria-expanded={open}
      className="input flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
    <UserIcon className="h-4 w-4" />
    <span className="hidden max-w-[10rem] truncate sm:inline">{user.name}</span>
    <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
    
      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+6px)] z-50 w-56 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
        <div className="border-b border-border px-3.5 py-2.5">
        <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
        <p className="truncate text-xs text-ink-muted">{roleLabel}</p>
        </div>
        <div className="py-1.5">
          {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink transition-colors hover:bg-surface2"
            >
            {item.icon}
            {item.label}
          </Link>
          ))}
          </div>
          <div className="border-t border-border py-1.5">
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-medium text-red-500 transition-colors hover:bg-surface2"
            >
          Çıkış
          </button>
          </div>
          </div>
          )}
          </div>
          );
            }
