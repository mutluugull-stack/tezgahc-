"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { catLabel, fmtPrice } from "@/lib/constants";
import EmptyState from "@/components/EmptyState";
import { BackIcon, StarIcon, SearchIcon } from "@/components/Icons";

type Listing = {
  id: string;
  title: string;
  category: string;
  price: number;
  currency: string;
  city: string;
  isVitrin: boolean;
  seller: { companyName: string | null; fullName: string | null; username: string };
};

export default function AdminVitrinPage() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  function load() {
    fetch("/api/listings?limit=200")
      .then((r) => r.json())
      .then((data) => setListings(data.listings))
      .catch(() => setError("İlanlar yüklenemedi."));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleVitrin(id: string, isVitrin: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVitrin }),
      });
      if (res.ok) load();
    } finally {
      setBusyId(null);
    }
  }

  const vitrinListings = useMemo(() => (listings || []).filter((l) => l.isVitrin), [listings]);
  const otherListings = useMemo(() => {
    const rest = (listings || []).filter((l) => !l.isVitrin);
    if (!q.trim()) return rest.slice(0, 40);
    const query = q.trim().toLowerCase();
    return rest.filter((l) => l.title.toLowerCase().includes(query)).slice(0, 40);
  }, [listings, q]);

  function Row({ l }: { l: Listing }) {
    return (
      <div key={l.id} className="card flex items-center justify-between gap-3 p-3">
        <div className="min-w-0">
          <Link href={`/ilan/${l.id}`} className="truncate font-medium hover:text-blueprint hover:underline">
            {l.title}
          </Link>
          <p className="text-xs text-ink-muted">
            {catLabel(l.category)} · {l.city} · {l.seller.companyName || l.seller.fullName || `@${l.seller.username}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-mono-data hidden text-sm text-blueprint sm:block">{fmtPrice(l.price, l.currency)}</span>
          <button
            disabled={busyId === l.id}
            onClick={() => toggleVitrin(l.id, !l.isVitrin)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${l.isVitrin ? "input" : "btn-accent"}`}
          >
            {l.isVitrin ? "Vitrinden Kaldır" : "Vitrine Ekle"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Yönetici Paneli
      </Link>
      <h1 className="mb-1 font-display text-2xl font-bold">Vitrin Yönetimi</h1>
      <p className="mb-5 text-sm text-ink-muted">
        Ana sayfada öne çıkarılacak ilanları seçin.
      </p>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && !listings && <p className="text-sm text-ink-muted">Yükleniyor...</p>}

      {listings && (
        <>
          <div className="mb-6">
            <h2 className="mb-2.5 flex items-center gap-1.5 font-display text-lg font-semibold">
              <StarIcon className="h-4 w-4 text-amber-500" /> Vitrindeki İlanlar ({vitrinListings.length})
            </h2>
            {vitrinListings.length === 0 ? (
              <EmptyState title="Vitrinde ilan yok" description="Aşağıdan bir ilan seçip vitrine ekleyin." />
            ) : (
              <div className="flex flex-col gap-2">
                {vitrinListings.map((l) => (
                  <Row key={l.id} l={l} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-2.5 font-display text-lg font-semibold">İlan Ekle</h2>
            <div className="input mb-3 flex items-center gap-2 rounded-lg px-3 py-2">
              <SearchIcon className="h-4 w-4 text-ink-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="İlan başlığına göre ara..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              {otherListings.map((l) => (
                <Row key={l.id} l={l} />
              ))}
              {otherListings.length === 0 && <p className="text-sm text-ink-muted">Sonuç bulunamadı.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
