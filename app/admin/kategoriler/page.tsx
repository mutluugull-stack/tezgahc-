"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { catLabel } from "@/lib/constants";
import EmptyState from "@/components/EmptyState";
import { BackIcon } from "@/components/Icons";

type Stats = {
  categoryBreakdown: { category: string; count: number }[];
};

export default function AdminCategoriesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => {
        if (!r.ok) throw new Error("Yetkisiz erişim.");
        return r.json();
      })
      .then((data) => setStats(data.stats))
      .catch((e) => setError(e.message));
  }, []);

  const maxCount = stats ? Math.max(1, ...stats.categoryBreakdown.map((c) => c.count)) : 1;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Yönetici Paneli
      </Link>
      <h1 className="mb-1 font-display text-2xl font-bold">Kategoriler</h1>
      <p className="mb-5 text-sm text-ink-muted">Kategoriye göre ilan dağılımı.</p>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && !stats && <p className="text-sm text-ink-muted">Yükleniyor...</p>}

      {stats && (
        <div className="card p-5">
          {stats.categoryBreakdown.length === 0 ? (
            <EmptyState title="Henüz ilan yok" />
          ) : (
            <div className="flex flex-col gap-2.5">
              {stats.categoryBreakdown
                .sort((a, b) => b.count - a.count)
                .map((c) => (
                  <div key={c.category} className="flex items-center gap-3">
                    <span className="w-44 flex-shrink-0 truncate text-sm">{catLabel(c.category)}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface2">
                      <div
                        className="h-full rounded-full bg-blueprint"
                        style={{ width: `${(c.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono-data w-8 flex-shrink-0 text-right text-sm">{c.count}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
