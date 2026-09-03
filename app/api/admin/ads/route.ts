import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { adSchema } from "@/lib/adValidation";

// GET /api/admin/ads -> tüm reklamları listeler (yönetici)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const ads = await prisma.ad.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ads });
}

// POST /api/admin/ads -> yeni reklam oluşturur (yönetici)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }
  const parsed = adSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Form geçersiz." }, { status: 400 });
  }
  const data = parsed.data;

  const ad = await prisma.ad.create({
    data: {
      advertiserName: data.advertiserName,
      imageUrlDesktop: data.imageUrlDesktop,
      imageUrlMobile: data.imageUrlMobile,
      altText: data.altText,
      targetUrl: data.targetUrl,
      placement: data.placement,
      category: data.category,
      startDate: data.startDate,
      endDate: data.endDate,
      priority: data.priority,
      active: data.active,
    },
  });

  return NextResponse.json({ ok: true, ad }, { status: 201 });
}
