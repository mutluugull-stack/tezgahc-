"use client";

import { useState } from "react";
import { FlagIcon } from "./Icons";
import { useT } from "./i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";

const REASONS: { key: string; labelKey: TranslationKey }[] = [
  { key: "sahte_yaniltici", labelKey: "report.reasonFake" },
  { key: "yanlis_kategori", labelKey: "report.reasonWrongCategory" },
  { key: "uygunsuz_icerik", labelKey: "report.reasonInappropriate" },
  { key: "satildi_kaldirilmadi", labelKey: "report.reasonSoldNotRemoved" },
  { key: "diger", labelKey: "report.reasonOther" },
];

export default function ReportListingButton({ listingId }: { listingId: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("sahte_yaniltici");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/listings/${listingId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, message: message.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || t("report.submitFailed"));
        return;
      }
      setDone(true);
    } catch {
      setError(t("report.connectionError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink"
      >
        <FlagIcon className="h-3.5 w-3.5" />
        {t("report.reportListing")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setOpen(false)}
        >
          <div className="card w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
            {done ? (
              <div className="text-center">
                <p className="mb-1 font-display text-lg font-semibold">{t("report.thanks")}</p>
                <p className="mb-4 text-sm text-ink-muted">{t("report.submitted")}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-accent w-full rounded-lg px-4 py-2 text-sm font-semibold"
                >
                  {t("report.close")}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <p className="font-display text-lg font-semibold">{t("report.reportListing")}</p>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    {t("report.reason")}
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="input w-full rounded-lg px-3 py-2 text-sm"
                  >
                    {REASONS.map((r) => (
                      <option key={r.key} value={r.key}>
                        {t(r.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    {t("report.descriptionOptional")}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder={t("report.explainPlaceholder")}
                    className="input w-full resize-none rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="input flex-1 rounded-lg px-4 py-2 text-sm font-semibold"
                  >
                    {t("report.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn-accent flex-1 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
                  >
                    {busy ? t("report.sending") : t("report.submit")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
