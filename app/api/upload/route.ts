import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
// "ads" klasörüne yalnızca yöneticiler yükleme yapabilir (Reklamlar paneli).
// "logos" klasörüne yalnızca bayi sahibi hesaplar yükleme yapabilir (ekip
// üyeleri değil) — Bayi Paneli > Ayarlar.
const ALLOWED_FOLDERS = ["listings", "ads", "logos"];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Fotoğraf yükleme şu anda yapılandırılmamış. Vercel projenizde Blob Storage kurup BLOB_READ_WRITE_TOKEN değişkenini tanımlayın.",
      },
      { status: 501 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const folderRaw = formData.get("folder");
  const folder = typeof folderRaw === "string" && folderRaw ? folderRaw : "listings";

  if (!ALLOWED_FOLDERS.includes(folder)) {
    return NextResponse.json({ error: "Geçersiz yükleme hedefi." }, { status: 400 });
  }
  if (folder === "ads" && !session.user.isAdmin) {
    return NextResponse.json({ error: "Bu işlem için yönetici yetkisi gerekir." }, { status: 403 });
  }
  if (folder === "logos" && (session.user.accountType !== "BAYI" || session.user.parentDealerId)) {
    return NextResponse.json({ error: "Logo yalnızca bayi sahibi hesaplar tarafından yüklenebilir." }, { status: 403 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Sadece JPEG, PNG veya WEBP yükleyebilirsiniz." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Dosya 8MB'den küçük olmalı." }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `${folder}/${session.user.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ ok: true, url: blob.url });
}
