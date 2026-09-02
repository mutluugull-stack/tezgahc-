import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, CITIES, CONDITIONS } from "@/lib/constants";
import { ListViewIcon, GridViewIcon } from "@/components/Icons";
import ListingCard from "@/components/ListingCard";
import ListingRow from "@/components/ListingRow";
import EmptyState from "@/components/EmptyState";
import SortSelect from "@/components/SortSelect";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  category?: string;
  city?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  onlyDealer?: string;
  sort?: string;
  view?: string;
};

function buildQuery(params: SearchParams, overrides: Partial<SearchParams>) {
  const merged = { ...params, ...overrides };
  const sp = new URLSearchParams();
  Object.entries(merged).forEach(([k, v]) => {
    if (v && v !== "all") sp.set(k, v);
  });
  const qs = sp.toString();
  return qs ? `/ilanlar?${qs}` : "/ilanlar";
}

async function getListings(sp: SearchParams) {
  const where: any = { isSold: false };
  if (sp.category && sp.category !== "all") where.category = sp.category;
  if (sp.city && sp.city !== "all") where.city = sp.city;
  if (sp.condition && sp.condition !== "all") where.condition = sp.condition;
  if (sp.onlyDealer === "1") where.seller = { accountType: "BAYI" };
  if (sp.minPrice || sp.maxPrice) {
    where.price = {};
    if (sp.minPrice) where.price.gte = Number(sp.minPrice);
    if (sp.maxPrice) where.price.lte = Number(sp.maxPrice);
  }
  if (sp.q) {
    where.OR = [
      { title: { contains: sp.q, mode: "insensitive" } },
      { brand: { contains: sp.q, mode: "insensitive" } },
      { model: { contains: sp.q, mode: "insensitive" } },
      { description: { contains: sp.q, mode: "insensitive" } },
    ];
  }

  const orderBy =
    sp.sort === "price_asc"
      ? { price: "asc" as const }
      : sp.sort === "price_desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  return prisma.listing.findMany({
    where,
    orderBy,
    take: 120,
    include: {
      images: { take: 1, orderBy: { order: "asc" } },
      seller: { select: { accountType: true } },
    },
  });
}

export default async function ListingsPage({ searchParams }: { searchParams: SearchParams }) {
  const listings = await getListings(searchParams);
  const view = searchParams.view === "grid" ? "grid" : "list";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-5 font-display text-2xl font-bold sm:text-3xl">CNC Makine İlanları</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="card h-fit p-4 lg:sticky lg:top-20">
          <form method="get" action="/ilanlar" className="flex flex-col gap-4">
            <input type="hidden" name="sort" value={searchParams.sort || "date_desc"} />
            <input type="hidden" name="view" value={view} />

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Anahtar Kelime
              </label>
              <input
                type="text"
                name="q"
                defaultValue={searchParams.q || ""}
                placeholder="Marka, model..."
                className="input w-full rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Kategori
              </label>
              <select
                name="category"
                defaultValue={searchParams.category || "all"}
                className="input w-full rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">Tümü</option>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Şehir
              </label>
              <select
                name="city"
                defaultValue={searchParams.city || "all"}
                className="input w-full rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">Tümü</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Durum
              </label>
              <select
                name="condition"
                defaultValue={searchParams.condition || "all"}
                className="input w-full rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">Tümü</option>
                {CONDITIONS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Fiyat Aralığı (₺)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="minPrice"
                  defaultValue={searchParams.minPrice || ""}
                  placeholder="Min"
                  className="input w-full rounded-lg px-3 py-2 text-sm"
                />
                <span className="text-ink-muted">–</span>
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={searchParams.maxPrice || ""}
                  placeholder="Max"
                  className="input w-full rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="onlyDealer"
                value="1"
                defaultChecked={searchParams.onlyDealer === "1"}
                className="h-4 w-4 rounded"
              />
              Sadece Bayi İlanları
            </label>

            <div className="flex gap-2">
              <button type="submit" className="btn-accent flex-1 rounded-lg px-3 py-2 text-sm font-semibold">
                Filtrele
              </button>
              <Link
                href="/ilanlar"
                className="input flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium"
              >
                Temizle
              </Link>
            </div>
          </form>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-muted">
              <span className="font-mono-data font-semibold text-ink">{listings.length}</span> ilan bulundu
            </p>
            <div className="flex items-center gap-3">
              <SortSelect defaultValue={searchParams.sort || "date_desc"} />
              <div className="flex overflow-hidden rounded-lg border border-border">
                <Link
                  href={buildQuery(searchParams, { view: "list" })}
                  className={`flex h-8 w-9 items-center justify-center ${
                    view === "list" ? "bg-blueprint text-white" : "bg-surface text-ink-muted"
                  }`}
                  aria-label="Liste görünümü"
                >
                  <ListViewIcon className="h-4 w-4" />
                </Link>
                <Link
                  href={buildQuery(searchParams, { view: "grid" })}
                  className={`flex h-8 w-9 items-center justify-center ${
                    view === "grid" ? "bg-blueprint text-white" : "bg-surface text-ink-muted"
                  }`}
                  aria-label="Izgara görünümü"
                >
                  <GridViewIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {listings.length === 0 ? (
            <EmptyState
              title="Aradığınız kriterlere uygun ilan bulunamadı"
              description="Filtreleri genişletmeyi veya farklı bir kategori denemeyi deneyin."
            />
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={{ ...l, createdAt: l.createdAt.toISOString() }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {listings.map((l) => (
                <ListingRow key={l.id} listing={{ ...l, createdAt: l.createdAt.toISOString() }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
