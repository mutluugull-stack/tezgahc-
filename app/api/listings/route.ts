import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const createSchema = z.object({
  title: z.string().trim().min(5, "Başlık en az 5 karakter olmalı.").max(140),
  category: z.string().trim().min(1, "Kategori seçin."),
  brand: z.string().trim().optional(),
  model: z.string().trim().optional(),
  year: z.coerce.number().int().min(1970).max(new Date().getFullYear() + 1).optional().nullable(),
  condition: z.enum(["SIFIR", "IKINCI_EL", "YENILENMIS"]),
  controller: z.string().trim().optional(),
  axisCount: z.string().trim().optional(),
  workArea: z.string().trim().optional(),
  price: z.coerce.number().int().positive("Fiyat 0'dan büyük olmalı."),
  currency: z.enum(["TRY", "USD", "EUR"]),
  city: z.string().trim().min(2, "Şehir seçin."),
  description: z.string().trim().min(20, "Açıklama en az 20 karakter olmalı."),
  images: z.array(z.string().url()).max(8).optional(),
  previewConsent: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const condition = searchParams.get("condition");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const onlyDealer = searchParams.get("onlyDealer") === "1";
  const sort = searchParams.get("sort") || "date_desc";
  const includeSold = searchParams.get("includeSold") === "1";
  const vitrinOnly = searchParams.get("vitrin") === "1";
  const limit = Math.min(Number(searchParams.get("limit")) || 60, 200);

  const where: any = {};
  if (!includeSold) where.isSold = false;
  if (vitrinOnly) where.isVitrin = true;
  if (category && category !== "all") where.category = category;
  if (city && city !== "all") where.city = city;
  if (condition && condition !== "all") where.condition = condition;
  if (onlyDealer) where.seller = { accountType: "BAYI" };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  const listings = await prisma.listing.findMany({
    where,
    orderBy,
    take: limit,
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      seller: { select: { username: true, accountType: true, companyName: true, fullName: true } },
    },
  });

  return NextResponse.json({ listings });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "İlan vermek için giriş yapmalısınız." }, { status: 401 });
  }
  if (session.user.accountType === "BAYI" && !session.user.approved) {
    return NextResponse.json(
      { error: "Bayi hesabınız onay bekliyor. Onaylanınca ilan verebilirsiniz." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Form geçersiz." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // "Makine Önizleme" panelinde fotoğrafların gösterilmesi yalnızca Bayi
  // hesaplarının açık onayına bağlıdır — başka bir hesap türü bu alanı
  // gönderse bile sunucu tarafında yok sayılır.
  const previewConsent = session.user.accountType === "BAYI" ? Boolean(data.previewConsent) : false;

  // Bir bayi ekip üyesi (Müşteri Temsilcisi vb.) ilan verdiğinde, ilan
  // kendi hesabına değil, bağlı olduğu asıl bayi hesabına ait olur —
  // böylece ekip, bayinin ilanlarını ortak yönetebilir.
  const effectiveSellerId = session.user.parentDealerId || session.user.id;

  const listing = await prisma.listing.create({
    data: {
      title: data.title,
      category: data.category,
      brand: data.brand || null,
      model: data.model || null,
      year: data.year ?? null,
      condition: data.condition,
      controller: data.controller || null,
      axisCount: data.axisCount || null,
      workArea: data.workArea || null,
      price: data.price,
      currency: data.currency,
      city: data.city,
      description: data.description,
      previewConsent,
      sellerId: effectiveSellerId,
      images: data.images?.length
        ? { create: data.images.map((url, i) => ({ url, order: i })) }
        : undefined,
    },
  });

  return NextResponse.json({ ok: true, id: listing.id });
}
