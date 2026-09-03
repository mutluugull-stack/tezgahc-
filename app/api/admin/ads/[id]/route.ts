import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { adUpdateSchema } from "@/lib/adValidation";

// PATCH /api/admin/ads/[id] -> reklamı günceller (yönetici)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const existing = await prisma.ad.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Reklam bulunamadı." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  // Yalnızca "active" alanını değiştiren hızlı durdur/başlat işlemlerine izin ver.
  if (
    typeof body === "object" &&
    body !== null &&
    Object.keys(body as object).length === 1 &&
    "active" in (body as any)
  ) {
    const active = (body as any).active;
    if (typeof active !== "boolean") {
      return NextResponse.json({ error: "Geçersiz değer." }, { status: 400 });
    }
    const ad = await prisma.ad.update({ where: { id: params.id }, data: { active } });
    return NextResponse.json({ ok: true, ad });
  }

  const parsed = adUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Form geçersiz." }, { status: 400 });
  }
  const data = parsed.data;

  const ad = await prisma.ad.update({
    where: { id: params.id },
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

  return NextResponse.json({ ok: true, ad });
}

// DELETE /api/admin/ads/[id] -> reklamı kalıcı olarak siler (yönetici)
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const existing = await prisma.ad.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Reklam bulunamadı." }, { status: 404 });
  }

  await prisma.ad.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
