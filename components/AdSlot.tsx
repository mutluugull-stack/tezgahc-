"use client";

import { useEffect, useRef, useState } from "react";

type Ad = {
  id: string;
  advertiserName: string;
  imageUrlDesktop: string;
  imageUrlMobile: string | null;
  altText: string;
  targetUrl: string;
};

export type SingleAdPlacement =
  | "HOME_SEARCH_BANNER"
  | "HOME_AFTER_VITRIN"
  | "LISTING_TOP_BANNER"
  | "LISTING_INFEED"
  | "LISTING_SIDEBAR";

const ASPECT: Record<SingleAdPlacement, string> = {
  HOME_SEARCH_BANNER: "aspect-[4/1] sm:aspect-[8/1]",
  HOME_AFTER_VITRIN: "aspect-[4/1] sm:aspect-[8/1]",
  LISTING_TOP_BANNER: "aspect-[4/1] sm:aspect-[8/1]",
  LISTING_INFEED: "aspect-[4/1] sm:aspect-[8/1]",
  LISTING_SIDEBAR: "aspect-[1/2]",
};

/**
 * Belirli bir alandaki (placement) tek bir reklamı sunucudan çeker, gerçekten
 * ekranda göründüğünde (IntersectionObserver, sayfa görüntülemesi başına bir
 * kez) gösterim sayar ve tıklamada tıklama sayısını artırıp yeni sekmede
 * hedef bağlantıyı açar. Aktif reklam yoksa hiçbir şey render etmez (boşluk
 * bırakmaz); yüklenirken sayfa kaymasını önlemek için kısa süreliğine aynı
 * ölçüde nötr bir yer tutucu gösterir.
 */
export default function AdSlot({
  placement,
  category,
  className = "",
}: {
  placement: SingleAdPlacement;
  category?: string;
  className?: string;
}) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loaded, setLoaded] = useState(false);
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const firedImpression = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const qs = new URLSearchParams({ placement });
    if (category) qs.set("category", category);
    fetch(`/api/ads/serve?${qs.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        setAd(data?.ads?.[0] || null);
      })
      .catch(() => {
        if (!cancelled) setAd(null);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [placement, category]);

  useEffect(() => {
    if (!ad || !anchorRef.current) return;
    const el = anchorRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedImpression.current) {
            firedImpression.current = true;
            fetch(`/api/ads/${ad.id}/impression`, { method: "POST" }).catch(() => {});
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ad]);

  function handleClick() {
    if (!ad) return;
    fetch(`/api/ads/${ad.id}/click`, { method: "POST" }).catch(() => {});
  }

  if (!loaded) {
    return (
      <div className={className}>
        <div className={`w-full animate-pulse rounded-xl bg-surface2 ${ASPECT[placement]}`} />
      </div>
    );
  }

  if (!ad) return null;

  return (
    <div className={className}>
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
        Sponsorlu
      </span>
      <a
        ref={anchorRef}
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        title={ad.advertiserName}
        className={`block w-full overflow-hidden rounded-xl border border-border bg-surface2 ${ASPECT[placement]}`}
      >
        <picture>
          {ad.imageUrlMobile && <source media="(max-width: 639px)" srcSet={ad.imageUrlMobile} />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ad.imageUrlDesktop} alt={ad.altText} className="h-full w-full object-cover" />
        </picture>
      </a>
    </div>
  );
}
