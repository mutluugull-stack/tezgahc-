import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLACEMENTS } from "@/lib/adValidation";

export const dynamic = "force-dynamic";

// Efraimidis-Spirakis ağırlıklı rastgele örnekleme (yerine koymadan):
// her öğeye key = u^(1/ağırlık) atanır, en büyük key'e sahip n öğe seçilir.
// Öncelik (priority) değeri yüksek reklamlar istatistiksel olarak daha sık,
// ama tekdüze olmayan biçimde (rotasyon) seçilir.
function weightedSample<T extends { priority: number }>(items: T[], n: number): T[] {
  const withKeys = items.map((it) => {
    const w = Math.max(1, it.priority);
    const u = Math.max(Math.random(), 1e-9);
    return { it, key: Math.pow(u, 1 / w) };
  });
  withKeys.sort((a, b) => b.key - a.key);
  return withKeys.slice(0, n).map((x) => x.it);
}

// GET /api/ads/serve?placement=X&category=Y&limit=N -> gösterilecek aktif
// reklam(lar)ı seçer. Herkese açık (giriş gerektirmez).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get("placement");
  const category = searchParams.get("category") || undefined;
  const limitRaw = Number(searchParams.get("limit") || "1");
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(Math.trunc(limitRaw), 1), 6) : 1;

  if (!placement || !(PLACEMENTS as readonly string[]).includes(placement)) {
    return NextResponse.json({ error: "Geçersiz reklam alanı." }, { status: 400 });
  }

  const now = new Date();
  const candidates = await prisma.ad.findMany({
    where: {
      placement: placement as (typeof PLACEMENTS)[number],
      active: true,
      AND: [
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        category ? { OR: [{ category: null }, { category }] } : { category: null },
      ],
    },
    select: {
      id: true,
      advertiserName: true,
      imageUrlDesktop: true,
      imageUrlMobile: true,
      altText: true,
      targetUrl: true,
      priority: true,
    },
  });

  const selected = weightedSample(candidates, limit).map(({ priority, ...ad }) => ad);

  return NextResponse.json({ ads: selected });
}
