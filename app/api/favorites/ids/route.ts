import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET /api/favorites/ids -> giriş yapan kullanıcının favorilediği ilan id'leri
// (kalp ikonlarının dolu/boş durumunu hafifçe belirlemek için).
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ ids: [] });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { listingId: true },
  });

  return NextResponse.json({ ids: favorites.map((f) => f.listingId) });
}
