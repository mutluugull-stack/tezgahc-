"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import EmptyState from "@/components/EmptyState";
import { HeartIcon } from "@/components/Icons";

type FavListing = {
  id: string;
  title: string;
  category: string;
  city: string;
  price: number;
  currency: string;
  condition: string;
  isSold: boolean;
  isVitrin: boolean;
  createdAt: string;
  images?: { url: string }[];
  seller?: { accountType: string } | null;
};

export default function FavorilerimPage() {
  const { status } = useSession();
  const [listings, setListings] = useState<FavListing[] | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/favorites")
      .then((r) => (r.ok ? r.json() : { listings: [] }))
      .then((data) => setListings(data.listings || []))
      .catch(() => setListings([]));
  }, [status]);

  if (status === "loading") {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-center text-ink-muted">Yükleniyor...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">Favorilerinizi görmek için giriş yapın</h1>
        <p className="mb-5 text-sm text-ink-muted">Beğendiğiniz ilanları favorilere ekleyip buradan takip edin.</p>
        <Link href="/giris?callbackUrl=/favorilerim" className="btn-accent inline-block rounded-lg px-4 py-2 text-sm font-semibold">
          Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-1 flex items-center gap-2 font-display text-2xl font-bold">
        <HeartIcon filled className="h-6 w-6 text-red-500" />
        Favorilerim
      </h1>
      <p className="mb-5 text-sm text-ink-muted">Kalp ikonuyla favorilere eklediğiniz ilanlar burada listelenir.</p>

      {listings === null ? (
        <p className="text-sm text-ink-muted">Yükleniyor...</p>
      ) : listings.length === 0 ? (
        <EmptyState title="Henüz favori ilanınız yok" description="İlan kartlarındaki kalp ikonuna dokunarak favorilerinize ekleyebilirsiniz." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
