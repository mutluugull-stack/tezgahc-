import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const patchSchema = z.object({
  status: z.enum(["BEKLEMEDE", "INCELENDI", "REDDEDILDI"]),
});

// PATCH /api/admin/sikayetler/[id] -> ilan şikayetinin durumunu güncelle (incelendi/reddedildi)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }

  await prisma.report.update({ where: { id: params.id }, data: { status: parsed.data.status } });

  return NextResponse.json({ ok: true });
}
