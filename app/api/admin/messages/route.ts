import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET /api/admin/messages -> site genelindeki mesajlaşmaların yönetici gözetimi (salt okunur)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 100, 300);

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      listing: { select: { id: true, title: true, category: true } },
      sender: { select: { id: true, username: true, accountType: true, fullName: true, companyName: true } },
      receiver: { select: { id: true, username: true, accountType: true, fullName: true, companyName: true } },
    },
  });

  const [totalMessages, unreadMessages] = await Promise.all([
    prisma.message.count(),
    prisma.message.count({ where: { read: false } }),
  ]);

  return NextResponse.json({ messages, stats: { total: totalMessages, unread: unreadMessages } });
}
