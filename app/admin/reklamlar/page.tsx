"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, catLabel, fmtDateTime } from "@/lib/constants";
import { PLACEMENTS, type Placement } from "@/lib/adValidation";
import EmptyState from "@/components/EmptyState";
import { BackIcon, PlusIcon, TrashIcon, MegaphoneIcon, LinkIcon } from "@/components/Icons";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { t as translate, type Locale } from "@/lib/i18n/translations";

const PLACEMENT_KEY: Record<Placement, string> = {
  HOME_SEARCH_BANNER: "admin.placementHomeSearchBanner",
  HOME_AFTER_VITRIN: "admin.placementHomeAfterVitrin",
  HOME_SERVICE_CARD: "admin.placementHomeServiceCard",
  LISTING_TOP_BANNER: "admin.placementListingTopBanner",
  LISTING_INFEED: "admin.placementListingInfeed",
  LISTING_SIDEBAR: "admin.placementListingSidebar",
};

function placementLabel(placement: Placement, locale: Locale): string {
  return translate(PLACEMENT_KEY[placement], locale);
}

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

const RECOMMENDED_SIZE_KEY: Record<Placement, string> = {
  HOME_SEARCH_BANNER: "admin.recommendedSizeBanner",
  HOME_AFTER_VITRIN: "admin.recommendedSizeBanner",
  HOME_SERVICE_CARD: "admin.recommendedSizeServiceCard",
  LISTING_TOP_BANNER: "admin.recommendedSizeBanner",
  LISTING_INFEED: "admin.recommendedSizeBanner",
  LISTING_SIDEBAR: "admin.recommendedSizeSidebar",
};

function recommendedSize(placement: Placement, locale: Locale): string {
  return translate(RECOMMENDED_SIZE_KEY[placement], locale);
}

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

