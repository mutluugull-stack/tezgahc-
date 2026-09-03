import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/ads/[id]/impression -> reklam gerçekten ekranda göründüğünde
// (IntersectionObserver ile, sayfa görüntülemesi başına yalnızca bir kez)
// istemci tarafından çağrılır. Herkese açık.
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.ad.update({
      where: { id: params.id },
      data: { impressions: { increment: 1 } },
    });
  } catch {
    // Reklam silinmiş olabilir (ör. gösterim anında yönetici tarafından
    // kaldırıldı) — istemciye sessizce 204 döndürmek yeterli.
  }
  return new NextResponse(null, { status: 204 });
}
