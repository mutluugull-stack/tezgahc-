import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET /api/admin/sikayetler -> yönetici panelinde ilan şikayetleri listesi
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const reports = await prisma.report.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      listing: { select: { id: true, title: true, isSold: true } },
      reporter: { select: { username: true, fullName: true, companyName: true } },
    },
    take: 300,
  });

  return NextResponse.json({ reports });
}
