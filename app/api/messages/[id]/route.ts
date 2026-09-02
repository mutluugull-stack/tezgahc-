import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const message = await prisma.message.findUnique({ where: { id: params.id } });
  if (!message || message.receiverId !== session.user.id) {
    return NextResponse.json({ error: "Mesaj bulunamadı." }, { status: 404 });
  }

  await prisma.message.update({ where: { id: params.id }, data: { read: true } });
  return NextResponse.json({ ok: true });
}
