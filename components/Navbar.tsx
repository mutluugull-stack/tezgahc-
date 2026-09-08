"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { HandshakeIcon, PlusIcon, HomeIcon, HeartIcon } from "./Icons";
import ThemeToggle from "./ThemeToggle";
import MachinePreviewDrawer from "./MachinePreviewDrawer";
import UserMenu from "./UserMenu";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import { useT } from "./i18n/LanguageProvider";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);
  const t = useT();

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
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.png" alt="Tezgahçı" width={36} height={36} className="rounded" priority />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-wide text-blueprint">
              TEZGAHÇI
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-widest text-ink-muted sm:block">
              {t("nav.tagline")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLink("/", t("nav.home"), <HomeIcon className="h-4 w-4" />)}
          {navLink("/ilanlar", t("nav.listings"))}
          {navLink("/ilan-ver", t("nav.postListing"), <PlusIcon className="h-4 w-4" />)}
          {status === "authenticated" &&
            navLink(
              "/mesajlarim",
              t("nav.messages"),
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
            navLink("/favorilerim", t("nav.favorites"), <HeartIcon className="h-4 w-4" />)}
          {status === "authenticated" &&
            session.user.accountType === "BAYI" &&
            navLink("/bayi-panel", t("nav.dealerPanel"))}
          {status === "authenticated" &&
            session.user.isAdmin &&
            navLink("/admin", t("nav.adminPanel"))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <MachinePreviewDrawer />
          <ThemeToggle />
          {status === "authenticated" ? (
            <UserMenu session={session} />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/giris" className="input rounded-lg px-3 py-1.5 text-sm font-medium">
                {t("nav.login")}
              </Link>
              <Link href="/kayit" className="btn-accent rounded-lg px-3 py-1.5 text-sm font-semibold">
                {t("nav.register")}
              </Link>
            </div>
          )}
        </div>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-3 py-1.5 md:hidden">
        {navLink("/", t("nav.home"))}
        {navLink("/ilanlar", t("nav.listings"))}
        {navLink("/ilan-ver", t("nav.postListing"))}
        {status === "authenticated" && navLink("/mesajlarim", t("nav.messagesShort"))}
        {status === "authenticated" && navLink("/favorilerim", t("nav.favorites"))}
        {status === "authenticated" && session.user.accountType === "BAYI" && navLink("/bayi-panel", t("nav.dealerPanel"))}
        {status === "authenticated" && session.user.isAdmin && navLink("/admin", t("nav.adminPanel"))}
      </nav>
    </header>
  );
}
