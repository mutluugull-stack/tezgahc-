"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useFavorites } from "./FavoritesProvider";
import { HeartIcon } from "./Icons";

export default function FavoriteButton({
  listingId,
  size = "md",
}: {
  listingId: string;
  size?: "sm" | "md";
}) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { isFavorited, toggle } = useFavorites();
  const favorited = isFavorited(listingId);

  const dims = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const pad = size === "sm" ? "p-1.5" : "p-2";

  return (
    <button
      type="button"
      aria-label={favorited ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={favorited}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (status !== "authenticated") {
          router.push(`/giris?callbackUrl=${encodeURIComponent(pathname || "/")}`);
          return;
        }
        toggle(listingId);
      }}
      className={`${pad} rounded-full bg-surface/90 text-ink shadow-sm backdrop-blur transition-colors hover:text-red-500 ${
        favorited ? "text-red-500" : ""
      }`}
    >
      <HeartIcon filled={favorited} className={dims} />
    </button>
  );
}
