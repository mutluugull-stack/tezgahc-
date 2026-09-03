import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const MONTH_LABELS = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
];

function lastNMonthsBuckets(n: number) {
  const now = new Date();
  const buckets: { key: string; label: string; from: Date; to: Date }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const from = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const to = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    buckets.push({
      key: `${from.getFullYear()}-${from.getMonth()}`,
      label: `${MONTH_LABELS[from.getMonth()]} ${from.getFullYear()}`,
      from,
      to,
    });
  }
  return buckets;
}

// GET /api/admin/reports -> pazar yeri genel raporları (yönetici paneli)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const [listings, users] = await Promise.all([
    prisma.listing.findMany({
      select: { createdAt: true, city: true, category: true, price: true, currency: true, isSold: true },
    }),
    prisma.user.findMany({ select: { createdAt: true, accountType: true } }),
  ]);

  const buckets = lastNMonthsBuckets(6);
  const listingsByMonth = buckets.map((b) => ({
    label: b.label,
    count: listings.filter((l) => l.createdAt >= b.from && l.createdAt < b.to).length,
  }));
  const usersByMonth = buckets.map((b) => ({
    label: b.label,
    count: users.filter((u) => u.createdAt >= b.from && u.createdAt < b.to).length,
  }));

  const cityCounts = new Map<string, number>();
  for (const l of listings) cityCounts.set(l.city, (cityCounts.get(l.city) || 0) + 1);
  const topCities = [...cityCounts.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Kabaca TL bazlı ortalama fiyat (kur farklarını görmezden gelerek, yalnızca genel eğilim için)
  const tryListings = listings.filter((l) => l.currency === "TRY" && l.price > 0);
  const avgPrice = tryListings.length
    ? Math.round(tryListings.reduce((sum, l) => sum + l.price, 0) / tryListings.length)
    : 0;

  return NextResponse.json({
    listingsByMonth,
    usersByMonth,
    topCities,
    avgPriceTRY: avgPrice,
    totals: {
      listings: listings.length,
      soldListings: listings.filter((l) => l.isSold).length,
      users: users.length,
      dealers: users.filter((u) => u.accountType === "BAYI").length,
    },
  });
}
