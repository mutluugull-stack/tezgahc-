"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fmtDateTime } from "@/lib/constants";
import EmptyState from "@/components/EmptyState";
import { BackIcon } from "@/components/Icons";

type AdminMessage = {
  id: string;
  body: string;
  createdAt: string;
  read: boolean;
  listing: { id: string; title: string } | null;
  sender: { username: string; fullName: string | null; companyName: string | null };
  receiver: { username: string; fullName: string | null; companyName: string | null };
};

function displayName(p: { username: string; fullName: string | null; companyName: string | null }) {
  return p.companyName || p.fullName || `@${p.username}`;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[] | null>(null);
  const [stats, setStats] = useState<{ total: number; unread: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/messages")
      .then((r) => {
        if (!r.ok) throw new Error("Yetkisiz erişim.");
        return r.json();
      })
      .then((data) => {
        setMessages(data.messages);
        setStats(data.stats);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Yönetici Paneli
      </Link>
      <h1 className="mb-1 font-display text-2xl font-bold">Mesajlar</h1>
      <p className="mb-5 text-sm text-ink-muted">
        Alıcı-satıcı yazışmalarının gözetimi (salt okunur).
      </p>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && !messages && <p className="text-sm text-ink-muted">Yükleniyor...</p>}

      {stats && (
        <div className="mb-5 grid grid-cols-2 gap-3 sm:w-80">
          <div className="card p-3.5">
            <p className="font-mono-data text-2xl font-bold text-blueprint">{stats.total}</p>
            <p className="text-xs text-ink-muted">Toplam Mesaj</p>
          </div>
          <div className="card p-3.5">
            <p className="font-mono-data text-2xl font-bold text-blueprint">{stats.unread}</p>
            <p className="text-xs text-ink-muted">Okunmamış</p>
          </div>
        </div>
      )}

      {messages && (
        messages.length === 0 ? (
          <EmptyState title="Henüz mesaj yok" />
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((m) => (
              <div key={m.id} className="card p-3.5">
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
                  <span>
                    <strong className="text-ink">{displayName(m.sender)}</strong> →{" "}
                    <strong className="text-ink">{displayName(m.receiver)}</strong>
                    {m.listing && (
                      <>
                        {" · "}
                        <Link href={`/ilan/${m.listing.id}`} className="hover:text-blueprint hover:underline">
                          {m.listing.title}
                        </Link>
                      </>
                    )}
                  </span>
                  <span>{fmtDateTime(m.createdAt)}</span>
                </div>
                <p className="text-sm">{m.body}</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
