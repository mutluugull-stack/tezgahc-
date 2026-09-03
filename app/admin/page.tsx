"use client";

import { useEffect, useState } from "react";
import AppGrid, { type AppTile } from "@/components/AppGrid";
import {
  UsersIcon,
  BuildingIcon,
  WrenchIcon,
  TagIcon,
  ChatIcon,
  StarIcon,
  ChartIcon,
  GearIcon,
} from "@/components/Icons";

type Stats = {
  activeListings: number;
  soldListings: number;
  individualUsers: number;
  dealerUsers: number;
  pendingDealers: number;
};

const iconProps = { className: "h-6 w-6" };

const TILES: AppTile[] = [
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: <UsersIcon {...iconProps} />, color: "#2f6fed" },
  { href: "/admin/bayiler", label: "Bayiler", icon: <BuildingIcon {...iconProps} />, color: "#e8590c" },
  { href: "/admin/ilanlar", label: "İlanlar", icon: <WrenchIcon {...iconProps} />, color: "#0f9d58" },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: <TagIcon {...iconProps} />, color: "#8e44ad" },
  { href: "/admin/mesajlar", label: "Mesajlar", icon: <ChatIcon {...iconProps} />, color: "#00b8d9" },
  { href: "/admin/vitrin", label: "Vitrin Yönetimi", icon: <StarIcon {...iconProps} />, color: "#f5a623" },
  { href: "/admin/raporlar", label: "Raporlar", icon: <ChartIcon {...iconProps} />, color: "#004aad" },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: <GearIcon {...iconProps} />, color: "#64748b" },
];

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setStats(data.stats))
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-1 font-display text-2xl font-bold">Yönetici Paneli</h1>
      <p className="mb-5 text-sm text-ink-muted">Pazar yerini buradan yönetin.</p>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Aktif İlan", value: stats.activeListings },
            { label: "Satılan İlan", value: stats.soldListings },
            { label: "Bireysel Üye", value: stats.individualUsers },
            { label: "Bayi Üye", value: stats.dealerUsers },
            { label: "Onay Bekleyen Bayi", value: stats.pendingDealers },
          ].map((s) => (
            <div key={s.label} className="card p-3.5">
              <p className="font-mono-data text-2xl font-bold text-blueprint">{s.value}</p>
              <p className="text-xs text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card p-4">
        <AppGrid
          tiles={TILES.map((t) =>
            t.href === "/admin/bayiler" && stats?.pendingDealers
              ? { ...t, badge: stats.pendingDealers }
              : t
          )}
        />
      </div>
    </div>
  );
}
