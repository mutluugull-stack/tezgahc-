import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const patchSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  role: z.string().trim().min(2).max(60).optional(),
  newPassword: z.string().min(6).optional(),
});

function requireDealerOwner(session: any) {
  if (!session?.user) return "Giriş yapmalısınız.";
  if (session.user.accountType !== "BAYI") return "Bu işlem yalnızca bayi hesapları içindir.";
  if (session.user.parentDealerId) return "Ekip yönetimi yalnızca asıl bayi hesabından yapılabilir.";
  return null;
}

// PATCH /api/bayi/ekip/[id] -> bir ekip üyesinin unvanını/adını/şifresini günceller
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const err = requireDealerOwner(session);
  if (err) return NextResponse.json({ error: err }, { status: session?.user ? 403 : 401 });

  const member = await prisma.user.findUnique({ where: { id: params.id } });
  if (!member || member.parentDealerId !== session!.user.id) {
    return NextResponse.json({ error: "Ekip üyesi bulunamadı." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Form geçersiz." }, { status: 400 });
  }
  const data = parsed.data;

  const updateData: any = {};
  if (data.fullName !== undefined) updateData.fullName = data.fullName;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.newPassword) updateData.passwordHash = await bcrypt.hash(data.newPassword, 10);

  const updated = await prisma.user.update({ where: { id: member.id }, data: updateData });
  return NextResponse.json({ ok: true, id: updated.id, fullName: updated.fullName, role: updated.role });
}

// DELETE /api/bayi/ekip/[id] -> bir ekip üyesini (alt hesabı) kaldırır
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const err = requireDealerOwner(session);
  if (err) return NextResponse.json({ error: err }, { status: session?.user ? 403 : 401 });

  const member = await prisma.user.findUnique({ where: { id: params.id } });
  if (!member || member.parentDealerId !== session!.user.id) {
    return NextResponse.json({ error: "Ekip üyesi bulunamadı." }, { status: 404 });
  }

  await prisma.user.delete({ where: { id: member.id } });
  return NextResponse.json({ ok: true });
}
