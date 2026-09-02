import Link from "next/link";
import Image from "next/image";
import MachineArt from "./MachineArt";
import { catLabel, fmtDate, fmtPrice, conditionLabel } from "@/lib/constants";

type ListingRowData = {
  id: string;
  title: string;
  category: string;
  city: string;
  price: number;
  currency: string;
  condition: string;
  brand?: string | null;
  year?: number | null;
  isSold: boolean;
  isVitrin: boolean;
  createdAt: string | Date;
  images?: { url: string }[];
  seller?: { accountType: string } | null;
};

export default function ListingRow({ listing }: { listing: ListingRowData }) {
  const cover = listing.images?.[0]?.url;
  const specs = [listing.brand, listing.year, conditionLabel(listing.condition)].filter(Boolean).join(" · ");
  return (
    <Link
      href={`/ilan/${listing.id}`}
      className="card flex gap-3 overflow-hidden p-2.5 transition-shadow hover:shadow-md sm:gap-4"
    >
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-32">
        {cover ? (
          <Image src={cover} alt={listing.title} fill className="object-cover" sizes="128px" />
        ) : (
          <MachineArt category={listing.category} />
        )}
        {listing.isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="rounded border border-white px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              Satıldı
            </span>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
            {catLabel(listing.category)}
          </span>
          {listing.isVitrin && !listing.isSold && (
            <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-ink">
              Vitrin
            </span>
          )}
          {listing.seller?.accountType === "BAYI" && (
            <span className="rounded-full bg-blueprint px-1.5 py-0.5 text-[10px] font-semibold text-white">
              Bayi
            </span>
          )}
        </div>
        <h3 className="truncate font-display text-base font-semibold sm:text-lg">{listing.title}</h3>
        {specs && <p className="truncate text-xs text-ink-muted sm:text-sm">{specs}</p>}
      </div>
      <div className="flex flex-shrink-0 flex-col items-end justify-center gap-1 text-right">
        <p className="font-mono-data text-base font-bold text-blueprint sm:text-lg">
          {fmtPrice(listing.price, listing.currency)}
        </p>
        <p className="text-xs text-ink-muted">{listing.city}</p>
        <p className="text-[11px] text-ink-muted">{fmtDate(listing.createdAt)}</p>
      </div>
    </Link>
  );
}
