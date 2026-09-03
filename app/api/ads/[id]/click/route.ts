import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/ads/[id]/click -> ziyaretçi reklama tıkladığında istemci
// tarafından çağrılır (yeni sekmeye yönlendirmeden önce). Herkese açık.
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.ad.update({
      where: { id: params.id },
      data: { clicks: { increment: 1 } },
    });
  } catch {
    // Reklam silinmiş olabilir — sessizce geç.
  }
  return new NextResponse(null, { status: 204 });
}
