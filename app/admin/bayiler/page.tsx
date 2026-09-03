"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import { BackIcon } from "@/components/Icons";

type AdminUser = {
  id: string;
  username: string;
  accountType: "BIREYSEL" | "BAYI";
  companyName: string | null;
  phone: string | null;
  city: string | null;
  approved: boolean;
  _count: { listings: number };
};

export default function AdminDealersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/users")
      .then((r) => {
        if (!r.ok) throw new Error("Yetkisiz erişim.");
        return r.json();
      })
      .then((data) => setUsers(data.users))
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

  const dealers = (users || []).filter((u) => u.accountType === "BAYI");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Yönetici Paneli
      </Link>
      <h1 className="mb-5 font-display text-2xl font-bold">Bayiler</h1>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && !users && <p className="text-sm text-ink-muted">Yükleniyor...</p>}

      {users && (
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
    </div>
  );
}
