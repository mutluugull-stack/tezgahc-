import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.tezgahci.com.tr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await prisma.listing.findMany({
    where: { isSold: false },
    select: { id: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/ilanlar`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/ilan-ver`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/kayit`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/giris`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/gizlilik`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/kullanim-sartlari`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const listingRoutes: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${BASE_URL}/ilan/${l.id}`,
    lastModified: l.updatedAt,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...listingRoutes];
}
