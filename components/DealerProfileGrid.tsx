"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MachineArt from "./MachineArt";
import { fmtPrice } from "@/lib/constants";
import { EyeIcon } from "./Icons";
import { DEFAULT_LOCALE, t, type Locale } from "@/lib/i18n/translations";

export type DealerGridListing = {
  id: string;
  title: string;
  category: string;
  price: number;
  currency: string;
  isSold: boolean;
  viewCount: number;
  imageUrl: string | null;
};

function GridTile({ listing, locale }: { listing: DealerGridListing; locale: Locale }) {
  return (
    <Link
      href={`/ilan/${listing.id}`}
      className="group relative block aspect-square overflow-hidden rounded-lg border border-border bg-surface2"
    >
      {listing.imageUrl ? (
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(min-width:1024px) 20vw, 33vw"
        />
      ) : (
        <MachineArt category={listing.category} />
      )}
      {listing.isSold && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/55">
          <span className="rounded-full border border-white/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
            {t("dealerProfile.soldBadge", locale)}
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4">
        <span className="font-mono-data truncate text-[11px] font-bold text-white">
          {fmtPrice(listing.price, listing.currency)}
        </span>
        <span className="flex flex-shrink-0 items-center gap-0.5 text-[10px] text-white/85">
          <EyeIcon className="h-3 w-3" />
          {listing.viewCount}
        </span>
      </div>
    </Link>
  );
}

export default function DealerProfileGrid({
  activeListings,
  soldListings,
  locale = DEFAULT_LOCALE,
}: {
  activeListings: DealerGridListing[];
  soldListings: DealerGridListing[];
  locale?: Locale;
}) {
  const [tab, setTab] = useState<"aktif" | "satilan">("aktif");
  const list = tab === "aktif" ? activeListings : soldListings;

  return (
    <div>
      <div className="mb-4 flex border-t border-border">
        {(
          [
            { key: "aktif" as const, label: t("dealerProfile.tabActive", locale).replace("{n}", String(activeListings.length)) },
            { key: "satilan" as const, label: t("dealerProfile.tabSold", locale).replace("{n}", String(soldListings.length)) },
          ]
        ).map((tabItem) => (
          <button
            key={tabItem.key}
            type="button"
            onClick={() => setTab(tabItem.key)}
            className={`flex-1 border-t-2 py-3 text-center text-xs font-semibold uppercase tracking-wide transition-colors sm:text-sm ${
              tab === tabItem.key
                ? "border-blueprint text-blueprint"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-muted">
          {tab === "aktif" ? t("dealerProfile.emptyActive", locale) : t("dealerProfile.emptySold", locale)}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2">
          {list.map((l) => (
            <GridTile key={l.id} listing={l} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
