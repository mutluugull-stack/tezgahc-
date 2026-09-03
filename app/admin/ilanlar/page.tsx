"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { catLabel, fmtPrice, fmtDate } from "@/lib/constants";
import EmptyState from "@/components/EmptyState";
import { BackIcon, StarIcon, TrashIcon } from "@/components/Icons";

type Listing = {
  id: string;
  title: string;
  category: string;
  price: number;
  currency: string;
  city: string;
  isSold: boolean;
  isVitrin: boolean;
  createdAt: string;
  seller: { username: string; accountType: string; companyName: string | null; fullName: string | null };
};

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/listings?includeSold=1&limit=200")
      .then((r) => r.json())
      .then((data) => setListings(data.listings))
      .catch(() => setError("İlanlar yüklenemedi."));
  }

  useEffect(() => {
    load();
  }, []);

  async function patch(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (res.ok) load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Yönetici Paneli
      </Link>
      <h1 className="mb-1 font-display text-2xl font-bold">İlanlar</h1>
      <p className="mb-5 text-sm text-ink-muted">
        Tüm ilanları görüntüleyin, vitrine ekleyin/çıkarın veya kaldırın.
      </p>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && !listings && <p className="text-sm text-ink-muted">Yükleniyor...</p>}

      {listings && (
        <div className="card overflow-x-auto">
          {listings.length === 0 ? (
            <EmptyState title="Henüz ilan yok" />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface2 text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-2.5">İlan</th>
                  <th className="px-4 py-2.5">Satıcı</th>
                  <th className="px-4 py-2.5">Fiyat</th>
                  <th className="px-4 py-2.5">Durum</th>
                  <th className="px-4 py-2.5">Tarih</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5">
                      <Link href={`/ilan/${l.id}`} className="font-medium hover:text-blueprint hover:underline">
                        {l.title}
                      </Link>
                      <p className="text-xs text-ink-muted">
                        {catLabel(l.category)} · {l.city}
                      </p>
                    </td>
                    <td className="px-4 py-2.5 text-ink-muted">
                      {l.seller.companyName || l.seller.fullName || `@${l.seller.username}`}
                    </td>
                    <td className="font-mono-data px-4 py-2.5">{fmtPrice(l.price, l.currency)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            l.isSold ? "bg-surface2 text-ink-muted" : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {l.isSold ? "Satıldı" : "Aktif"}
                        </span>
                        {l.isVitrin && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                            Vitrin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-ink-muted">{fmtDate(l.createdAt)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          disabled={busyId === l.id}
                          onClick={() => patch(l.id, { isVitrin: !l.isVitrin })}
                          title={l.isVitrin ? "Vitrinden Kaldır" : "Vitrine Ekle"}
                          className={`input flex h-8 w-8 items-center justify-center rounded-lg ${
                            l.isVitrin ? "text-amber-500" : ""
                          }`}
                        >
                          <StarIcon className="h-4 w-4" />
                        </button>
                        <button
                          disabled={busyId === l.id}
                          onClick={() => patch(l.id, { isSold: !l.isSold })}
                          className="input rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                        >
                          {l.isSold ? "Aktife Al" : "Satıldı İşaretle"}
                        </button>
                        <button
                          disabled={busyId === l.id}
                          onClick={() => remove(l.id)}
                          title="Sil"
                          className="input flex h-8 w-8 items-center justify-center rounded-lg text-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
