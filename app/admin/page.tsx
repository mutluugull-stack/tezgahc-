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
  MegaphoneIcon,
  FlagIcon,
  EyeIcon,
} from "@/components/Icons";
import { useT } from "@/components/i18n/LanguageProvider";

type Stats = {
  activeListings: number;
  soldListings: number;
  individualUsers: number;
  dealerUsers: number;
  pendingDealers: number;
  pendingReports?: number;
};

const iconProps = { className: "h-6 w-6" };

export default function AdminPage() {
  const t = useT();
  const [stats, setStats] = useState<Stats | null>(null);

  const TILES: AppTile[] = [
    { href: "/admin/kullanicilar", label: t("admin.tileUsers"), icon: <UsersIcon {...iconProps} />, color: "#2f6fed" },
    { href: "/admin/bayiler", label: t("admin.tileDealers"), icon: <BuildingIcon {...iconProps} />, color: "#e8590c" },
    { href: "/admin/ilanlar", label: t("admin.tileListings"), icon: <WrenchIcon {...iconProps} />, color: "#0f9d58" },
    { href: "/admin/kategoriler", label: t("admin.tileCategories"), icon: <TagIcon {...iconProps} />, color: "#8e44ad" },
    { href: "/admin/mesajlar", label: t("admin.tileMessages"), icon: <ChatIcon {...iconProps} />, color: "#00b8d9" },
    { href: "/admin/vitrin", label: t("admin.tileVitrin"), icon: <StarIcon {...iconProps} />, color: "#f5a623" },
    { href: "/admin/reklamlar", label: t("admin.tileAds"), icon: <MegaphoneIcon {...iconProps} />, color: "#d63384" },
    { href: "/admin/sikayetler", label: t("admin.tileReports"), icon: <FlagIcon {...iconProps} />, color: "#c92a2a" },
    { href: "/admin/ziyaretler", label: t("admin.tileVisits"), icon: <EyeIcon {...iconProps} />, color: "#0d9488" },
    { href: "/admin/raporlar", label: t("admin.tileAnalytics"), icon: <ChartIcon {...iconProps} />, color: "#004aad" },
    { href: "/admin/ayarlar", label: t("settings.title"), icon: <GearIcon {...iconProps} />, color: "#64748b" },
  ];

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setStats((prev) => ({ ...(prev || {}), ...data.stats }) as Stats))
      .catch(() => {});
    fetch("/api/admin/sikayetler")
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (data) =>
          data &&
          setStats(
            (prev) =>
              ({
                ...(prev || {}),
                pendingReports: data.reports.filter((r: { status: string }) => r.status === "BEKLEMEDE").length,
              }) as Stats
          )
      )
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-1 font-display text-2xl font-bold">{t("admin.panelTitle")}</h1>
      <p className="mb-5 text-sm text-ink-muted">{t("admin.dashboardSubtitle")}</p>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: t("dealerProfile.statActiveListings"), value: stats.activeListings },
            { label: t("dealerProfile.statSoldListings"), value: stats.soldListings },
            { label: t("admin.statIndividualUsers"), value: stats.individualUsers },
            { label: t("admin.statDealerUsers"), value: stats.dealerUsers },
            { label: t("admin.statPendingDealers"), value: stats.pendingDealers },
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
          tiles={TILES.map((tile) => {
            if (tile.href === "/admin/bayiler" && stats?.pendingDealers) {
              return { ...tile, badge: stats.pendingDealers };
            }
            if (tile.href === "/admin/sikayetler" && stats?.pendingReports) {
              return { ...tile, badge: stats.pendingReports };
            }
            return tile;
          })}
        />
      </div>
    </div>
  );
}
