"use client";

import Link from "next/link";

export type AppTile = {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string; // ikon rozetinin arka plan rengi
  badge?: number;
};

// Yönetici Paneli ve Bayi Paneli için ortak "uygulama ızgarası" bileşeni.
// Ekran görüntüsündeki Odoo tarzı ikon ızgarasından ilhamla, ancak site
// tasarım sistemimizin (globals.css / tailwind.config.ts) renk jetonlarını
// kullanır — sabit koyu lacivert bir zemin yerine.
export default function AppGrid({ tiles }: { tiles: AppTile[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {tiles.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="group flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-colors hover:bg-surface2"
        >
          <span
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm transition-transform group-hover:scale-105"
            style={{ background: t.color }}
          >
            {t.icon}
            {!!t.badge && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-ink">
                {t.badge > 99 ? "99+" : t.badge}
              </span>
            )}
          </span>
          <span className="text-xs font-semibold leading-tight text-ink">{t.label}</span>
        </Link>
      ))}
    </div>
  );
}
