"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fmtDate } from "@/lib/constants";
import EmptyState from "@/components/EmptyState";
import { BackIcon } from "@/components/Icons";

type AdminUser = {
  id: string;
  username: string;
  accountType: "BIREYSEL" | "BAYI";
  fullName: string | null;
  companyName: string | null;
  city: string | null;
  isAdmin: boolean;
  createdAt: string;
  _count: { listings: number };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [resetResult, setResetResult] = useState<{ username: string; password: string } | null>(null);
  const [resetError, setResetError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => {
        if (!r.ok) throw new Error("Yetkisiz erişim.");
        return r.json();
      })
      .then((data) => setUsers(data.users))
      .catch((e) => setError(e.message));
  }, []);

  async function resetPassword(user: AdminUser) {
    setBusyId(user.id);
    setResetError("");
    setCopied(false);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/reset-password`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResetError(data.error || "Şifre sıfırlanamadı.");
        return;
      }
      setResetResult({ username: data.username, password: data.password });
    } catch {
      setResetError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Yönetici Paneli
      </Link>
      <h1 className="mb-5 font-display text-2xl font-bold">Tüm Kullanıcılar</h1>

      {resetResult && (
        <div className="card mb-4 border-blueprint/40 bg-blueprint/5 p-4">
          <p className="mb-1 text-sm font-semibold">
            @{resetResult.username} için yeni şifre oluşturuldu
          </p>
          <p className="mb-3 text-xs text-ink-muted">
            Bu şifre yalnızca bir kez gösteriliyor. Kullanıcıya güvenli bir kanaldan (telefon, doğrulanmış iletişim vb.)
            iletin.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="font-mono-data rounded-lg bg-surface2 px-3 py-1.5 text-sm">{resetResult.password}</code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(resetResult.password).then(() => setCopied(true));
              }}
              className="input rounded-lg px-3 py-1.5 text-xs font-semibold"
            >
              {copied ? "Kopyalandı" : "Kopyala"}
            </button>
            <button
              type="button"
              onClick={() => setResetResult(null)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
      {resetError && <p className="mb-3 text-sm text-red-500">{resetError}</p>}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!error && !users && <p className="text-sm text-ink-muted">Yükleniyor...</p>}

      {users && (
        <div className="card overflow-x-auto">
          {users.length === 0 ? (
            <EmptyState title="Henüz kullanıcı yok" />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface2 text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-2.5">Ad</th>
                  <th className="px-4 py-2.5">Kullanıcı Adı</th>
                  <th className="px-4 py-2.5">Tür</th>
                  <th className="px-4 py-2.5">Şehir</th>
                  <th className="px-4 py-2.5">İlan</th>
                  <th className="px-4 py-2.5">Kayıt Tarihi</th>
                  <th className="px-4 py-2.5">Şifre</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 font-medium">
                      {u.fullName || u.companyName || "—"}
                      {u.isAdmin && (
                        <span className="ml-1.5 rounded-full bg-blueprint px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-ink-muted">@{u.username}</td>
                    <td className="px-4 py-2.5">{u.accountType === "BAYI" ? "Bayi" : "Bireysel"}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{u.city || "—"}</td>
                    <td className="font-mono-data px-4 py-2.5">{u._count.listings}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{fmtDate(u.createdAt)}</td>
                    <td className="px-4 py-2.5">
                      <button
                        type="button"
                        disabled={busyId === u.id}
                        onClick={() => resetPassword(u)}
                        className="input rounded-lg px-2.5 py-1 text-xs font-semibold disabled:opacity-60"
                      >
                        {busyId === u.id ? "..." : "Şifre Sıfırla"}
                      </button>
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
