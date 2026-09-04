import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

// Bayi kayıt formunda (henüz hesap/oturum yokken) "Güncel Faaliyet Belgesi" ve
// "İmza Sirküleri" evraklarının yüklenmesi için kullanılan, oturum gerektirmeyen
// uç nokta. Yalnızca "kayit-belgeleri" klasörüne, PDF/JPEG/PNG olarak ve 10MB
// sınırıyla yükleme yapılabilir — hesap oluşturulmadan önce çalıştığı için
// diğer /api/upload uç noktası gibi giriş kontrolü uygulanamaz.
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const ALLOWED_DOC_TYPES = ["faaliyet-belgesi", "imza-sirkuleri"];

export async function POST(req: NextRequest) {
  // Blob Storage bağlantısı Vercel projesine OIDC üzerinden (BLOB_STORE_ID ile)
  // ya da klasik BLOB_READ_WRITE_TOKEN ile yapılmış olabilir.
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    return NextResponse.json(
      { error: "Evrak yükleme şu anda yapılandırılmamış." },
      { status: 501 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const docTypeRaw = formData.get("docType");
  const docType = typeof docTypeRaw === "string" ? docTypeRaw : "";

  if (!ALLOWED_DOC_TYPES.includes(docType)) {
    return NextResponse.json({ error: "Geçersiz belge türü." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Sadece PDF, JPEG, PNG veya WEBP yükleyebilirsiniz." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Dosya 10MB'den küçük olmalı." }, { status: 400 });
  }

  const ext =
    file.type === "application/pdf"
      ? "pdf"
      : file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
      ? "webp"
      : "jpg";
  const key = `kayit-belgeleri/${docType}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const blob = await put(key, file, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    console.error("Blob upload error:", err);
    return NextResponse.json(
      { error: "Evrak yüklenirken bir sorun oluştu. Lütfen tekrar deneyin." },
      { status: 502 }
    );
  }
}
