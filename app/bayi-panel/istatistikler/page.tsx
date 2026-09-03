"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BackIcon } from "@/components/Icons";

type Stats = {
  total: number;
  active: number;
  sold: number;
  vitrin: number;
  totalViews: number;
  messages: number;
  teamMembers: number;
};

export default function BayiStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/bayi/ilanlar")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "İstatistikler alınamadı.");
        return data;
      })
      .then((data) => setStats(data.stats))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link href="/bayi-panel" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Bayi Panelim
      </Link>
      <h1 className="mb-1 font-display text-2xl font-bold">İstatistikler</h1>
      <p className="mb-5 text-sm text-ink-muted">Firmanızın pazar yerindeki performansı.</p>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && !stats && <p className="text-sm text-ink-muted">Yükleniyor...</p>}

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: "Toplam İlan", value: stats.total },
            { label: "Aktif İlan", value: stats.active },
            { label: "Satılan İlan", value: stats.sold },
            { label: "Vitrindeki İlan", value: stats.vitrin },
            { label: "Toplam Görüntülenme", value: stats.totalViews },
            { label: "Toplam Mesaj", value: stats.messages },
            { label: "Ekip Üyesi", value: stats.teamMembers },
          ].map((s) => (
            <div key={s.label} className="card p-3.5">
              <p className="font-mono-data text-2xl font-bold text-blueprint">{s.value}</p>
              <p className="text-xs text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
