import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET /api/bayi/ilanlar -> giriş yapan bayinin (ve ekibinin) tüm ilanları + özet istatistikler.
// Ekip üyelerinin verdiği ilanlar da asıl bayi hesabına kayıtlı olduğu için
// (bkz. /api/listings POST), burada yalnızca "etkin bayi id"sine göre sorgu yeterlidir.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }
  if (session.user.accountType !== "BAYI") {
    return NextResponse.json({ error: "Bu sayfa yalnızca bayi hesapları içindir." }, { status: 403 });
  }

  const effectiveDealerId = session.user.parentDealerId || session.user.id;

  const listings = await prisma.listing.findMany({
    where: { sellerId: effectiveDealerId },
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
    },
  });

  const stats = {
    total: listings.length,
    active: listings.filter((l) => !l.isSold).length,
    sold: listings.filter((l) => l.isSold).length,
    vitrin: listings.filter((l) => l.isVitrin).length,
    totalViews: listings.reduce((sum, l) => sum + l.viewCount, 0),
  };

  const [messageCount, teamCount] = await Promise.all([
    prisma.message.count({
      where: { OR: [{ senderId: effectiveDealerId }, { receiverId: effectiveDealerId }] },
    }),
    prisma.user.count({ where: { parentDealerId: effectiveDealerId } }),
  ]);

  return NextResponse.json({ listings, stats: { ...stats, messages: messageCount, teamMembers: teamCount } });
}
