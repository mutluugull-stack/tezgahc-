import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const patchSchema = z.object({
  isSold: z.boolean().optional(),
  isVitrin: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { order: "asc" } },
      seller: {
        select: {
          username: true,
          accountType: true,
          companyName: true,
          fullName: true,
          city: true,
          createdAt: true,
        },
      },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }

  prisma.listing
    .update({ where: { id: params.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  return NextResponse.json({ listing });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }
  if (listing.sellerId !== session.user.id && !session.user.isAdmin) {
    return NextResponse.json({ error: "Bu ilan üzerinde yetkiniz yok." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz alan." }, { status: 400 });
  }

  const updated = await prisma.listing.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ ok: true, listing: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }
  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }
  if (listing.sellerId !== session.user.id && !session.user.isAdmin) {
    return NextResponse.json({ error: "Bu ilan üzerinde yetkiniz yok." }, { status: 403 });
  }

  await prisma.listing.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
