"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { HandshakeIcon, PlusIcon, HomeIcon, UserIcon } from "./Icons";
import ThemeToggle from "./ThemeToggle";
import MachinePreviewDrawer from "./MachinePreviewDrawer";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    fetch("/api/messages")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const count = data.messages.filter(
          (m: any) => !m.read && m.receiver?.username === session.user.username
        ).length;
        setUnread(count);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [status, session]);

  const navLink = (href: string, label: string, icon?: React.ReactNode) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          active ? "bg-surface2 text-ink" : "text-ink-muted hover:text-ink hover:bg-surface2"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.png" alt="Tezgahçı" width={36} height={36} className="rounded" priority />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-wide text-blueprint">
              TEZGAHÇI
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-widest text-ink-muted sm:block">
              CNC Makine Pazarı
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLink("/", "Ana Sayfa", <HomeIcon className="h-4 w-4" />)}
          {navLink("/ilanlar", "İlanlar")}
          {navLink("/ilan-ver", "İlan Ver", <PlusIcon className="h-4 w-4" />)}
          {status === "authenticated" &&
            navLink(
              "/mesajlarim",
              "Mesajlarım",
              <span className="relative">
                <HandshakeIcon className="text-base" />
                {unread > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-ink">
                    {unread}
                  </span>
                )}
              </span>
            )}
          {status === "authenticated" &&
            session.user.accountType === "BAYI" &&
            navLink("/bayi-panel", "Bayi Panelim")}
          {status === "authenticated" &&
            session.user.isAdmin &&
            navLink("/admin", "Panel")}
        </nav>

        <div className="flex items-center gap-2">
          <MachinePreviewDrawer />
          <ThemeToggle />
          {status === "authenticated" ? (
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 text-sm text-ink-muted sm:flex">
                <UserIcon className="h-4 w-4" />
                {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="input rounded-lg px-3 py-1.5 text-sm font-medium"
                type="button"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/giris" className="input rounded-lg px-3 py-1.5 text-sm font-medium">
                Giriş Yap
              </Link>
              <Link href="/kayit" className="btn-accent rounded-lg px-3 py-1.5 text-sm font-semibold">
                Üye Ol
              </Link>
            </div>
          )}
        </div>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-3 py-1.5 md:hidden">
        {navLink("/", "Ana Sayfa")}
        {navLink("/ilanlar", "İlanlar")}
        {navLink("/ilan-ver", "İlan Ver")}
        {status === "authenticated" && navLink("/mesajlarim", "Mesajlar")}
        {status === "authenticated" && session.user.accountType === "BAYI" && navLink("/bayi-panel", "Bayi Panelim")}
        {status === "authenticated" && session.user.isAdmin && navLink("/admin", "Panel")}
      </nav>
    </header>
  );
}
