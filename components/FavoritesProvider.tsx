"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type FavoritesContextValue = {
  ids: Set<string>;
  ready: boolean;
  isFavorited: (listingId: string) => boolean;
  toggle: (listingId: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setIds(new Set());
      setReady(status !== "loading");
      return;
    }
    let cancelled = false;
    fetch("/api/favorites/ids")
      .then((r) => (r.ok ? r.json() : { ids: [] }))
      .then((data) => {
        if (!cancelled) setIds(new Set<string>(data.ids || []));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  const isFavorited = useCallback((listingId: string) => ids.has(listingId), [ids]);

  const toggle = useCallback(
    async (listingId: string) => {
      if (status !== "authenticated") return;
      const wasFavorited = ids.has(listingId);
      // İyimser (optimistic) güncelleme: önce arayüzü değiştir, sonra isteği gönder.
      setIds((prev) => {
        const next = new Set(prev);
        if (wasFavorited) next.delete(listingId);
        else next.add(listingId);
        return next;
      });
      try {
        if (wasFavorited) {
          await fetch(`/api/favorites/${listingId}`, { method: "DELETE" });
        } else {
          await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listingId }),
          });
        }
      } catch {
        // İstek başarısız olursa önceki duruma geri al.
        setIds((prev) => {
          const next = new Set(prev);
          if (wasFavorited) next.add(listingId);
          else next.delete(listingId);
          return next;
        });
      }
    },
    [ids, status]
  );

  return (
    <FavoritesContext.Provider value={{ ids, ready, isFavorited, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites, FavoritesProvider içinde kullanılmalı.");
  }
  return ctx;
}
