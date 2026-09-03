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

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => {
        if (!r.ok) throw new Error("Yetkisiz erişim.");
        return r.json();
      })
      .then((data) => setUsers(data.users))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Yönetici Paneli
      </Link>
      <h1 className="mb-5 font-display text-2xl font-bold">Tüm Kullanıcılar</h1>

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
