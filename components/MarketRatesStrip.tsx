"use client";

import { useEffect, useState } from "react";
import { ChartIcon } from "./Icons";

type RateItem = { buy: number; sell: number; changePercent: number };
type MarketRates = {
  updatedAt: string;
  fetchedAt: string;
  usd: RateItem;
  eur: RateItem;
  gbp: RateItem;
  gramAltin: RateItem;
};

const numberFmt = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function RateBox({ label, item }: { label: string; item: RateItem }) {
  const isUp = item.changePercent >= 0;
  return (
    <div className="card flex flex-col gap-1 px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
        <span
          className={`flex items-center gap-0.5 font-mono-data text-xs font-semibold ${
            isUp ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {isUp ? "▲" : "▼"} %{numberFmt.format(Math.abs(item.changePercent))}
        </span>
      </div>
      <p className="font-mono-data text-xl font-bold text-ink">
        {numberFmt.format(item.sell)} <span className="text-xs font-normal text-ink-muted">TL</span>
      </p>
      <p className="font-mono-data text-[11px] text-ink-muted">Alış {numberFmt.format(item.buy)}</p>
    </div>
  );
}

function SkeletonBox() {
  return <div className="card h-[86px] animate-pulse bg-surface2" />;
}

export default function MarketRatesStrip() {
  const [data, setData] = useState<MarketRates | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/kurlar", { cache: "no-store" });
        if (!res.ok) throw new Error("bad response");
        const json = (await res.json()) as MarketRates;
        if (!cancelled) {
          setData(json);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    const id = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const lastUpdateLabel = data?.updatedAt ? data.updatedAt.slice(11, 16) : null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 font-display text-lg font-bold">
          <ChartIcon className="h-5 w-5 text-blueprint" />
          Güncel Kurlar
        </h2>
        <span className="flex items-center gap-1.5 text-xs text-ink-muted">
          <span
            className={`h-1.5 w-1.5 rounded-full ${error ? "bg-red-500" : "bg-emerald-500"} ${
              error ? "" : "animate-pulse"
            }`}
          />
          {error ? "Bağlantı sorunu" : lastUpdateLabel ? `Son güncelleme: ${lastUpdateLabel}` : "Yükleniyor..."}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {data ? (
          <>
            <RateBox label="USD" item={data.usd} />
            <RateBox label="EUR" item={data.eur} />
            <RateBox label="GBP" item={data.gbp} />
            <RateBox label="Gram Altın" item={data.gramAltin} />
          </>
        ) : (
          <>
            <SkeletonBox />
            <SkeletonBox />
            <SkeletonBox />
            <SkeletonBox />
          </>
        )}
      </div>
    </div>
  );
}
