import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/track -> herkese açık, kimliksiz sayfa ziyareti kaydı.
// Kişisel veri (IP, kullanıcı kimliği, çerez) tutulmaz; yalnızca hangi
// sayfanın ne zaman görüntülendiği kaydedilir. Yönetici panelindeki
// "Ziyaretler" sayfasının veri kaynağıdır.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const path = typeof body?.path === "string" ? body.path.slice(0, 300) : null;
    if (!path) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 300) : null;

  await prisma.pageVisit.create({
    data: { path, referrer: referrer || null },
  });

  return NextResponse.json({ ok: true });
  } catch {
    // Ziyaret takibi asla kullanıcı deneyimini bozmamalı; sessizce başarısız ol.
  return NextResponse.json({ ok: false }, { status: 200 });
  }
}
