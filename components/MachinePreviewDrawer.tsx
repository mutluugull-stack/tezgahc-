"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import BrandModelFields from "./BrandModelFields";
import { CategoryIcon, EyeIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { catLabel, fmtPrice } from "@/lib/constants";

type PreviewListing = {
  id: string;
  title: string;
  brand: string | null;
  model: string | null;
  category: string;
  price: number;
  currency: string;
  city: string;
  images: { url: string }[];
};

type Lightbox = { images: string[]; index: number };

// Header'daki "Makine Önizleme" tetikleyici ikonu ve sağdan açılan panel.
// Kullanıcı marka/model seçer; panel, o marka/modele uyan, şu anda yayında
// olan VE satıcısı (yalnızca Bayi hesapları) fotoğraflarının burada
// gösterilmesine açıkça izin vermiş ilanların gerçek fotoğraflarını galeri
// halinde gösterir.
export default function MachinePreviewDrawer() {
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [results, setResults] = useState<PreviewListing[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);
  const [mounted, setMounted] = useState(false);

  // Header, arka plan bulanıklığı (backdrop-blur) için filtre uygular; bu da
  // "fixed" pozisyonlu iç elemanlar için yeni bir containing block oluşturup
  // panelin tüm ekranı kaplamasını engelliyordu. document.body'ye portal
  // ederek bu sorunu tamamen ortadan kaldırıyoruz.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || !brand.trim()) {
      setResults(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(() => {
      const params = new URLSearchParams({ brand: brand.trim() });
      if (model.trim()) params.set("model", model.trim());
      fetch(`/api/machine-preview?${params.toString()}`)
        .then((r) => (r.ok ? r.json() : { listings: [] }))
        .then((data) => {
          if (!cancelled) setResults(data.listings || []);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [open, brand, model]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (lightbox) setLightbox(null);
      else setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lightbox]);

  function close() {
    setOpen(false);
    setLightbox(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Makine Önizleme"
        title="Makine Önizleme"
        className="input flex h-9 w-9 items-center justify-center rounded-full"
      >
        <EyeIcon className="h-4 w-4" />
      </button>

      {mounted && open && createPortal(
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-surface shadow-2xl sm:border-l sm:border-border">
            <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
              <div>
                <h2 className="font-display text-lg font-bold">Makine Önizleme</h2>
                <p className="mt-0.5 text-xs text-ink-muted">
                  Marka/model seçin, satıcısının paylaşıma onay verdiği yayındaki ilanların fotoğraflarını görün.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Kapat"
                className="input flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-border p-4">
              <BrandModelFields brand={brand} model={model} onBrandChange={setBrand} onModelChange={setModel} />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!brand.trim() && (
                <p className="mt-8 text-center text-sm text-ink-muted">
                  Önizlemek istediğiniz markayı yukarıdan seçin.
                </p>
              )}

              {brand.trim() && loading && (
                <p className="mt-8 text-center text-sm text-ink-muted">Yükleniyor...</p>
              )}

              {brand.trim() && !loading && results && results.length === 0 && (
                <div className="mt-8 flex flex-col items-center gap-2 text-center">
                  <CategoryIcon category="diger" className="h-10 w-10 text-ink-muted" />
                  <p className="text-sm text-ink-muted">
                    {model.trim() ? `${brand.trim()} ${model.trim()}` : brand.trim()} için şu anda
                    önizlemeye açık (satıcısı fotoğraf paylaşımına onay vermiş) yayında ilan bulunamadı.
                  </p>
                  <Link
                    href={`/ilanlar?brand=${encodeURIComponent(brand.trim())}${
                      model.trim() ? `&model=${encodeURIComponent(model.trim())}` : ""
                    }`}
                    onClick={close}
                    className="btn-accent mt-1 rounded-lg px-3 py-1.5 text-xs font-semibold"
                  >
                    İlanlarda Ara
                  </Link>
                </div>
              )}

              {results && results.length > 0 && (
                <div className="flex flex-col gap-4">
                  {results.map((l) => (
                    <div key={l.id} className="card p-3">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                            <CategoryIcon category={l.category} className="h-3.5 w-3.5" />
                            {catLabel(l.category)}
                          </div>
                          <p className="text-sm font-semibold leading-snug">{l.title}</p>
                          <p className="text-xs text-ink-muted">{l.city}</p>
                        </div>
                        <p className="shrink-0 font-mono-data text-sm font-bold text-blueprint">
                          {fmtPrice(l.price, l.currency)}
                        </p>
                      </div>

                      {l.images.length > 0 ? (
                        <div className="grid grid-cols-3 gap-1.5">
                          {l.images.map((img, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={img.url}
                              src={img.url}
                              alt={l.title}
                              onClick={() => setLightbox({ images: l.images.map((x) => x.url), index: i })}
                              className="aspect-square cursor-zoom-in rounded-md object-cover"
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-ink-muted">Bu ilana fotoğraf eklenmemiş.</p>
                      )}

                      <Link
                        href={`/ilan/${l.id}`}
                        onClick={close}
                        className="mt-2 inline-block text-xs font-semibold text-blueprint hover:underline"
                      >
                        İlanı Görüntüle →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>,
        document.body
      )}

      {mounted && lightbox && createPortal(
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Kapat"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          {lightbox.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((s) => (s ? { ...s, index: (s.index - 1 + s.images.length) % s.images.length } : s));
                }}
                aria-label="Önceki fotoğraf"
                className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((s) => (s ? { ...s, index: (s.index + 1) % s.images.length } : s));
                }}
                aria-label="Sonraki fotoğraf"
                className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.images[lightbox.index]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>,
        document.body
      )}
    </>
  );
}
