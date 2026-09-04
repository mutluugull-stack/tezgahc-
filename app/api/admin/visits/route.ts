import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const MONTH_LABELS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

function lastNDaysBuckets(n: number) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const buckets: { label: string; from: Date; to: Date }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const from = new Date(todayStart);
    from.setDate(from.getDate() - i);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);
    buckets.push({ label: `${from.getDate()} ${MONTH_LABELS[from.getMonth()]}`, from, to });
  }
  return buckets;
}

function referrerHost(referrer: string | null) {
  if (!referrer) return "Doğrudan / Bilinmiyor";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "Doğrudan / Bilinmiyor";
  }
}

// GET /api/admin/visits -> yönetici panelindeki "Ziyaretler" sayfası için
// site trafiği özeti (son 30 günlük ziyaret kayıtlarından hesaplanır).
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

const since30 = new Date();
  since30.setDate(since30.getDate() - 30);

const visits = await prisma.pageVisit.findMany({
  where: { createdAt: { gte: since30 } },
  select: { path: true, referrer: true, createdAt: true },
});

const buckets = lastNDaysBuckets(14);
  const visitsByDay = buckets.map((b) => ({
    label: b.label,
    count: visits.filter((v) => v.createdAt >= b.from && v.createdAt < b.to).length,
  }));

const pathCounts = new Map<string, number>();
  for (const v of visits) pathCounts.set(v.path, (pathCounts.get(v.path) || 0) + 1);
  const topPages = [...pathCounts.entries()]
  .map(([path, count]) => ({ path, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 10);

const referrerCounts = new Map<string, number>();
  for (const v of visits) {
    const host = referrerHost(v.referrer);
    referrerCounts.set(host, (referrerCounts.get(host) || 0) + 1);
  }
  const topReferrers = [...referrerCounts.entries()]
  .map(([source, count]) => ({ source, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 8);

const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const since7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

return NextResponse.json({
  totals: {
    today: visits.filter((v) => v.createdAt >= todayStart).length,
    last7Days: visits.filter((v) => v.createdAt >= since7).length,
    last30Days: visits.length,
  },
  visitsByDay,
  topPages,
  topReferrers,
});
}
