"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { fmtDateTime } from "@/lib/constants";
import EmptyState from "@/components/EmptyState";

type ApiMessage = {
  id: string;
  body: string;
  createdAt: string;
  read: boolean;
  listing: { id: string; title: string; category: string; isSold: boolean };
  sender: { id: string; username: string; fullName: string | null; companyName: string | null };
  receiver: { id: string; username: string; fullName: string | null; companyName: string | null };
};

type Thread = {
  key: string;
  listingId: string;
  listingTitle: string;
  listingSold: boolean;
  otherId: string;
  otherName: string;
  messages: (ApiMessage & { fromMe: boolean })[];
  lastAt: string;
  unread: number;
};

export default function InboxPage() {
  const { data: session, status } = useSession();
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const active = threads?.find((t) => t.key === activeKey) || null;

  useEffect(() => {
    if (status !== "authenticated") return;
    load();
  }, [status]);

  useEffect(() => {
    if (!active) return;
    const unreadIds = active.messages.filter((m) => !m.fromMe && !m.read).map((m) => m.id);
    if (!unreadIds.length) return;
    Promise.all(
      unreadIds.map((id) => fetch(`/api/messages/${id}`, { method: "PATCH" }).catch(() => {}))
    ).then(() => {
      setThreads((prev) =>
        prev
          ? prev.map((t) =>
              t.key === activeKey
                ? { ...t, unread: 0, messages: t.messages.map((m) => ({ ...m, read: true })) }
                : t
            )
          : prev
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  function load() {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data: { messages: ApiMessage[] }) => {
        const map = new Map<string, Thread>();
        for (const m of data.messages) {
          const fromMe = m.sender.id === session?.user.id;
          const other = fromMe ? m.receiver : m.sender;
          const key = `${m.listing.id}:${other.id}`;
          if (!map.has(key)) {
            map.set(key, {
              key,
              listingId: m.listing.id,
              listingTitle: m.listing.title,
              listingSold: m.listing.isSold,
              otherId: other.id,
              otherName: other.companyName || other.fullName || other.username,
              messages: [],
              lastAt: m.createdAt,
              unread: 0,
            });
          }
          const t = map.get(key)!;
          t.messages.push({ ...m, fromMe });
          if (m.createdAt > t.lastAt) t.lastAt = m.createdAt;
          if (!m.read && !fromMe) t.unread += 1;
        }
        const list = Array.from(map.values());
        list.forEach((t) => t.messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
        list.sort((a, b) => b.lastAt.localeCompare(a.lastAt));
        setThreads(list);
        if (!activeKey && list.length) setActiveKey(list[0].key);
      });
  }

  async function sendReply(thread: Thread) {
    if (!draft.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: thread.listingId, body: draft.trim(), receiverId: thread.otherId }),
      });
      if (res.ok) {
        setDraft("");
        load();
      }
    } finally {
      setSending(false);
    }
  }

  if (status === "loading" || (status === "authenticated" && threads === null)) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-ink-muted">Yükleniyor...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">Mesajlarınızı görmek için giriş yapın</h1>
        <Link href="/giris?callbackUrl=/mesajlarim" className="btn-accent inline-block rounded-lg px-4 py-2 text-sm font-semibold">
          Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-5 font-display text-2xl font-bold">Mesajlarım</h1>

      {!threads || threads.length === 0 ? (
        <EmptyState title="Henüz mesajınız yok" description="Bir ilana mesaj gönderdiğinizde ya da size mesaj geldiğinde burada görünecek." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[280px_1fr]">
          <div className="card flex max-h-[65vh] flex-col overflow-y-auto">
            {threads.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveKey(t.key)}
                className={`flex flex-col gap-0.5 border-b border-border px-3.5 py-3 text-left last:border-0 ${
                  t.key === activeKey ? "bg-surface2" : "hover:bg-surface2"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{t.otherName}</span>
                  {t.unread > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-ink">
                      {t.unread}
                    </span>
                  )}
                </div>
                <span className="truncate text-xs text-ink-muted">{t.listingTitle}</span>
              </button>
            ))}
          </div>

          {active && (
            <div className="card flex flex-col">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">{active.otherName}</p>
                <Link href={`/ilan/${active.listingId}`} className="text-xs text-blueprint hover:underline">
                  {active.listingTitle} →
                </Link>
              </div>
              <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4" style={{ minHeight: 280 }}>
                {active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[75%] rounded-lg px-3 py-1.5 text-sm ${
                      m.fromMe ? "self-end bg-blueprint text-white" : "self-start bg-surface2"
                    }`}
                  >
                    <p>{m.body}</p>
                    <p className={`mt-0.5 text-[10px] ${m.fromMe ? "text-white/70" : "text-ink-muted"}`}>
                      {fmtDateTime(m.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
              {!active.listingSold && (
                <div className="flex gap-2 border-t border-border p-3">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendReply(active)}
                    placeholder="Yanıt yazın..."
                    className="input flex-1 rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => sendReply(active)}
                    disabled={sending}
                    className="btn-accent rounded-lg px-4 py-2 text-sm font-semibold"
                  >
                    Gönder
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
