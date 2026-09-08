"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { catLabel, fmtPrice, fmtDate } from "@/lib/constants";
import EmptyState from "@/components/EmptyState";
import { BackIcon, PlusIcon, TrashIcon, StarIcon } from "@/components/Icons";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type Listing = {
  id: string;
  title: string;
  category: string;
  price: number;
  currency: string;
  city: string;
  isSold: boolean;
  isVitrin: boolean;
  viewCount: number;
  createdAt: string;
  images: { url: string }[];
};

export default function BayiListingsPage() {
  const { t, locale } = useLanguage();
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/bayi/ilanlar")
      .then((r) => {
        if (!r.ok) throw new Error(t("dealerPanel.permissionError"));
        return r.json();
      })
      .then((data) => setListings(data.listings))
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleSold(id: string, isSold: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSold }),
      });
      if (res.ok) load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm(t("dealerPanel.deleteConfirm"))) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (res.ok) load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/bayi-panel" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> {t("dealerPanel.myPanelTitle")}
      </Link>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">{t("dealerPanel.tileListings")}</h1>
          <p className="text-sm text-ink-muted">{t("dealerPanel.myListingsSubtitle")}</p>
        </div>
        <Link href="/ilan-ver" className="btn-accent flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold">
          <PlusIcon className="h-4 w-4" /> {t("dealerPanel.newListingButton")}
        </Link>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && !listings && <p className="text-sm text-ink-muted">{t("common.loading")}</p>}

      {listings && (
        listings.length === 0 ? (
          <EmptyState title={t("dealerPanel.emptyListingsTitle")} description={t("dealerPanel.emptyListingsDesc")} />
        ) : (
          <div className="flex flex-col gap-2.5">
            {listings.map((l) => (
              <div key={l.id} className="card flex items-center gap-3 p-3">
                {l.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.images[0].url} alt={l.title} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-surface2" />
                )}
                <div className="min-w-0 flex-1">
                  <Link href={`/ilan/${l.id}`} className="truncate font-medium hover:text-blueprint hover:underline">
                    {l.title}
                  </Link>
                  <p className="text-xs text-ink-muted">
                    {catLabel(l.category, locale)} · {l.city} · {fmtDate(l.createdAt)} · {t("dealerPanel.viewsCount").replace("{n}", String(l.viewCount))}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        l.isSold ? "bg-surface2 text-ink-muted" : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {l.isSold ? t("dealerProfile.soldBadge") : t("dealerPanel.statusActive")}
                    </span>
                    {l.isVitrin && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        <StarIcon className="h-3 w-3" /> {t("dealerPanel.vitrinBadge")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="font-mono-data text-sm font-semibold text-blueprint">{fmtPrice(l.price, l.currency)}</span>
                  <div className="flex gap-1.5">
                    <button
                      disabled={busyId === l.id}
                      onClick={() => toggleSold(l.id, !l.isSold)}
                      className="input rounded-lg px-2.5 py-1 text-xs font-semibold"
                    >
                      {l.isSold ? t("dealerPanel.markActiveButton") : t("dealerProfile.soldBadge")}
                    </button>
                    <button
                      disabled={busyId === l.id}
                      onClick={() => remove(l.id)}
                      title={t("dealerPanel.deleteTooltip")}
                      className="input flex h-7 w-7 items-center justify-center rounded-lg text-red-500"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
