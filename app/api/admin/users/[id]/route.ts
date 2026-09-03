import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// DELETE /api/admin/users/[id] -> yönetici, bir bayi hesabını (ve varsa ekip
// üyelerini, ilanlarını, mesajlarını) kalıcı olarak siler. Prisma şemasındaki
// onDelete: Cascade ilişkileri nedeniyle bu işlem geri alınamaz; yalnızca BAYI
// hesapları hedeflenebilir, yöneticiler bu uç noktayla silinemez.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (!target) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }
  if (target.accountType !== "BAYI") {
    return NextResponse.json({ error: "Bu uç nokta yalnızca bayi hesaplarını silebilir." }, { status: 400 });
  }
  if (target.isAdmin) {
    return NextResponse.json({ error: "Yönetici hesapları silinemez." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
