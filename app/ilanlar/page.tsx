import { Fragment } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, CITIES, CONDITIONS, CONTROLLERS, AXIS_COUNTS, catLabel, conditionLabel } from "@/lib/constants";
import { ListViewIcon, GridViewIcon } from "@/components/Icons";
import ListingCard from "@/components/ListingCard";
import ListingRow from "@/components/ListingRow";
import EmptyState from "@/components/EmptyState";
import SortSelect from "@/components/SortSelect";
import BrandModelFilterFields from "@/components/BrandModelFilterFields";
import ComboFilterField from "@/components/ComboFilterField";
import AdSlot from "@/components/AdSlot";
import { getLocale } from "@/lib/i18n/locale-server";
import { t } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  brand?: string;
  model?: string;
  controller?: string;
  axisCount?: string;
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
  if (sp.brand) where.brand = { contains: sp.brand, mode: "insensitive" };
  if (sp.model) where.model = { contains: sp.model, mode: "insensitive" };
  if (sp.controller) where.controller = { contains: sp.controller, mode: "insensitive" };
  if (sp.axisCount) where.axisCount = { contains: sp.axisCount, mode: "insensitive" };
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
  const adCategory = searchParams.category && searchParams.category !== "all" ? searchParams.category : undefined;
  const locale = getLocale();
  const tt = (key: Parameters<typeof t>[0]) => t(key, locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-5 font-display text-2xl font-bold sm:text-3xl">{tt("listings.pageTitle")}</h1>

      <AdSlot placement="LISTING_TOP_BANNER" category={adCategory} className="mb-5" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_300px]">
        <aside className="card h-fit p-4 lg:sticky lg:top-20">
          <form method="get" action="/ilanlar" className="flex flex-col gap-4">
            <input type="hidden" name="sort" value={searchParams.sort || "date_desc"} />
            <input type="hidden" name="view" value={view} />

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {tt("listings.keyword")}
              </label>
              <input
                type="text"
                name="q"
                defaultValue={searchParams.q || ""}
                placeholder={tt("listings.keywordPlaceholder")}
                className="input w-full rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <BrandModelFilterFields defaultBrand={searchParams.brand || ""} defaultModel={searchParams.model || ""} />

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {tt("common.category")}
              </label>
              <select
                name="category"
                defaultValue={searchParams.category || "all"}
                className="input w-full rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">{tt("listings.all")}</option>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {catLabel(c.key, locale)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {tt("listings.city")}
              </label>
              <select
                name="city"
                defaultValue={searchParams.city || "all"}
                className="input w-full rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">{tt("listings.all")}</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {tt("listings.condition")}
              </label>
              <select
                name="condition"
                defaultValue={searchParams.condition || "all"}
                className="input w-full rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">{tt("listings.all")}</option>
                {CONDITIONS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {conditionLabel(c.key, locale)}
                  </option>
                ))}
              </select>
            </div>

            <ComboFilterField
              name="controller"
              label={tt("listings.controller")}
              defaultValue={searchParams.controller || ""}
              options={CONTROLLERS}
              placeholder="Fanuc, Siemens..."
            />

            <ComboFilterField
              name="axisCount"
              label={tt("listings.axisCount")}
              defaultValue={searchParams.axisCount || ""}
              options={AXIS_COUNTS}
              placeholder="3 Eksen"
            />

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {tt("listings.priceRange")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="minPrice"
                  defaultValue={searchParams.minPrice || ""}
                  placeholder={tt("listings.min")}
                  className="input w-full rounded-lg px-3 py-2 text-sm"
                />
                <span className="text-ink-muted">–</span>
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={searchParams.maxPrice || ""}
                  placeholder={tt("listings.max")}
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
              {tt("listings.onlyDealer")}
            </label>

            <div className="flex gap-2">
              <button type="submit" className="btn-accent flex-1 rounded-lg px-3 py-2 text-sm font-semibold">
                {tt("listings.filter")}
              </button>
              <Link
                href="/ilanlar"
                className="input flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium"
              >
                {tt("listings.clear")}
              </Link>
            </div>
          </form>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-muted">
              <span className="font-mono-data font-semibold text-ink">{listings.length}</span> {tt("listings.resultsFound")}
            </p>
            <div className="flex items-center gap-3">
              <SortSelect defaultValue={searchParams.sort || "date_desc"} />
              <div className="flex overflow-hidden rounded-lg border border-border">
                <Link
                  href={buildQuery(searchParams, { view: "list" })}
                  className={`flex h-8 w-9 items-center justify-center ${
                    view === "list" ? "bg-blueprint text-white" : "bg-surface text-ink-muted"
                  }`}
                  aria-label={tt("listings.listView")}
                >
                  <ListViewIcon className="h-4 w-4" />
                </Link>
                <Link
                  href={buildQuery(searchParams, { view: "grid" })}
                  className={`flex h-8 w-9 items-center justify-center ${
                    view === "grid" ? "bg-blueprint text-white" : "bg-surface text-ink-muted"
                  }`}
                  aria-label={tt("listings.gridView")}
                >
                  <GridViewIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {listings.length === 0 ? (
            <EmptyState title={tt("listings.emptyTitle")} description={tt("listings.emptyDesc")} />
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {listings.map((l, i) => (
                <Fragment key={l.id}>
                  <ListingCard listing={{ ...l, createdAt: l.createdAt.toISOString() }} locale={locale} />
                  {(i + 1) % 8 === 0 && i !== listings.length - 1 && (
                    <AdSlot
                      placement="LISTING_INFEED"
                      category={adCategory}
                      className="col-span-full"
                    />
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {listings.map((l, i) => (
                <Fragment key={l.id}>
                  <ListingRow listing={{ ...l, createdAt: l.createdAt.toISOString() }} locale={locale} />
                  {(i + 1) % 8 === 0 && i !== listings.length - 1 && (
                    <AdSlot placement="LISTING_INFEED" category={adCategory} />
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-20">
            <AdSlot placement="LISTING_SIDEBAR" category={adCategory} />
          </div>
        </aside>
      </div>
    </div>
  );
}
