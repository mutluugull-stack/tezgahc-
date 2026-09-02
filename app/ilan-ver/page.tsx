"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CATEGORIES, CITIES, CONDITIONS, CURRENCIES } from "@/lib/constants";

const emptyForm = {
  title: "",
  category: "torna",
  brand: "",
  model: "",
  year: "",
  condition: "IKINCI_EL",
  controller: "",
  axisCount: "",
  workArea: "",
  price: "",
  currency: "TRY",
  city: "İstanbul",
  description: "",
};

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadError("");
    setUploading(true);
    try {
      for (const file of files.slice(0, 8 - images.length)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          setUploadError(data.error || "Fotoğraf yüklenemedi.");
          break;
        }
        setImages((prev) => [...prev, data.url]);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: form.year ? Number(form.year) : undefined,
          price: Number(form.price),
          images,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "İlan yayınlanamadı.");
        return;
      }
      router.push(`/ilan/${data.id}`);
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-ink-muted">Yükleniyor...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">İlan vermek için giriş yapın</h1>
        <p className="mb-5 text-sm text-ink-muted">Ücretsiz üye olun ve tezgahınızı hemen ilana çıkarın.</p>
        <div className="flex justify-center gap-2">
          <Link href="/giris?callbackUrl=/ilan-ver" className="input rounded-lg px-4 py-2 text-sm font-semibold">
            Giriş Yap
          </Link>
          <Link href="/kayit" className="btn-accent rounded-lg px-4 py-2 text-sm font-semibold">
            Üye Ol
          </Link>
        </div>
      </div>
    );
  }

  if (session.user.accountType === "BAYI" && !session.user.approved) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">Bayi hesabınız onay bekliyor</h1>
        <p className="text-sm text-ink-muted">
          Hesabınız yönetici onayından geçtikten sonra ilan verebilirsiniz. Onay genellikle kısa sürede
          tamamlanır.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 font-display text-2xl font-bold">Yeni İlan Ver</h1>
      <p className="mb-6 text-sm text-ink-muted">Tezgahınızın bilgilerini eksiksiz girin, hızla alıcı bulun.</p>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-5">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            İlan Başlığı *
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="örn. Haas VF-2 Dikey İşleme Merkezi"
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Kategori *
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Durum *
            </label>
            <select
              value={form.condition}
              onChange={(e) => set("condition", e.target.value)}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            >
              {CONDITIONS.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">Marka</label>
            <input
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">Model</label>
            <input
              value={form.model}
              onChange={(e) => set("model", e.target.value)}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Üretim Yılı
            </label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              placeholder="2018"
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Kontrolör
            </label>
            <input
              value={form.controller}
              onChange={(e) => set("controller", e.target.value)}
              placeholder="Fanuc, Siemens..."
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Eksen Sayısı
            </label>
            <input
              value={form.axisCount}
              onChange={(e) => set("axisCount", e.target.value)}
              placeholder="3 Eksen"
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Çalışma Alanı
          </label>
          <input
            value={form.workArea}
            onChange={(e) => set("workArea", e.target.value)}
            placeholder="762 x 406 x 508 mm"
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Fiyat *
            </label>
            <input
              required
              type="number"
              min={1}
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Para Birimi
            </label>
            <select
              value={form.currency}
              onChange={(e) => set("currency", e.target.value)}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Şehir *
          </label>
          <select
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Açıklama *
          </label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Tezgahın bakım durumu, kullanım geçmişi, dahil aksesuarlar..."
            className="input w-full resize-none rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Fotoğraflar (opsiyonel, en fazla 8)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={uploading || images.length >= 8}
            onChange={handleFiles}
            className="input w-full rounded-lg px-3 py-2 text-sm"
          />
          {uploading && <p className="mt-1 text-xs text-ink-muted">Yükleniyor...</p>}
          {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
          {images.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {images.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt={`Fotoğraf ${i + 1}`} className="aspect-square rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="btn-accent rounded-lg px-4 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {busy ? "Yayınlanıyor..." : "İlanı Yayınla"}
        </button>
      </form>
    </div>
  );
}
