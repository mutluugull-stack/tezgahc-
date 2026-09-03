"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, catLabel, fmtDateTime } from "@/lib/constants";
import { PLACEMENTS, PLACEMENT_LABELS, type Placement } from "@/lib/adValidation";
import EmptyState from "@/components/EmptyState";
import { BackIcon, PlusIcon, TrashIcon, MegaphoneIcon, LinkIcon } from "@/components/Icons";

type Ad = {
  id: string;
  advertiserName: string;
  imageUrlDesktop: string;
  imageUrlMobile: string | null;
  altText: string;
  targetUrl: string;
  placement: Placement;
  category: string | null;
  startDate: string | null;
  endDate: string | null;
  priority: number;
  active: boolean;
  impressions: number;
  clicks: number;
  createdAt: string;
};

const RECOMMENDED_SIZE: Record<Placement, string> = {
  HOME_SEARCH_BANNER: "1200×150 px (masaüstü) · 600×200 px (mobil)",
  HOME_AFTER_VITRIN: "1200×150 px (masaüstü) · 600×200 px (mobil)",
  HOME_SERVICE_CARD: "160×160 px kare logo/görsel",
  LISTING_TOP_BANNER: "1200×150 px (masaüstü) · 600×200 px (mobil)",
  LISTING_INFEED: "1200×150 px (masaüstü) · 600×200 px (mobil)",
  LISTING_SIDEBAR: "300×600 px (dikey)",
};

const PREVIEW_ASPECT: Record<Placement, string> = {
  HOME_SEARCH_BANNER: "aspect-[8/1]",
  HOME_AFTER_VITRIN: "aspect-[8/1]",
  HOME_SERVICE_CARD: "aspect-square max-w-[160px]",
  LISTING_TOP_BANNER: "aspect-[8/1]",
  LISTING_INFEED: "aspect-[8/1]",
  LISTING_SIDEBAR: "aspect-[1/2] max-w-[220px]",
};

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function computeStatus(ad: Ad): { label: string; className: string } {
  if (!ad.active) return { label: "Pasif", className: "bg-surface2 text-ink-muted" };
  const now = new Date();
  if (ad.startDate && new Date(ad.startDate) > now) {
    return { label: "Planlanmış", className: "bg-blue-100 text-blue-700" };
  }
  if (ad.endDate && new Date(ad.endDate) < now) {
    return { label: "Süresi Geçmiş", className: "bg-red-100 text-red-600" };
  }
  return { label: "Aktif", className: "bg-emerald-100 text-emerald-700" };
}

const emptyForm = {
  advertiserName: "",
  imageUrlDesktop: "",
  imageUrlMobile: "",
  altText: "",
  targetUrl: "",
  placement: "HOME_SEARCH_BANNER" as Placement,
  category: "",
  startDate: "",
  endDate: "",
  priority: 1,
  active: true,
};

