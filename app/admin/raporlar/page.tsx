"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fmtPrice } from "@/lib/constants";
import { BackIcon } from "@/components/Icons";
import { useT } from "@/components/i18n/LanguageProvider";

type Reports = {
  listingsByMonth: { label: string; count: number }[];
  usersByMonth: { label: string; count: number }[];
  topCities: { city: string; count: number }[];
  avgPriceTRY: number;
  totals: { listings: number; soldListings: number; users: number; dealers: number };
};

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 flex-shrink-0 text-sm text-ink-muted">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface2">
        <div className="h-full rounded-full bg-blueprint" style={{ width: `${max ? (count / max) * 100 : 0}%` }} />
      </div>
      <span className="font-mono-data w-8 flex-shrink-0 text-right text-sm">{count}</span>
    </div>
  );
}

export default function AdminReportsPage() {
  const t = useT();
  const [data, setData] = useState<Reports | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((r) => {
        if (!r.ok) throw new Error(t("admin.unauthorizedError"));
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> {t("admin.panelTitle")}
      </Link>
      <h1 className="mb-1 font-display text-2xl font-bold">{t("admin.reportsPageTitle")}</h1>
      <p className="mb-5 text-sm text-ink-muted">{t("admin.reportsPageSubtitle")}</p>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && !data && <p className="text-sm text-ink-muted">{t("common.loading")}</p>}

      {data && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: t("admin.totalListings"), value: data.totals.listings },
              { label: t("dealerProfile.statSoldListings"), value: data.totals.soldListings },
              { label: t("admin.totalMembers"), value: data.totals.users },
              { label: t("admin.dealerCount"), value: data.totals.dealers },
            ].map((s) => (
              <div key={s.label} className="card p-3.5">
                <p className="font-mono-data text-2xl font-bold text-blueprint">{s.value}</p>
                <p className="text-xs text-ink-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="card p-3.5">
            <p className="text-xs text-ink-muted">{t("admin.avgListingPrice")}</p>
            <p className="font-mono-data text-2xl font-bold text-blueprint">{fmtPrice(data.avgPriceTRY, "TRY")}</p>
          </div>

          <div className="card p-5">
            <h2 className="mb-4 font-display text-lg font-semibold">{t("admin.newListingsLast6Months")}</h2>
            <div className="flex flex-col gap-2.5">
              {data.listingsByMonth.map((m) => (
                <BarRow key={m.label} label={m.label} count={m.count} max={Math.max(1, ...data.listingsByMonth.map((x) => x.count))} />
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-4 font-display text-lg font-semibold">{t("admin.newMembersLast6Months")}</h2>
            <div className="flex flex-col gap-2.5">
              {data.usersByMonth.map((m) => (
                <BarRow key={m.label} label={m.label} count={m.count} max={Math.max(1, ...data.usersByMonth.map((x) => x.count))} />
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-4 font-display text-lg font-semibold">{t("admin.listingsByCityTop8")}</h2>
            <div className="flex flex-col gap-2.5">
              {data.topCities.map((c) => (
                <BarRow key={c.city} label={c.city} count={c.count} max={Math.max(1, ...data.topCities.map((x) => x.count))} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
