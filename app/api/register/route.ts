import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const usernameRe = /^[a-z0-9][a-z0-9._-]{2,23}$/;

const baseSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(usernameRe, "Kullanıcı adı 3-24 karakter, küçük harf/rakam olmalı."),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
  accountType: z.enum(["BIREYSEL", "BAYI"]),
  city: z.string().trim().min(2, "Şehir seçin."),
  fullName: z.string().trim().optional(),
  companyName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().max(500).optional(),
  activityCertificateUrl: z.string().trim().url().optional(),
  signatureCircularUrl: z.string().trim().url().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const parsed = baseSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Form bilgileri geçersiz.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const data = parsed.data;

  if (data.accountType === "BIREYSEL" && !data.fullName) {
    return NextResponse.json({ error: "Ad soyad gerekli." }, { status: 400 });
  }
  if (data.accountType === "BAYI" && (!data.companyName || !data.phone)) {
    return NextResponse.json({ error: "Firma adı ve telefon gerekli." }, { status: 400 });
  }
  if (data.accountType === "BAYI" && (!data.activityCertificateUrl || !data.signatureCircularUrl)) {
    return NextResponse.json(
      { error: "Güncel faaliyet belgesi ve imza sirküleri yüklemeniz gerekli." },
      { status: 400 }
    );
  }

  const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
  if (existingUsername) {
    return NextResponse.json({ error: "Bu kullanıcı adı zaten alınmış." }, { status: 409 });
  }
  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmail) {
    return NextResponse.json({ error: "Bu e-posta ile zaten bir hesap var." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
      accountType: data.accountType,
      city: data.city,
      fullName: data.accountType === "BIREYSEL" ? data.fullName : null,
      companyName: data.accountType === "BAYI" ? data.companyName : null,
      phone: data.accountType === "BAYI" ? data.phone : null,
      address: data.accountType === "BAYI" ? data.address || null : null,
      activityCertificateUrl: data.accountType === "BAYI" ? data.activityCertificateUrl : null,
      signatureCircularUrl: data.accountType === "BAYI" ? data.signatureCircularUrl : null,
      // Bireysel hesaplar otomatik onaylı, bayi hesapları admin onayı bekler.
      approved: data.accountType === "BIREYSEL",
    },
  });

  return NextResponse.json({
    ok: true,
    username: user.username,
    approved: user.approved,
    accountType: user.accountType,
  });
}
