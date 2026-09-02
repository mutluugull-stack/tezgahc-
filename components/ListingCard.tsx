import Link from "next/link";
import Image from "next/image";
import MachineArt from "./MachineArt";
import { catLabel, fmtDate, fmtPrice } from "@/lib/constants";

type ListingCardData = {
  id: string;
  title: string;
  category: string;
  city: string;
  price: number;
  currency: string;
  condition: string;
  isSold: boolean;
  isVitrin: boolean;
  createdAt: string | Date;
  images?: { url: string }[];
  seller?: { accountType: string } | null;
};

export default function ListingCard({ listing }: { listing: ListingCardData }) {
  const cover = listing.images?.[0]?.url;
  return (
    <Link
      href={`/ilan/${listing.id}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full">
        {cover ? (
          <Image src={cover} alt={listing.title} fill className="object-cover" sizes="(min-width:1024px) 25vw, 50vw" />
        ) : (
          <MachineArt category={listing.category} />
        )}
        <div className="absolute left-2 top-2 flex gap-1.5">
          {listing.isVitrin && !listing.isSold && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-ink">
              Vitrin
            </span>
          )}
          {listing.seller?.accountType === "BAYI" && (
            <span className="rounded-full bg-blueprint px-2 py-0.5 text-[11px] font-semibold text-white">
              Bayi
            </span>
          )}
        </div>
        {listing.isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="rounded-full border-2 border-white px-3 py-1 text-sm font-bold uppercase tracking-wider text-white">
              Satıldı
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
          {catLabel(listing.category)}
        </span>
        <h3 className="line-clamp-2 font-display text-base font-semibold leading-tight">{listing.title}</h3>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="font-mono-data text-lg font-bold text-blueprint">
              {fmtPrice(listing.price, listing.currency)}
            </p>
            <p className="text-xs text-ink-muted">
              {listing.city} · {fmtDate(listing.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
