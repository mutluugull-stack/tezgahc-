import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      accountType: true,
      fullName: true,
      companyName: true,
      phone: true,
      city: true,
      address: true,
      approved: true,
      isAdmin: true,
      createdAt: true,
      logoUrl: true,
      activityCertificateUrl: true,
      signatureCircularUrl: true,
      parentDealerId: true,
      role: true,
      _count: { select: { listings: true, teamMembers: true } },
    },
  });

  const [activeListings, soldListings] = await Promise.all([
    prisma.listing.count({ where: { isSold: false } }),
    prisma.listing.count({ where: { isSold: true } }),
  ]);

  const categoryBreakdown = await prisma.listing.groupBy({
    by: ["category"],
    _count: { _all: true },
  });

  return NextResponse.json({
    users,
    stats: {
      activeListings,
      soldListings,
      individualUsers: users.filter((u) => u.accountType === "BIREYSEL").length,
      dealerUsers: users.filter((u) => u.accountType === "BAYI").length,
      pendingDealers: users.filter((u) => u.accountType === "BAYI" && !u.approved).length,
      categoryBreakdown: categoryBreakdown.map((c) => ({ category: c.category, count: c._count._all })),
    },
  });
}
