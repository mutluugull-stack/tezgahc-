"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fmtDate } from "@/lib/constants";
import EmptyState from "@/components/EmptyState";
import { BackIcon } from "@/components/Icons";

type AdminReport = {
  id: string;
  reason: string;
  message: string | null;
  status: "BEKLEMEDE" | "INCELENDI" | "REDDEDILDI";
  createdAt: string;
  listing: { id: string; title: string; isSold: boolean } | null;
  reporter: { username: string; fullName: string | null; companyName: string | null } | null;
};

const REASON_LABELS: Record<string, string> = {
  sahte_yaniltici: "Sahte veya yanıltıcı ilan",
  yanlis_kategori: "Yanlış kategoride",
  uygunsuz_icerik: "Uygunsuz içerik / fotoğraf",
  satildi_kaldirilmadi: "Satıldı ama kaldırılmamış",
  diger: "Diğer",
};

const STATUS_LABELS: Record<AdminReport["status"], string> = {
  BEKLEMEDE: "Beklemede",
  INCELENDI: "İncelendi",
  REDDEDILDI: "Reddedildi",
};

const STATUS_STYLES: Record<AdminReport["status"], string> = {
  BEKLEMEDE: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  INCELENDI: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  REDDEDILDI: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReport[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/sikayetler")
      .then((r) => {
        if (!r.ok) throw new Error("Yetkisiz erişim.");
        return r.json();
      })
      .then((data) => setReports(data.reports))
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: AdminReport["status"]) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/sikayetler/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReports((prev) => prev && prev.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Yönetici Paneli
      </Link>
      <h1 className="mb-1 font-display text-2xl font-bold">İlan Şikayetleri</h1>
      <p className="mb-5 text-sm text-ink-muted">Kullanıcıların bildirdiği ilanları inceleyin.</p>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!error && !reports && <p className="text-sm text-ink-muted">Yükleniyor...</p>}

      {reports && (
        <div className="card overflow-x-auto">
          {reports.length === 0 ? (
            <EmptyState title="Henüz şikayet yok" description="Kullanıcılar bir ilanı bildirdiğinde burada görünecek." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface2 text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-2.5">İlan</th>
                  <th className="px-4 py-2.5">Sebep</th>
                  <th className="px-4 py-2.5">Açıklama</th>
                  <th className="px-4 py-2.5">Bildiren</th>
                  <th className="px-4 py-2.5">Tarih</th>
                  <th className="px-4 py-2.5">Durum</th>
                  <th className="px-4 py-2.5">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 align-top">
                    <td className="px-4 py-2.5 font-medium">
                      {r.listing ? (
                        <Link href={`/ilan/${r.listing.id}`} target="_blank" className="hover:text-blueprint">
                          {r.listing.title}
                        </Link>
                      ) : (
                        <span className="text-ink-muted">Silinmiş ilan</span>
                      )}
                      {r.listing?.isSold && (
                        <span className="ml-1.5 rounded-full bg-surface2 px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">
                          Satıldı
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">{REASON_LABELS[r.reason] || r.reason}</td>
                    <td className="max-w-[220px] px-4 py-2.5 text-ink-muted">{r.message || "—"}</td>
                    <td className="px-4 py-2.5 text-ink-muted">
                      {r.reporter ? r.reporter.fullName || r.reporter.companyName || `@${r.reporter.username}` : "Anonim"}
                    </td>
                    <td className="px-4 py-2.5 text-ink-muted">{fmtDate(r.createdAt)}</td>
                    <td className="px-4 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[r.status]}`}>
                        {STATUS_LABELS[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {r.status !== "INCELENDI" && (
                        <button
                          type="button"
                          disabled={busyId === r.id}
                          onClick={() => updateStatus(r.id, "INCELENDI")}
                          className="mr-1.5 mb-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-60"
                        >
                          İncelendi
                        </button>
                      )}
                      {r.status !== "REDDEDILDI" && (
                        <button
                          type="button"
                          disabled={busyId === r.id}
                          onClick={() => updateStatus(r.id, "REDDEDILDI")}
                          className="input rounded-lg px-2.5 py-1 text-xs font-semibold disabled:opacity-60"
                        >
                          Reddet
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