function computeStatus(ad: Ad, locale: Locale): { label: string; className: string } {
  if (!ad.active) return { label: translate("admin.adStatusInactive", locale), className: "bg-surface2 text-ink-muted" };
  const now = new Date();
  if (ad.startDate && new Date(ad.startDate) > now) {
    return { label: translate("admin.adStatusScheduled", locale), className: "bg-blue-100 text-blue-700" };
  }
  if (ad.endDate && new Date(ad.endDate) < now) {
    return { label: translate("admin.adStatusExpired", locale), className: "bg-red-100 text-red-600" };
  }
  return { label: translate("admin.adStatusActive", locale), className: "bg-emerald-100 text-emerald-700" };
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
  const { t, locale } = useLanguage();
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
        if (!r.ok) throw new Error(data.error || t("admin.adsLoadFailed"));
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
        setFormError(data.error || t("admin.imageUploadFailed"));
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
      setFormError(t("admin.desktopImageRequiredError"));
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
        setFormError(data.error || t("admin.adSaveFailed"));
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
    if (!confirm(t("admin.deleteAdConfirm"))) return;
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
        <BackIcon className="h-4 w-4" /> {t("admin.panelTitle")}
      </Link>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
            <MegaphoneIcon className="h-6 w-6 text-blueprint" /> {t("admin.adsTitle")}
          </h1>
          <p className="text-sm text-ink-muted">
            {t("admin.adsSubtitle")}
          </p>
        </div>
        {!showForm && (
          <button onClick={startCreate} className="btn-accent flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold">
            <PlusIcon className="h-4 w-4" /> {t("admin.newAdButton")}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 flex flex-col gap-4 p-5">
          <h2 className="font-display text-lg font-semibold">{editingId ? t("admin.editAdTitle") : t("admin.newAdTitle")}</h2>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {t("admin.advertiserNameLabel")}
            </label>
            <input
              required
              value={form.advertiserName}
              onChange={(e) => set("advertiserName", e.target.value)}
              placeholder={t("admin.advertiserNamePlaceholder")}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("admin.placementFieldLabel")}
              </label>
              <select
                value={form.placement}
                onChange={(e) => set("placement", e.target.value as Placement)}
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              >
                {PLACEMENTS.map((p) => (
                  <option key={p} value={p}>
                    {placementLabel(p, locale)}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-ink-muted">{t("admin.recommendedSize").replace("{size}", recommendedSize(form.placement, locale))}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("admin.categoryTargetingLabel")}
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              >
                <option value="">{t("admin.allCategoriesOption")}</option>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-ink-muted">{t("admin.categoryTargetingNote")}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("admin.desktopImageLabel")}
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
              {uploadingDesktop && <p className="mt-1 text-xs text-ink-muted">{t("common.loading")}</p>}
              {form.imageUrlDesktop && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imageUrlDesktop} alt={t("admin.desktopPreviewAlt")} className="mt-2 h-16 rounded-lg border border-border object-cover" />
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("admin.mobileImageLabel")}
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
              {uploadingMobile && <p className="mt-1 text-xs text-ink-muted">{t("common.loading")}</p>}
              {form.imageUrlMobile && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imageUrlMobile} alt={t("admin.mobilePreviewAlt")} className="mt-2 h-16 rounded-lg border border-border object-cover" />
              )}
              <p className="mt-1 text-[11px] text-ink-muted">{t("admin.mobileImageNote")}</p>
            </div>
          </div>

          {form.imageUrlDesktop && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("admin.publishPreviewLabel")}
              </label>
              <div className={`overflow-hidden rounded-xl border border-border bg-surface2 ${PREVIEW_ASPECT[form.placement]}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imageUrlDesktop} alt={form.altText || t("admin.adPreviewAlt")} className="h-full w-full object-cover" />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {t("admin.altTextLabel")}
            </label>
            <input
              required
              value={form.altText}
              onChange={(e) => set("altText", e.target.value)}
              placeholder={t("admin.altTextPlaceholder")}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
            <p className="mt-1 text-[11px] text-ink-muted">
              {t("admin.altTextNote")}
            </p>
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <LinkIcon className="h-3.5 w-3.5" /> {t("admin.targetLinkLabel")}
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
                {t("admin.startDateLabel")}
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
                {t("admin.endDateLabel")}
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
                {t("admin.priorityLabel")}
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.priority}
                onChange={(e) => set("priority", Number(e.target.value))}
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              />
              <p className="mt-1 text-[11px] text-ink-muted">{t("admin.priorityNote")}</p>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4 rounded"
            />
            {t("admin.adLiveCheckbox")}
          </label>

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <div className="flex gap-2">
            <button disabled={busy} type="submit" className="btn-accent rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-60">
              {busy ? t("admin.savingButton") : editingId ? t("admin.saveChangesButton") : t("admin.createAdButton")}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="input rounded-lg px-4 py-2.5 text-sm font-medium"
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      )}

      {!error && !ads && <p className="text-sm text-ink-muted">{t("common.loading")}</p>}

      {ads && (
        <>
          <div className="mb-3 flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{t("admin.areaFilterLabel")}</label>
            <select
              value={filterPlacement}
              onChange={(e) => setFilterPlacement(e.target.value)}
              className="input rounded-lg px-2.5 py-1.5 text-xs"
            >
              <option value="all">{t("admin.allFilterOption").replace("{n}", String(ads.length))}</option>
              {PLACEMENTS.map((p) => (
                <option key={p} value={p}>
                  {placementLabel(p, locale)} ({ads.filter((a) => a.placement === p).length})
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState title={t("admin.noAdsYet")} description={t("admin.noAdsDesc")} />
          ) : (
            <div className="flex flex-col gap-2.5">
              {filtered.map((ad) => {
                const status = computeStatus(ad, locale);
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
                        {placementLabel(ad.placement, locale)}
                        {ad.category ? ` · ${catLabel(ad.category, locale)}` : ""} · {t("admin.priorityInline").replace("{n}", String(ad.priority))}
                      </p>
                      <p className="font-mono-data text-xs text-ink-muted">
                        {t("admin.impressionsClicksCtr")
                          .replace("{impressions}", String(ad.impressions))
                          .replace("{clicks}", String(ad.clicks))
                          .replace("{ctr}", ctr)}
                      </p>
                      {(ad.startDate || ad.endDate) && (
                        <p className="text-[11px] text-ink-muted">
                          {ad.startDate ? fmtDateTime(ad.startDate) : "—"} → {ad.endDate ? fmtDateTime(ad.endDate) : t("admin.indefiniteLabel")}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => startEdit(ad)}
                        className="input rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        disabled={busyId === ad.id}
                        onClick={() => toggleActive(ad)}
                        className="input rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                      >
                        {ad.active ? t("admin.stopButton") : t("admin.startButton")}
                      </button>
                      <button
                        disabled={busyId === ad.id}
                        onClick={() => remove(ad.id)}
                        title={t("common.delete")}
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
