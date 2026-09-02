"use client";

import { useEffect, useState } from "react";
import { catLabel, fmtDate } from "@/lib/constants";
import EmptyState from "@/components/EmptyState";

type AdminUser = {
  id: string;
  username: string;
  email: string;
  accountType: "BIREYSEL" | "BAYI";
  fullName: string | null;
  companyName: string | null;
  phone: string | null;
  city: string | null;
  approved: boolean;
  isAdmin: boolean;
  createdAt: string;
  _count: { listings: number };
};

type Stats = {
  activeListings: number;
  soldListings: number;
  individualUsers: number;
  dealerUsers: number;
  pendingDealers: number;
  categoryBreakdown: { category: string; count: number }[];
};

export default function AdminPage() {
  const [tab, setTab] = useState<"overview" | "dealers" | "users">("overview");
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/users")
      .then((r) => {
        if (!r.ok) throw new Error("Yetkisiz erişim.");
        return r.json();
      })
      .then((data) => {
        setUsers(data.users);
        setStats(data.stats);
      })
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
  }, []);

  async function setApproval(userId: string, approved: boolean) {
    setBusyId(userId);
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, approved }),
      });
      if (res.ok) load();
    } finally {
      setBusyId(null);
    }
  }

  if (error) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-red-500">{error}</div>;
  }

  if (!users || !stats) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-ink-muted">Yükleniyor...</div>;
  }

  const dealers = users.filter((u) => u.accountType === "BAYI");
  const maxCategoryCount = Math.max(1, ...stats.categoryBreakdown.map((c) => c.count));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-5 font-display text-2xl font-bold">Yönetici Paneli</h1>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Aktif İlan", value: stats.activeListings },
          { label: "Satılan İlan", value: stats.soldListings },
          { label: "Bireysel Üye", value: stats.individualUsers },
          { label: "Bayi Üye", value: stats.dealerUsers },
          { label: "Onay Bekleyen Bayi", value: stats.pendingDealers },
        ].map((s) => (
          <div key={s.label} className="card p-3.5">
            <p className="font-mono-data text-2xl font-bold text-blueprint">{s.value}</p>
            <p className="text-xs text-ink-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex gap-1 border-b border-border">
        {[
          { key: "overview", label: "Genel Bakış" },
          { key: "dealers", label: `Bayiler${stats.pendingDealers ? ` (${stats.pendingDealers})` : ""}` },
          { key: "users", label: "Tüm Kullanıcılar" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`border-b-2 px-4 py-2 text-sm font-semibold ${
              tab === t.key ? "border-accent text-ink" : "border-transparent text-ink-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="card p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Kategoriye Göre İlan Dağılımı</h2>
          {stats.categoryBreakdown.length === 0 ? (
            <EmptyState title="Henüz ilan yok" />
          ) : (
            <div className="flex flex-col gap-2.5">
              {stats.categoryBreakdown
                .sort((a, b) => b.count - a.count)
                .map((c) => (
                  <div key={c.category} className="flex items-center gap-3">
                    <span className="w-40 flex-shrink-0 truncate text-sm">{catLabel(c.category)}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface2">
                      <div
                        className="h-full rounded-full bg-blueprint"
                        style={{ width: `${(c.count / maxCategoryCount) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono-data w-6 flex-shrink-0 text-right text-sm">{c.count}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {tab === "dealers" && (
        <div className="card overflow-x-auto">
          {dealers.length === 0 ? (
            <EmptyState title="Henüz bayi başvurusu yok" />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface2 text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-2.5">Firma</th>
                  <th className="px-4 py-2.5">Kullanıcı Adı</th>
                  <th className="px-4 py-2.5">Telefon</th>
                  <th className="px-4 py-2.5">Şehir</th>
                  <th className="px-4 py-2.5">İlan</th>
                  <th className="px-4 py-2.5">Durum</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {dealers.map((d) => (
                  <tr key={d.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 font-medium">{d.companyName}</td>
                    <td className="px-4 py-2.5 text-ink-muted">@{d.username}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{d.phone}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{d.city}</td>
                    <td className="font-mono-data px-4 py-2.5">{d._count.listings}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          d.approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {d.approved ? "Onaylı" : "Onay Bekliyor"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        disabled={busyId === d.id}
                        onClick={() => setApproval(d.id, !d.approved)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          d.approved ? "input" : "btn-accent"
                        }`}
                      >
                        {d.approved ? "Onayı Kaldır" : "Onayla"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "users" && (
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
