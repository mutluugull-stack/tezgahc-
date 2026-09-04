import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { fmtDate } from "@/lib/constants";
import { CheckIcon, PhoneIcon } from "@/components/Icons";
import DealerProfileGrid, { type DealerGridListing } from "@/components/DealerProfileGrid";

export const dynamic = "force-dynamic";

async function getDealer(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      accountType: true,
      parentDealerId: true,
      approved: true,
      companyName: true,
      fullName: true,
      city: true,
      phone: true,
      logoUrl: true,
      bio: true,
      createdAt: true,
    },
  });
  // Yalnızca onaylı bayi HESAP SAHİPLERİ (ekip üyesi olmayan BAYI hesapları)
  // için herkese açık profil sayfası gösterilir.
  if (!user || user.accountType !== "BAYI" || user.parentDealerId || !user.approved) {
    return null;
  }
  return user;
}

async function getListings(sellerId: string) {
  const listings = await prisma.listing.findMany({
    where: { sellerId },
    orderBy: [{ isSold: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      category: true,
      price: true,
      currency: true,
      isSold: true,
      viewCount: true,
      images: { take: 1, orderBy: { order: "asc" }, select: { url: true } },
    },
  });
  return listings.map(
    (l): DealerGridListing => ({
      id: l.id,
      title: l.title,
      category: l.category,
      price: l.price,
      currency: l.currency,
      isSold: l.isSold,
      viewCount: l.viewCount,
      imageUrl: l.images[0]?.url || null,
    })
  );
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const dealer = await getDealer(params.username);
  if (!dealer) return { title: "Bayi Bulunamadı | Tezgahçı" };
  const name = dealer.companyName || dealer.fullName || dealer.username;
  return {
    title: `${name} | Tezgahçı Bayi Profili`,
    description: dealer.bio || `${name} firmasının CNC tezgah ve makine ilanlarını Tezgahçı'da inceleyin.`,
  };
}

export default async function DealerProfilePage({ params }: { params: { username: string } }) {
  const dealer = await getDealer(params.username);
  if (!dealer) notFound();

  const listings = await getListings(dealer.id);
  const activeListings = listings.filter((l) => !l.isSold);
  const soldListings = listings.filter((l) => l.isSold);
  const totalViews = listings.reduce((sum, l) => sum + l.viewCount, 0);

  const displayName = dealer.companyName || dealer.fullName || dealer.username;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: displayName,
    url: `https://www.tezgahci.com.tr/bayi/${dealer.username}`,
    ...(dealer.logoUrl ? { logo: dealer.logoUrl } : {}),
    ...(dealer.city ? { address: { "@type": "PostalAddress", addressLocality: dealer.city, addressCountry: "TR" } } : {}),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="card p-5 sm:p-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          {dealer.logoUrl ? (
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border border-border bg-white sm:h-28 sm:w-28">
              <Image src={dealer.logoUrl} alt={displayName} fill className="object-contain" />
            </div>
          ) : (
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-blueprint text-3xl font-bold text-white sm:h-28 sm:w-28">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
              <h1 className="font-display text-xl font-bold sm:text-2xl">{displayName}</h1>
              <span className="flex items-center gap-1 rounded-full bg-blueprint/10 px-2 py-0.5 text-[11px] font-semibold text-blueprint">
                <CheckIcon className="h-3 w-3" strokeWidth={2.4} />
                Onaylı Bayi
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-muted">
              {dealer.city || "Konum belirtilmemiş"} · {fmtDate(dealer.createdAt)} tarihinden beri Tezgahçı&apos;da
            </p>

            {dealer.bio && (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink">{dealer.bio}</p>
            )}

            {dealer.phone && (
              <a
                href={`tel:${dealer.phone.replace(/\s+/g, "")}`}
                className="btn-accent mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"
              >
                <PhoneIcon className="h-4 w-4" />
                {dealer.phone}
              </a>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5">
          {[
            { label: "Aktif İlan", value: activeListings.length },
            { label: "Satılan İlan", value: soldListings.length },
            { label: "Görüntülenme", value: totalViews },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-mono-data text-xl font-bold text-blueprint sm:text-2xl">{s.value}</p>
              <p className="text-[11px] text-ink-muted sm:text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <DealerProfileGrid activeListings={activeListings} soldListings={soldListings} />
      </div>
    </div>
  );
}
