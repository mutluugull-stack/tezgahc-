import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const addSchema = z.object({
  listingId: z.string().min(1),
});

// GET /api/favorites -> giriş yapan kullanıcının favori ilanları (en yeni favori önce)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      listing: {
        include: {
          images: { take: 1, orderBy: { order: "asc" } },
          seller: { select: { accountType: true } },
        },
      },
    },
  });

  // Favorilenmiş ama sonradan silinmiş ilanlar için listing null gelebilir; filtrele.
  const listings = favorites.filter((f) => f.listing).map((f) => f.listing);

  return NextResponse.json({ listings });
}

// POST /api/favorites -> bir ilanı favorilere ekle
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Favorilere eklemek için giriş yapmalısınız." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "İlan belirtilmedi." }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: parsed.data.listingId } });
  if (!listing) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }

  await prisma.favorite.upsert({
    where: { userId_listingId: { userId: session.user.id, listingId: parsed.data.listingId } },
    create: { userId: session.user.id, listingId: parsed.data.listingId },
    update: {},
  });

  return NextResponse.json({ ok: true });
}
