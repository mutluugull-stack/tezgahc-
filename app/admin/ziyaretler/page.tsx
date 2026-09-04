"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BackIcon } from "@/components/Icons";

type Visits = {
  totals: { today: number; last7Days: number; last30Days: number };
  visitsByDay: { label: string; count: number }[];
  topPages: { path: string; count: number }[];
  topReferrers: { source: string; count: number }[];
  topProvinces: { province: string; count: number }[];
  deviceTypes: { type: string; count: number }[];
  topDeviceModels: { model: string; count: number }[];
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

function RankRow({ label, count, max }: { label: string; count: number; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="min-w-0 flex-1 truncate text-sm text-ink-muted" title={label}>
        {label}
      </span>
      <div className="h-2.5 w-24 flex-shrink-0 overflow-hidden rounded-full bg-surface2 sm:w-32">
        <div className="h-full rounded-full bg-blueprint" style={{ width: `${max ? (count / max) * 100 : 0}%` }} />
      </div>
      <span className="font-mono-data w-8 flex-shrink-0 text-right text-sm">{count}</span>
    </div>
  );
}

export default function AdminVisitsPage() {
  const [data, setData] = useState<Visits | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/visits")
      .then((r) => {
        if (!r.ok) throw new Error("Yetkisiz erişim.");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Yönetici Paneli
      </Link>
      <h1 className="mb-1 font-display text-2xl font-bold">Ziyaretler</h1>
      <p className="mb-5 text-sm text-ink-muted">Sitenin ziyaretçi trafiği (yönetici panel sayfaları hariç).</p>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && !data && <p className="text-sm text-ink-muted">Yükleniyor...</p>}

      {data && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Bugün", value: data.totals.today },
              { label: "Son 7 Gün", value: data.totals.last7Days },
              { label: "Son 30 Gün", value: data.totals.last30Days },
            ].map((s) => (
              <div key={s.label} className="card p-3.5">
                <p className="font-mono-data text-2xl font-bold text-blueprint">{s.value}</p>
                <p className="text-xs text-ink-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="card p-5">
            <h2 className="mb-4 font-display text-lg font-semibold">Son 14 Günde Ziyaret</h2>
            <div className="flex flex-col gap-2.5">
              {data.visitsByDay.map((d) => (
                <BarRow key={d.label} label={d.label} count={d.count} max={Math.max(1, ...data.visitsByDay.map((x) => x.count))} />
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-4 font-display text-lg font-semibold">En Çok Görüntülenen Sayfalar (Son 30 Gün)</h2>
            {data.topPages.length === 0 && <p className="text-sm text-ink-muted">Henüz veri yok.</p>}
            <div className="flex flex-col gap-2.5">
              {data.topPages.map((p) => (
                <RankRow key={p.path} label={p.path} count={p.count} max={Math.max(1, ...data.topPages.map((x) => x.count))} />
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-4 font-display text-lg font-semibold">Trafik Kaynakları (Son 30 Gün)</h2>
            {data.topReferrers.length === 0 && <p className="text-sm text-ink-muted">Henüz veri yok.</p>}
            <div className="flex flex-col gap-2.5">
              {data.topReferrers.map((r) => (
                <RankRow key={r.source} label={r.source} count={r.count} max={Math.max(1, ...data.topReferrers.map((x) => x.count))} />
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-1 font-display text-lg font-semibold">İllere Göre Ziyaret (Son 30 Gün)</h2>
            <p className="mb-4 text-xs text-ink-muted">Konum, ziyaretçinin IP adresinden yaklaşık olarak tahmin edilir; kesin olmayabilir.</p>
            {data.topProvinces.length === 0 && <p className="text-sm text-ink-muted">Henüz veri yok.</p>}
            <div className="flex flex-col gap-2.5">
              {data.topProvinces.map((p) => (
                <RankRow
                  key={p.province}
                  label={p.province}
                  count={p.count}
                  max={Math.max(1, ...data.topProvinces.map((x) => x.count))}
                />
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-4 font-display text-lg font-semibold">Cihaz Türü (Son 30 Gün)</h2>
            {data.deviceTypes.length === 0 && <p className="text-sm text-ink-muted">Henüz veri yok.</p>}
            <div className="flex flex-col gap-2.5">
              {data.deviceTypes.map((d) => (
                <RankRow key={d.type} label={d.type} count={d.count} max={Math.max(1, ...data.deviceTypes.map((x) => x.count))} />
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-1 font-display text-lg font-semibold">Cihaz Modelleri (Son 30 Gün)</h2>
            <p className="mb-4 text-xs text-ink-muted">
              iPhone modelleri Apple'ın tarayıcı bilgisinde yer almadığından yalnızca &quot;iPhone&quot; olarak görünür; Android
              modelleri genellikle tam olarak görünür.
            </p>
            {data.topDeviceModels.length === 0 && <p className="text-sm text-ink-muted">Henüz veri yok.</p>}
            <div className="flex flex-col gap-2.5">
              {data.topDeviceModels.map((m) => (
                <RankRow
                  key={m.model}
                  label={m.model}
                  count={m.count}
                  max={Math.max(1, ...data.topDeviceModels.map((x) => x.count))}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
