import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const usernameRe = /^[a-z0-9][a-z0-9._-]{2,23}$/;

const createSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(usernameRe, "Kullanıcı adı 3-24 karakter, küçük harf/rakam olmalı."),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
  fullName: z.string().trim().min(2, "Ad soyad girin.").max(120),
  role: z.string().trim().min(2, "Unvan girin.").max(60).default("Müşteri Temsilcisi"),
});

// Ekip yönetimi yalnızca asıl bayi hesabı (alt hesap değil) tarafından yapılabilir.
function requireDealerOwner(session: any) {
  if (!session?.user) return "Giriş yapmalısınız.";
  if (session.user.accountType !== "BAYI") return "Bu işlem yalnızca bayi hesapları içindir.";
  if (session.user.parentDealerId) return "Ekip yönetimi yalnızca asıl bayi hesabından yapılabilir.";
  return null;
}

// GET /api/bayi/ekip -> bayinin ekip üyelerini (Müşteri Temsilcisi vb.) listeler
export async function GET() {
  const session = await getServerSession(authOptions);
  const err = requireDealerOwner(session);
  if (err) return NextResponse.json({ error: err }, { status: session?.user ? 403 : 401 });

  const members = await prisma.user.findMany({
    where: { parentDealerId: session!.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      role: true,
      approved: true,
      createdAt: true,
      _count: { select: { listings: true } },
    },
  });

  return NextResponse.json({ members });
}

// POST /api/bayi/ekip -> yeni bir ekip üyesi (alt hesap) oluşturur
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const err = requireDealerOwner(session);
  if (err) return NextResponse.json({ error: err }, { status: session?.user ? 403 : 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Form geçersiz." }, { status: 400 });
  }
  const data = parsed.data;

  const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
  if (existingUsername) {
    return NextResponse.json({ error: "Bu kullanıcı adı zaten alınmış." }, { status: 409 });
  }
  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmail) {
    return NextResponse.json({ error: "Bu e-posta ile zaten bir hesap var." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const dealer = await prisma.user.findUnique({ where: { id: session!.user.id } });

  const member = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
      accountType: "BAYI",
      fullName: data.fullName,
      city: dealer?.city || null,
      // Ekip üyeleri, sahibi bayi zaten onaylı olduğu için otomatik onaylıdır.
      approved: true,
      parentDealerId: session!.user.id,
      role: data.role,
    },
  });

  return NextResponse.json({ ok: true, id: member.id, username: member.username });
}
