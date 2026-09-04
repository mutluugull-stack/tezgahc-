import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const REASONS = [
  "sahte_yaniltici",
  "yanlis_kategori",
  "uygunsuz_icerik",
  "satildi_kaldirilmadi",
  "diger",
] as const;

const reportSchema = z.object({
  reason: z.enum(REASONS, { errorMap: () => ({ message: "Geçerli bir sebep seçin." }) }),
  message: z.string().trim().max(1000).optional(),
});

// POST /api/listings/[id]/report -> ilanı yönetici incelemesine bildir. Giriş
// zorunlu değildir (şüpheli/sahte ilanı herkes bildirebilsin), ama giriş
// yapılmışsa bildiren kullanıcı kaydedilir.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Form geçersiz." }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }

  await prisma.report.create({
    data: {
      listingId: params.id,
      reporterId: session?.user?.id || null,
      reason: parsed.data.reason,
      message: parsed.data.message || null,
    },
  });

  return NextResponse.json({ ok: true });
}
