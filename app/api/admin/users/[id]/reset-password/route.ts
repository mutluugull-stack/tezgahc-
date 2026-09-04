import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Karışıklığa yol açabilecek karakterleri (0/O, 1/I/l vb.) dışarıda bırakan
// okunaklı bir şifre üretici.
const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

function generatePassword(length = 10) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return out;
}

// POST /api/admin/users/[id]/reset-password -> yönetici, e-posta altyapısı
// bulunmadığı için kullanıcı adına yeni bir şifre üretir. Üretilen şifre bir
// kereliğine API yanıtında döner; yönetici bunu kullanıcıya güvenli bir
// kanaldan (telefon, doğrulanmış iletişim vb.) iletmelidir.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const newPassword = generatePassword();
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return NextResponse.json({ ok: true, username: user.username, password: newPassword });
}
