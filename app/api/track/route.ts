import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { prisma } from "@/lib/prisma";

// POST /api/track -> herkese açık, kimliksiz sayfa ziyareti kaydı.
// Kişisel veri (IP, kullanıcı kimliği, çerez) tutulmaz; yalnızca hangi
// sayfanın ne zaman görüntülendiği, yaklaşık konum (Vercel'in edge ağının
// sağladığı IP tabanlı ülke/bölge/şehir bilgisi — ham IP saklanmaz) ve
// tarayıcının User-Agent başlığından ayrıştırılan cihaz bilgisi kaydedilir.
// Yönetici panelindeki "Ziyaretler" sayfasının veri kaynağıdır.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const path = typeof body?.path === "string" ? body.path.slice(0, 300) : null;
    if (!path) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 300) : null;

    const country = request.headers.get("x-vercel-ip-country") || null;
    const region = request.headers.get("x-vercel-ip-country-region") || null;
    const rawCity = request.headers.get("x-vercel-ip-city");
    const city = rawCity ? decodeURIComponent(rawCity) : null;

    const uaString = request.headers.get("user-agent") || "";
    const ua = new UAParser(uaString).getResult();
    const deviceType = ua.device.type || "desktop";
    const os = ua.os.name || null;
    const browser = ua.browser.name || null;
    const deviceModel =
      ua.device.vendor && ua.device.model ? `${ua.device.vendor} ${ua.device.model}` : ua.device.model || null;

    await prisma.pageVisit.create({
      data: {
        path,
        referrer: referrer || null,
        country,
        region,
        city,
        deviceType,
        os,
        browser,
        deviceModel,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Ziyaret takibi asla kullanıcı deneyimini bozmamalı; sessizce başarısız ol.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
