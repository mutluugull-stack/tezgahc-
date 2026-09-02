import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants";
import { CategoryIcon, SearchIcon, TruckIcon, WrenchIcon } from "@/components/Icons";
import ListingCard from "@/components/ListingCard";
import EmptyState from "@/components/EmptyState";

export const revalidate = 30;

async function getLandingData() {
  const [vitrinListings, activeCount, dealerCount] = await Promise.all([
    prisma.listing.findMany({
      where: { isSold: false, isVitrin: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { images: { take: 1, orderBy: { order: "asc" } }, seller: { select: { accountType: true } } },
    }),
    prisma.listing.count({ where: { isSold: false } }),
    prisma.user.count({ where: { accountType: "BAYI", approved: true } }),
  ]);

  let showcase = vitrinListings;
  if (showcase.length < 4) {
    const fallback = await prisma.listing.findMany({
      where: { isSold: false },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { images: { take: 1, orderBy: { order: "asc" } }, seller: { select: { accountType: true } } },
    });
    showcase = fallback;
  }

  return { showcase, activeCount, dealerCount };
}

export default async function LandingPage() {
  const { showcase, activeCount, dealerCount } = await getLandingData();

  return (
    <div>
      <section className="border-b border-border bg-surface2">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-blueprint">
              Türkiye&apos;nin CNC Makine Pazarı
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">
              Tezgahınızı bulun, ilanınızı verin
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-ink-muted">
              CNC torna, freze, router, lazer, plazma, EDM ve abkant pres tezgahları için alıcı ve
              satıcıları buluşturan ilan platformu.
            </p>
          </div>

          <form
            action="/ilanlar"
            method="get"
            className="card mx-auto mt-8 flex max-w-3xl flex-col gap-2 p-2.5 shadow-sm sm:flex-row"
          >
            <select
              name="category"
              defaultValue="all"
              className="input rounded-lg px-3 py-2.5 text-sm sm:w-56"
              aria-label="Kategori seçin"
            >
              <option value="all">Tüm Kategoriler</option>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="q"
              placeholder="Marka, model veya anahtar kelime ara..."
              className="input flex-1 rounded-lg px-3 py-2.5 text-sm"
            />
            <button type="submit" className="btn-accent flex items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold">
              <SearchIcon className="h-4 w-4" />
              Ara
            </button>
          </form>

          <div className="mx-auto mt-8 flex max-w-lg justify-around text-center">
            <div>
              <p className="font-mono-data text-2xl font-bold text-blueprint">{activeCount}+</p>
              <p className="text-xs text-ink-muted">Aktif İlan</p>
            </div>
            <div>
              <p className="font-mono-data text-2xl font-bold text-blueprint">{dealerCount}+</p>
              <p className="text-xs text-ink-muted">Onaylı Bayi</p>
            </div>
            <div>
              <p className="font-mono-data text-2xl font-bold text-blueprint">{CATEGORIES.length}</p>
              <p className="text-xs text-ink-muted">Kategori</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/ilanlar?category=${c.key}`}
              className="card flex flex-col items-center gap-2 px-3 py-4 text-center transition-shadow hover:shadow-md"
            >
              <CategoryIcon category={c.key} className="h-7 w-7 text-blueprint" />
              <span className="text-xs font-medium leading-tight">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Vitrin İlanlar</h2>
          <Link href="/ilanlar" className="text-sm font-medium text-blueprint hover:underline">
            Tüm ilanları gör →
          </Link>
        </div>
        {showcase.length === 0 ? (
          <EmptyState title="Henüz vitrin ilanı yok" description="İlk ilanı siz verin, burada öne çıksın." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {showcase.map((l) => (
              <ListingCard
                key={l.id}
                listing={{
                  ...l,
                  createdAt: l.createdAt.toISOString(),
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-1 font-display text-2xl font-bold">Hizmet İlanları</h2>
        <p className="mb-4 text-sm text-ink-muted">Tezgah taşıma ve teknik servis için güvenilir çözüm ortakları.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card relative flex items-start gap-4 p-5">
            <span className="absolute right-3 top-3 rounded-full bg-surface2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
              Reklam
            </span>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blueprint/10 text-blueprint">
              <TruckIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Ağır Tezgah Nakliyesi</h3>
              <p className="mt-1 text-sm text-ink-muted">
                CNC tezgahlarınızı sigortalı, vinçli ve uzman ekiple güvenle taşıyoruz. Türkiye
                geneli hizmet.
              </p>
              <a href="tel:+902120000000" className="mt-3 inline-block text-sm font-semibold text-blueprint hover:underline">
                Teklif alın →
              </a>
            </div>
          </div>
          <div className="card relative flex items-start gap-4 p-5">
            <span className="absolute right-3 top-3 rounded-full bg-surface2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
              Reklam
            </span>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <WrenchIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">CNC Teknik Servis</h3>
              <p className="mt-1 text-sm text-ink-muted">
                Kalibrasyon, kontrolör arızaları ve periyodik bakım için yetkili teknik servis
                desteği.
              </p>
              <a href="tel:+902120000001" className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
                Teklif alın →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