export default function AdminReklamlarPage() {
  const [ads, setAds] = useState<Ad[] | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [filterPlacement, setFilterPlacement] = useState<string>("all");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function load() {
    fetch("/api/admin/ads")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Reklamlar yüklenemedi.");
        return data;
      })
      .then((data) => setAds(data.ads))
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
  }, []);

  async function uploadImage(file: File, which: "desktop" | "mobile") {
    const setUploading = which === "desktop" ? setUploadingDesktop : setUploadingMobile;
    setUploading(true);
    setFormError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "ads");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Görsel yüklenemedi.");
        return;
      }
      set(which === "desktop" ? "imageUrlDesktop" : "imageUrlMobile", data.url);
    } finally {
      setUploading(false);
    }
  }

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
    setShowForm(true);
  }

  function startEdit(ad: Ad) {
    setForm({
      advertiserName: ad.advertiserName,
      imageUrlDesktop: ad.imageUrlDesktop,
      imageUrlMobile: ad.imageUrlMobile || "",
      altText: ad.altText,
      targetUrl: ad.targetUrl,
      placement: ad.placement,
      category: ad.category || "",
      startDate: toLocalInputValue(ad.startDate),
      endDate: toLocalInputValue(ad.endDate),
      priority: ad.priority,
      active: ad.active,
    });
    setEditingId(ad.id);
    setFormError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.imageUrlDesktop) {
      setFormError("Masaüstü görseli yüklemeden reklamı kaydedemezsiniz.");
      return;
    }
    setBusy(true);
    try {
      const body = {
        ...form,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : "",
        endDate: form.endDate ? new Date(form.endDate).toISOString() : "",
      };
      const res = await fetch(editingId ? `/api/admin/ads/${editingId}` : "/api/admin/ads", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Reklam kaydedilemedi.");
        return;
      }
      setShowForm(false);
      setEditingId(null);
      load();
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(ad: Ad) {
    setBusyId(ad.id);
    try {
      const res = await fetch(`/api/admin/ads/${ad.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !ad.active }),
      });
      if (res.ok) load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Bu reklamı kalıcı olarak silmek istediğinize emin misiniz?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
      if (res.ok) load();
    } finally {
      setBusyId(null);
    }
  }

  const filtered = useMemo(() => {
    if (!ads) return [];
    if (filterPlacement === "all") return ads;
    return ads.filter((a) => a.placement === filterPlacement);
  }, [ads, filterPlacement]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Yönetici Paneli
      </Link>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
            <MegaphoneIcon className="h-6 w-6 text-blueprint" /> Reklamlar
          </h1>
          <p className="text-sm text-ink-muted">
            Ana sayfa ve ilan listelerindeki reklam alanlarını buradan yönetin.
          </p>
        </div>
        {!showForm && (
          <button onClick={startCreate} className="btn-accent flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold">
            <PlusIcon className="h-4 w-4" /> Yeni Reklam
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 flex flex-col gap-4 p-5">
          <h2 className="font-display text-lg font-semibold">{editingId ? "Reklamı Düzenle" : "Yeni Reklam"}</h2>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Reklamveren Adı *
            </label>
            <input
              required
              value={form.advertiserName}
              onChange={(e) => set("advertiserName", e.target.value)}
              placeholder="örn. ABC Nakliyat"
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Gösterileceği Alan *
              </label>
              <select
                value={form.placement}
                onChange={(e) => set("placement", e.target.value as Placement)}
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              >
                {PLACEMENTS.map((p) => (
                  <option key={p} value={p}>
                    {PLACEMENT_LABELS[p]}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-ink-muted">Önerilen ölçü: {RECOMMENDED_SIZE[form.placement]}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Kategori Hedefleme
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              >
                <option value="">Tüm kategoriler</option>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-ink-muted">Yalnızca ilan listesi alanları için geçerlidir.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Masaüstü Görseli *
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploadingDesktop}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f, "desktop");
                  e.target.value = "";
                }}
                className="input w-full rounded-lg px-3 py-2 text-sm"
              />
              {uploadingDesktop && <p className="mt-1 text-xs text-ink-muted">Yükleniyor...</p>}
              {form.imageUrlDesktop && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imageUrlDesktop} alt="Masaüstü önizleme" className="mt-2 h-16 rounded-lg border border-border object-cover" />
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Mobil Görseli (opsiyonel)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploadingMobile}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f, "mobile");
                  e.target.value = "";
                }}
                className="input w-full rounded-lg px-3 py-2 text-sm"
              />
              {uploadingMobile && <p className="mt-1 text-xs text-ink-muted">Yükleniyor...</p>}
              {form.imageUrlMobile && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imageUrlMobile} alt="Mobil önizleme" className="mt-2 h-16 rounded-lg border border-border object-cover" />
              )}
              <p className="mt-1 text-[11px] text-ink-muted">Verilmezse mobilde masaüstü görseli kullanılır.</p>
            </div>
          </div>

          {form.imageUrlDesktop && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Yayın Önizlemesi
              </label>
              <div className={`overflow-hidden rounded-xl border border-border bg-surface2 ${PREVIEW_ASPECT[form.placement]}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imageUrlDesktop} alt={form.altText || "Reklam önizleme"} className="h-full w-full object-cover" />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Alternatif Metin / Kısa Açıklama *
            </label>
            <input
              required
              value={form.altText}
              onChange={(e) => set("altText", e.target.value)}
              placeholder="örn. Sigortalı, vinçli tezgah nakliyesi — Türkiye geneli"
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
            <p className="mt-1 text-[11px] text-ink-muted">
              Görselin ekran okuyucularda okunacak açıklaması; hizmet kartlarında ayrıca kısa tanıtım metni olarak gösterilir.
            </p>
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <LinkIcon className="h-3.5 w-3.5" /> Hedef Bağlantı *
            </label>
            <input
              required
              type="url"
              value={form.targetUrl}
              onChange={(e) => set("targetUrl", e.target.value)}
              placeholder="https://..."
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Başlangıç Tarihi
              </label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Bitiş Tarihi
              </label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Gösterim Önceliği
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.priority}
                onChange={(e) => set("priority", Number(e.target.value))}
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              />
              <p className="mt-1 text-[11px] text-ink-muted">Aynı alanda birden fazla reklam varsa rotasyonda ağırlık.</p>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4 rounded"
            />
            Reklam yayında (aktif)
          </label>

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <div className="flex gap-2">
            <button disabled={busy} type="submit" className="btn-accent rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-60">
              {busy ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Reklamı Oluştur"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="input rounded-lg px-4 py-2.5 text-sm font-medium"
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}

      {!error && !ads && <p className="text-sm text-ink-muted">Yükleniyor...</p>}

      {ads && (
        <>
          <div className="mb-3 flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Alan:</label>
            <select
              value={filterPlacement}
              onChange={(e) => setFilterPlacement(e.target.value)}
              className="input rounded-lg px-2.5 py-1.5 text-xs"
            >
              <option value="all">Tümü ({ads.length})</option>
              {PLACEMENTS.map((p) => (
                <option key={p} value={p}>
                  {PLACEMENT_LABELS[p]} ({ads.filter((a) => a.placement === p).length})
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="Henüz reklam yok" description="Yukarıdaki “Yeni Reklam” ile ilk reklamınızı oluşturun." />
          ) : (
            <div className="flex flex-col gap-2.5">
              {filtered.map((ad) => {
                const status = computeStatus(ad);
                const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "0.0";
                return (
                  <div key={ad.id} className="card flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ad.imageUrlDesktop}
                      alt={ad.altText}
                      className="h-16 w-28 shrink-0 rounded-lg border border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{ad.advertiserName}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted">
                        {PLACEMENT_LABELS[ad.placement]}
                        {ad.category ? ` · ${catLabel(ad.category)}` : ""} · Öncelik {ad.priority}
                      </p>
                      <p className="font-mono-data text-xs text-ink-muted">
                        {ad.impressions} gösterim · {ad.clicks} tıklama · %{ctr} CTR
                      </p>
                      {(ad.startDate || ad.endDate) && (
                        <p className="text-[11px] text-ink-muted">
                          {ad.startDate ? fmtDateTime(ad.startDate) : "—"} → {ad.endDate ? fmtDateTime(ad.endDate) : "süresiz"}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => startEdit(ad)}
                        className="input rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                      >
                        Düzenle
                      </button>
                      <button
                        disabled={busyId === ad.id}
                        onClick={() => toggleActive(ad)}
                        className="input rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                      >
                        {ad.active ? "Durdur" : "Başlat"}
                      </button>
                      <button
                        disabled={busyId === ad.id}
                        onClick={() => remove(ad.id)}
                        title="Sil"
                        className="input flex h-8 w-8 items-center justify-center rounded-lg text-red-500"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
