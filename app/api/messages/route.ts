import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const sendSchema = z.object({
  listingId: z.string().min(1),
  body: z.string().trim().min(2, "Mesaj çok kısa.").max(2000),
  receiverId: z.string().min(1).optional(),
});

// GET /api/messages -> giriş yapan kullanıcının gelen kutusu (ilana göre gruplanmış)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ receiverId: session.user.id }, { senderId: session.user.id }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      listing: { select: { id: true, title: true, category: true, price: true, currency: true, isSold: true } },
      sender: { select: { id: true, username: true, accountType: true, fullName: true, companyName: true } },
      receiver: { select: { id: true, username: true, accountType: true, fullName: true, companyName: true } },
    },
    take: 300,
  });

  return NextResponse.json({ messages });
}

// POST /api/messages -> yeni mesaj gönder (ilan sahibine, ya da mevcut bir konuşmada karşı tarafa)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Mesaj göndermek için giriş yapmalısınız." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Form geçersiz." }, { status: 400 });
  }
  const data = parsed.data;

  const listing = await prisma.listing.findUnique({ where: { id: data.listingId } });
  if (!listing) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }

  const receiverId = data.receiverId || listing.sellerId;
  if (receiverId === session.user.id) {
    return NextResponse.json({ error: "Kendinize mesaj gönderemezsiniz." }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      listingId: data.listingId,
      body: data.body,
      senderId: session.user.id,
      receiverId,
    },
  });

  return NextResponse.json({ ok: true, id: message.id });
}
