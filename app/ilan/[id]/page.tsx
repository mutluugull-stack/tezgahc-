import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MachineArt from "@/components/MachineArt";
import { catLabel, conditionLabel, currencySymbol, fmtDate, fmtPrice } from "@/lib/constants";
import ListingActions from "@/components/ListingActions";

export const dynamic = "force-dynamic";

async function getListing(id: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      seller: {
        select: {
          id: true,
          username: true,
          accountType: true,
          companyName: true,
          fullName: true,
          city: true,
          phone: true,
          createdAt: true,
        },
      },
    },
  });
  if (!listing) return null;

  prisma.listing.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
  return listing;
}

const SPEC_ROWS: { key: string; label: string }[] = [
  { key: "brand", label: "Marka" },
  { key: "model", label: "Model" },
  { key: "year", label: "Üretim Yılı" },
  { key: "controller", label: "Kontrolör" },
  { key: "axisCount", label: "Eksen Sayısı" },
  { key: "workArea", label: "Çalışma Alanı" },
];

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);
  if (!listing) notFound();

  const sellerName = listing.seller.companyName || listing.seller.fullName || listing.seller.username;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link href="/ilanlar" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        ← Tüm ilanlara dön
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="card relative aspect-[4/3] w-full overflow-hidden">
            {listing.images[0] ? (
              <Image src={listing.images[0].url} alt={listing.title} fill className="object-cover" priority />
            ) : (
              <MachineArt category={listing.category} />
            )}
            {listing.isSold && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                <span className="rounded-full border-2 border-white px-4 py-1.5 text-base font-bold uppercase tracking-wider text-white">
                  Satıldı
                </span>
              </div>
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="mt-2 grid grid-cols-5 gap-2">
              {listing.images.slice(1, 6).map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                  <Image src={img.url} alt={listing.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="card mt-5 p-5">
            <h2 className="mb-3 font-display text-lg font-semibold">Açıklama</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-muted">{listing.description}</p>
          </div>

          <div className="card mt-5 overflow-hidden">
            <h2 className="border-b border-border p-4 font-display text-lg font-semibold">Teknik Özellikler</h2>
            <table className="w-full text-sm">
              <tbody>
                {SPEC_ROWS.map((row) => {
                  const value = (listing as any)[row.key];
                  if (!value) return null;
                  return (
                    <tr key={row.key} className="border-b border-border last:border-0">
                      <td className="w-1/3 bg-surface2 px-4 py-2.5 font-medium text-ink-muted">{row.label}</td>
                      <td className="px-4 py-2.5 font-mono-data">{value}</td>
                    </tr>
                  );
                })}
                <tr className="border-b border-border last:border-0">
                  <td className="w-1/3 bg-surface2 px-4 py-2.5 font-medium text-ink-muted">Durum</td>
                  <td className="px-4 py-2.5">{conditionLabel(listing.condition)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="card p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-blueprint">
              {catLabel(listing.category)}
            </span>
            <h1 className="mt-1 font-display text-2xl font-bold leading-tight">{listing.title}</h1>
            <p className="font-mono-data mt-3 text-3xl font-bold text-blueprint">
              {fmtPrice(listing.price, listing.currency)}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              {listing.city} · {fmtDate(listing.createdAt)} · {listing.viewCount} görüntülenme
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border p-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blueprint text-sm font-bold text-white">
                {sellerName.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{sellerName}</p>
                <p className="text-xs text-ink-muted">
                  {listing.seller.accountType === "BAYI" ? "Yetkili Bayi" : "Bireysel Satıcı"} ·{" "}
                  {listing.seller.city || "—"}
                </p>
              </div>
            </div>

            <ListingActions
              listingId={listing.id}
              sellerId={listing.seller.id}
              isSold={listing.isSold}
              isVitrin={listing.isVitrin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
