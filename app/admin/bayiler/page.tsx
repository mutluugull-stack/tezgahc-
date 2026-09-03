"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import { BackIcon, TrashIcon, LinkIcon, ChevronRightIcon } from "@/components/Icons";

type AdminUser = {
  id: string;
  username: string;
  email: string;
  accountType: "BIREYSEL" | "BAYI";
  companyName: string | null;
  fullName: string | null;
  phone: string | null;
  city: string | null;
  address: string | null;
  approved: boolean;
  logoUrl: string | null;
  activityCertificateUrl: string | null;
  signatureCircularUrl: string | null;
  parentDealerId: string | null;
  role: string | null;
  _count: { listings: number; teamMembers: number };
};

export default function AdminDealersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  async function deleteDealer(userId: string) {
    setBusyId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setConfirmDeleteId(null);
        load();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Bayi silinemedi.");
      }
    } finally {
      setBusyId(null);
    }
  }

  // Bayi sahibi hesaplar (ekip üyeleri kendi accountType'ı BAYI olsa da
  // parentDealerId'leri dolu olduğu için burada ayrı satır olarak sayılmaz;
  // "İlgili Kişiler" bölümünde asıl bayilerinin altında gösterilir).
  const dealers = (users || []).filter((u) => u.accountType === "BAYI" && !u.parentDealerId);

  function teamMembers(dealerId: string) {
    return (users || []).filter((u) => u.accountType === "BAYI" && u.parentDealerId === dealerId);
  }

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
                  <th className="px-4 py-2.5">E-posta</th>
                  <th className="px-4 py-2.5">Telefon</th>
                  <th className="px-4 py-2.5">Şehir</th>
                  <th className="px-4 py-2.5">İlan</th>
                  <th className="px-4 py-2.5">Durum</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {dealers.map((d) => {
                  const members = teamMembers(d.id);
                  const expanded = expandedId === d.id;
                  return (
                    <Fragment key={d.id}>
                      <tr className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => setExpandedId(expanded ? null : d.id)}
                            className="flex items-center gap-2 text-left"
                          >
                            <ChevronRightIcon
                              className={`h-3.5 w-3.5 flex-shrink-0 text-ink-muted transition-transform ${
                                expanded ? "rotate-90" : ""
                              }`}
                            />
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-surface2">
                              {d.logoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={d.logoUrl} alt="" className="h-full w-full object-contain" />
                              ) : (
                                <span className="text-[9px] text-ink-muted">—</span>
                              )}
                            </div>
                            <span className="font-medium">{d.companyName}</span>
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-ink-muted">{d.email}</td>
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
                          {confirmDeleteId === d.id ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-xs text-ink-muted">
                                {d._count.listings > 0 || d._count.teamMembers > 0
                                  ? `${d._count.listings} ilan, ${d._count.teamMembers} ekip üyesi de silinecek.`
                                  : "Emin misiniz?"}
                              </span>
                              <button
                                disabled={busyId === d.id}
                                onClick={() => deleteDealer(d.id)}
                                className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                              >
                                Evet, Sil
                              </button>
                              <button
                                disabled={busyId === d.id}
                                onClick={() => setConfirmDeleteId(null)}
                                className="input rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                              >
                                Vazgeç
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                disabled={busyId === d.id}
                                onClick={() => setApproval(d.id, !d.approved)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                  d.approved ? "input" : "btn-accent"
                                }`}
                              >
                                {d.approved ? "Onayı Kaldır" : "Onayla"}
                              </button>
                              <button
                                disabled={busyId === d.id}
                                onClick={() => setConfirmDeleteId(d.id)}
                                title="Bayiyi Sil"
                                className="input flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:text-red-600 disabled:opacity-60"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="border-b border-border bg-surface2/60 last:border-0">
                          <td colSpan={7} className="px-4 py-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                                  Açık Adres
                                </p>
                                <p className="text-sm">{d.address || "Adres girilmemiş."}</p>
                              </div>
                              <div>
                                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                                  Resmi Evraklar
                                </p>
                                <div className="flex flex-col gap-1">
                                  {d.activityCertificateUrl ? (
                                    <a
                                      href={d.activityCertificateUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex w-fit items-center gap-1 text-sm font-medium text-blueprint hover:underline"
                                    >
                                      <LinkIcon className="h-3.5 w-3.5" /> Güncel Faaliyet Belgesi
                                    </a>
                                  ) : (
                                    <span className="text-sm text-ink-muted">Faaliyet belgesi yok</span>
                                  )}
                                  {d.signatureCircularUrl ? (
                                    <a
                                      href={d.signatureCircularUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex w-fit items-center gap-1 text-sm font-medium text-blueprint hover:underline"
                                    >
                                      <LinkIcon className="h-3.5 w-3.5" /> İmza Sirküleri
                                    </a>
                                  ) : (
                                    <span className="text-sm text-ink-muted">İmza sirküleri yok</span>
                                  )}
                                </div>
                              </div>
                              <div className="sm:col-span-2">
                                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                                  İlgili Kişiler ({members.length})
                                </p>
                                {members.length === 0 ? (
                                  <p className="text-sm text-ink-muted">Kayıtlı ekip üyesi yok.</p>
                                ) : (
                                  <div className="overflow-hidden rounded-lg border border-border">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="bg-surface text-left text-xs uppercase tracking-wide text-ink-muted">
                                          <th className="px-3 py-2">Ad Soyad</th>
                                          <th className="px-3 py-2">Unvan</th>
                                          <th className="px-3 py-2">E-posta</th>
                                          <th className="px-3 py-2">Kullanıcı Adı</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {members.map((m) => (
                                          <tr key={m.id} className="border-t border-border">
                                            <td className="px-3 py-2 font-medium">{m.fullName}</td>
                                            <td className="px-3 py-2 text-ink-muted">{m.role}</td>
                                            <td className="px-3 py-2 text-ink-muted">{m.email}</td>
                                            <td className="px-3 py-2 text-ink-muted">@{m.username}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
