import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Marka/model seçilerek makine önizleme paneli için kullanılır.
// Şu an yayında olan, seçilen marka/modele uyan ilanları (ve onların
// fotoğraflarını) döner. Ayrı bir "üretici kataloğu" görsel kütüphanesi
// yoktur — gösterilen fotoğraflar gerçek satıcı ilanlarına aittir.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand")?.trim();
  const model = searchParams.get("model")?.trim();

  if (!brand) {
    return NextResponse.json({ listings: [] });
  }

  const where: any = {
    isSold: false,
    brand: { contains: brand, mode: "insensitive" },
  };
  if (model) {
    where.model = { contains: model, mode: "insensitive" };
  }

  const listings = await prisma.listing.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      id: true,
      title: true,
      brand: true,
      model: true,
      category: true,
      price: true,
      currency: true,
      city: true,
      images: { orderBy: { order: "asc" }, select: { url: true }, take: 8 },
    },
  });

  return NextResponse.json({ listings });
}
