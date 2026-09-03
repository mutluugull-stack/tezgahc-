"use client";

import { useEffect, useRef, useState } from "react";
import { TruckIcon } from "./Icons";

type Ad = {
  id: string;
  advertiserName: string;
  imageUrlDesktop: string;
  imageUrlMobile: string | null;
  altText: string;
  targetUrl: string;
};

function ServiceCard({ ad }: { ad: Ad }) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (!anchorRef.current) return;
    const el = anchorRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.current) {
            fired.current = true;
            fetch(`/api/ads/${ad.id}/impression`, { method: "POST" }).catch(() => {});
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ad.id]);

  return (
    <a
      ref={anchorRef}
      href={ad.targetUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => fetch(`/api/ads/${ad.id}/click`, { method: "POST" }).catch(() => {})}
      className="card relative flex items-start gap-4 p-5 transition-shadow hover:shadow-md"
    >
      <span className="absolute right-3 top-3 rounded-full bg-surface2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
        Reklam
      </span>
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blueprint/10">
        {ad.imageUrlDesktop ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ad.imageUrlDesktop} alt={ad.altText} className="h-full w-full object-cover" />
        ) : (
          <TruckIcon className="h-6 w-6 text-blueprint" />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-lg font-semibold">{ad.advertiserName}</h3>
        <p className="mt-1 text-sm text-ink-muted">{ad.altText}</p>
        <span className="mt-3 inline-block text-sm font-semibold text-blueprint hover:underline">
          Teklif alın →
        </span>
      </div>
    </a>
  );
}

/**
 * Ana sayfadaki "Hizmet İlanları" bölümü — nakliye, teknik servis, takım ve
 * ekipman firmaları için sponsorlu kartlar. Aktif reklam yoksa bölümün
 * tamamı gizlenir (boşluk bırakmaz).
 */
export default function HomeServiceCardsSection() {
  const [ads, setAds] = useState<Ad[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ads/serve?placement=HOME_SERVICE_CARD&limit=4")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setAds(data?.ads || []);
      })
      .catch(() => {
        if (!cancelled) setAds([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ads || ads.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-1 font-display text-2xl font-bold">Hizmet İlanları</h2>
      <p className="mb-4 text-sm text-ink-muted">Tezgah taşıma, teknik servis ve ekipman için güvenilir çözüm ortakları.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ads.map((ad) => (
          <ServiceCard key={ad.id} ad={ad} />
        ))}
      </div>
    </section>
  );
}
