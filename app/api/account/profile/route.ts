import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const patchSchema = z.object({
  fullName: z.string().trim().max(120).optional(),
  companyName: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  city: z.string().trim().max(60).optional(),
  address: z.string().trim().max(500).optional(),
  logoUrl: z.string().trim().url().max(1000).optional(),
  bio: z.string().trim().max(500).optional(),
});

// GET /api/account/profile -> giriş yapan kullanıcının kendi profil bilgileri
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
      role: true,
      parentDealerId: true,
      logoUrl: true,
      bio: true,
      createdAt: true,
    },
  });
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ user });
}

// PATCH /api/account/profile -> kendi profil bilgilerini güncelle
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
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
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(data.fullName !== undefined ? { fullName: data.fullName || null } : {}),
      ...(data.companyName !== undefined && session.user.accountType === "BAYI"
        ? { companyName: data.companyName || null }
        : {}),
      ...(data.phone !== undefined ? { phone: data.phone || null } : {}),
      ...(data.city !== undefined ? { city: data.city || null } : {}),
      ...(data.address !== undefined ? { address: data.address || null } : {}),
      ...(data.logoUrl !== undefined &&
      session.user.accountType === "BAYI" &&
      !session.user.parentDealerId
        ? { logoUrl: data.logoUrl || null }
        : {}),
      ...(data.bio !== undefined &&
      session.user.accountType === "BAYI" &&
     !session.user.parentDealerId
        ? { bio: data.bio || null }
        : {}),
    },
  });

  return NextResponse.json({
    ok: true,
    user: {
      fullName: user.fullName,
      companyName: user.companyName,
      phone: user.phone,
      city: user.city,
      address: user.address,
      logoUrl: user.logoUrl,
      bio: user.bio,
    },
  });
}
