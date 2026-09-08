"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CATEGORIES, CITIES, CONDITIONS, CURRENCIES, CONTROLLERS, AXIS_COUNTS, PART_CATEGORY_KEYS, catLabel, conditionLabel, currencyLabel } from "@/lib/constants";
import BrandModelFields from "@/components/BrandModelFields";
import ComboField from "@/components/ComboField";
import { useLanguage } from "@/components/i18n/LanguageProvider";

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
  previewConsent: false,
};

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const { t, locale } = useLanguage();
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

  const isPartCategory = (PART_CATEGORY_KEYS as string[]).includes(form.category);

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
          setUploadError(data.error || t("postListing.uploadFailed"));
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
        setError(data.error || t("postListing.publishFailed"));
        return;
      }
      router.push(`/ilan/${data.id}`);
    } catch {
      setError(t("postListing.connectionError"));
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-ink-muted">{t("postListing.loading")}</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">{t("postListing.loginRequiredTitle")}</h1>
        <p className="mb-5 text-sm text-ink-muted">{t("postListing.loginRequiredDesc")}</p>
        <div className="flex justify-center gap-2">
          <Link href="/giris?callbackUrl=/ilan-ver" className="input rounded-lg px-4 py-2 text-sm font-semibold">
            {t("auth.loginTitle")}
          </Link>
          <Link href="/kayit" className="btn-accent rounded-lg px-4 py-2 text-sm font-semibold">
            {t("auth.registerButton")}
          </Link>
        </div>
      </div>
    );
  }

  if (session.user.accountType === "BAYI" && !session.user.approved) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">{t("postListing.dealerPendingTitle")}</h1>
        <p className="text-sm text-ink-muted">
          {t("postListing.dealerPendingDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 font-display text-2xl font-bold">{t("postListing.title")}</h1>
      <p className="mb-6 text-sm text-ink-muted">{t("postListing.subtitle")}</p>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-5">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {t("postListing.listingTitle")}
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder={t("postListing.listingTitlePlaceholder")}
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {t("postListing.category")}
            </label>
            <select
              value={form.category}
              onChange={(e) => {
                const next = e.target.value;
                const nowPart = (PART_CATEGORY_KEYS as string[]).includes(next);
                setForm((f) => ({
                  ...f,
                  category: next,
                  ...(nowPart ? { controller: "", axisCount: "", workArea: "" } : {}),
                }));
              }}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {catLabel(c.key, locale)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {t("postListing.condition")}
            </label>
            <select
              value={form.condition}
              onChange={(e) => set("condition", e.target.value)}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            >
              {CONDITIONS.map((c) => (
                <option key={c.key} value={c.key}>
                  {conditionLabel(c.key, locale)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <BrandModelFields
          brand={form.brand}
          model={form.model}
          onBrandChange={(v) => set("brand", v)}
          onModelChange={(v) => set("model", v)}
        />

        <div className={isPartCategory ? "grid grid-cols-1 gap-3" : "grid grid-cols-3 gap-3"}>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {t("postListing.year")}
            </label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              placeholder={t("postListing.yearPlaceholder")}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          {!isPartCategory && (
            <>
              <ComboField
                label={t("postListing.controller")}
                value={form.controller}
                onChange={(v) => set("controller", v)}
                options={CONTROLLERS}
                placeholder="Fanuc, Siemens..."
              />
              <ComboField
                label={t("postListing.axisCount")}
                value={form.axisCount}
                onChange={(v) => set("axisCount", v)}
                options={AXIS_COUNTS}
                placeholder={t("postListing.axisCountPlaceholder")}
              />
            </>
          )}
        </div>

        {!isPartCategory && (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {t("postListing.workArea")}
            </label>
            <input
              value={form.workArea}
              onChange={(e) => set("workArea", e.target.value)}
              placeholder={t("postListing.workAreaPlaceholder")}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {t("postListing.price")}
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
              {t("postListing.currency")}
            </label>
            <select
              value={form.currency}
              onChange={(e) => set("currency", e.target.value)}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {currencyLabel(c.key, locale)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {t("postListing.city")}
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
            {t("postListing.description")}
          </label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder={t("postListing.descriptionPlaceholder")}
            className="input w-full resize-none rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {t("postListing.photos")}
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={uploading || images.length >= 8}
            onChange={handleFiles}
            className="input w-full rounded-lg px-3 py-2 text-sm"
          />
          {uploading && <p className="mt-1 text-xs text-ink-muted">{t("postListing.uploading")}</p>}
          {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
          {images.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {images.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt={`${t("postListing.photoAlt")} ${i + 1}`} className="aspect-square rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>

        {session.user.accountType === "BAYI" && (
          <label className="flex items-start gap-2 rounded-lg border border-border bg-surface2 p-3 text-sm">
            <input
              type="checkbox"
              checked={form.previewConsent}
              onChange={(e) => set("previewConsent", e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded"
            />
            <span className="text-ink-muted">
              {t("postListing.previewConsentPrefix")}<strong className="text-ink">{t("postListing.previewConsentBold")}</strong>{t("postListing.previewConsentSuffix")}
            </span>
          </label>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="btn-accent rounded-lg px-4 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {busy ? t("postListing.publishing") : t("postListing.publishButton")}
        </button>
      </form>
    </div>
  );
}
