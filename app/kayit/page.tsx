"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { CITIES } from "@/lib/constants";
import { useT } from "@/components/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";

type DocKey = "activityCertificateUrl" | "signatureCircularUrl";

const DOC_FIELDS: { key: DocKey; docType: string; labelKey: TranslationKey }[] = [
  { key: "activityCertificateUrl", docType: "faaliyet-belgesi", labelKey: "auth.activityCertificate" },
  { key: "signatureCircularUrl", docType: "imza-sirkuleri", labelKey: "auth.signatureCircular" },
];

export default function RegisterPage() {
  const t = useT();
  const router = useRouter();
  const [accountType, setAccountType] = useState<"BIREYSEL" | "BAYI">("BIREYSEL");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    city: "İstanbul",
    fullName: "",
    companyName: "",
    phone: "",
    address: "",
    activityCertificateUrl: "",
    signatureCircularUrl: "",
  });
  const [docFileNames, setDocFileNames] = useState<Record<DocKey, string>>({
    activityCertificateUrl: "",
    signatureCircularUrl: "",
  });
  const [docUploading, setDocUploading] = useState<Record<DocKey, boolean>>({
    activityCertificateUrl: false,
    signatureCircularUrl: false,
  });
  const [docError, setDocError] = useState<Record<DocKey, string>>({
    activityCertificateUrl: "",
    signatureCircularUrl: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleDocUpload(key: DocKey, docType: string, file: File) {
    setDocUploading((s) => ({ ...s, [key]: true }));
    setDocError((s) => ({ ...s, [key]: "" }));
    set(key, "");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("docType", docType);
      const res = await fetch("/api/register/belge", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setDocError((s) => ({ ...s, [key]: data.error || t("auth.docUploadFailed") }));
        return;
      }
      set(key, data.url);
      setDocFileNames((s) => ({ ...s, [key]: file.name }));
    } catch {
      setDocError((s) => ({ ...s, [key]: t("auth.connectionError") }));
    } finally {
      setDocUploading((s) => ({ ...s, [key]: false }));
    }
  }

  const docsReady =
    accountType !== "BAYI" || (!!form.activityCertificateUrl && !!form.signatureCircularUrl);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (accountType === "BAYI" && !docsReady) {
      setError(t("auth.docsRequiredError"));
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, accountType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("auth.registrationFailed"));
        return;
      }

      if (accountType === "BAYI" && !data.approved) {
        router.push("/giris?registered=bayi");
        return;
      }

      const signInRes = await signIn("credentials", {
        username: form.username,
        password: form.password,
        accountType,
        redirect: false,
      });
      if (signInRes?.error) {
        router.push("/giris");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError(t("auth.connectionError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-1 text-center font-display text-2xl font-bold">{t("auth.registerTitle")}</h1>
      <p className="mb-6 text-center text-sm text-ink-muted">{t("auth.registerSubtitle")}</p>

      <div className="mb-5 flex overflow-hidden rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setAccountType("BIREYSEL")}
          className={`flex-1 py-2.5 text-sm font-semibold ${
            accountType === "BIREYSEL" ? "bg-blueprint text-white" : "bg-surface text-ink-muted"
          }`}
        >
          {t("auth.individualTab")}
        </button>
        <button
          type="button"
          onClick={() => setAccountType("BAYI")}
          className={`flex-1 py-2.5 text-sm font-semibold ${
            accountType === "BAYI" ? "bg-blueprint text-white" : "bg-surface text-ink-muted"
          }`}
        >
          {t("auth.dealerTab")}
        </button>
      </div>

      {accountType === "BAYI" && (
        <p className="mb-4 rounded-lg bg-surface2 px-3 py-2 text-xs text-ink-muted">
          {t("auth.dealerApprovalNote")}
        </p>
      )}

      <form onSubmit={handleSubmit} className="card flex flex-col gap-3 p-5">
        {accountType === "BIREYSEL" ? (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {t("auth.fullName")}
            </label>
            <input
              required
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
        ) : (
          <>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("auth.companyName")}
              </label>
              <input
                required
                value={form.companyName}
                onChange={(e) => set("companyName", e.target.value)}
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("auth.phone")}
              </label>
              <input
                required
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="0212 000 00 00"
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("auth.address")}
              </label>
              <textarea
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                rows={2}
                placeholder={t("auth.addressPlaceholder")}
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              />
            </div>

            <div className="rounded-lg bg-surface2 p-3">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("auth.officialDocuments")}
              </p>
              <div className="flex flex-col gap-3">
                {DOC_FIELDS.map(({ key, docType, labelKey }) => (
                  <div key={key}>
                    <label className="mb-1 block text-xs font-medium text-ink">{t(labelKey)}</label>
                    <input
                      type="file"
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDocUpload(key, docType, file);
                      }}
                      className="input w-full rounded-lg px-3 py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-blueprint file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                    />
                    {docUploading[key] && <p className="mt-1 text-xs text-ink-muted">{t("auth.uploading")}</p>}
                    {!docUploading[key] && form[key] && (
                      <p className="mt-1 text-xs text-emerald-600">✓ {docFileNames[key] || t("auth.uploaded")}</p>
                    )}
                    {docError[key] && <p className="mt-1 text-xs text-red-500">{docError[key]}</p>}
                  </div>
                ))}
              </div>
              <p className="mt-2.5 text-[11px] text-ink-muted">
                {t("auth.docsNote")}
              </p>
            </div>
          </>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {t("auth.username")}
          </label>
          <input
            required
            value={form.username}
            onChange={(e) => set("username", e.target.value.toLowerCase())}
            pattern="[a-z0-9][a-z0-9._-]{2,23}"
            title={t("auth.usernameHint")}
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {t("auth.email")}
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">{t("auth.password")}</label>
          <input
            required
            type="password"
            minLength={6}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">{t("auth.city")}</label>
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

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={busy || !docsReady}
          className="btn-accent mt-1 rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {busy ? t("auth.registering") : t("auth.registerButton")}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-muted">
        {t("auth.alreadyMember")}{" "}
        <Link href="/giris" className="font-semibold text-blueprint hover:underline">
          {t("auth.loginLink")}
        </Link>
      </p>
    </div>
  );
}
