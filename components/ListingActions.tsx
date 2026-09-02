"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { fmtDateTime } from "@/lib/constants";

type Thread = {
  otherId: string;
  senderUsername: string;
  senderName: string;
  messages: { id: string; body: string; createdAt: string; fromMe: boolean; read: boolean }[];
};

export default function ListingActions({
  listingId,
  sellerId,
  isSold,
  isVitrin,
}: {
  listingId: string;
  sellerId: string;
  isSold: boolean;
  isVitrin: boolean;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isOwner = status === "authenticated" && session.user.id === sellerId;

  const [sold, setSold] = useState(isSold);
  const [vitrin, setVitrin] = useState(isVitrin);
  const [busy, setBusy] = useState(false);
  const [msgDraft, setMsgDraft] = useState("");
  const [msgBusy, setMsgBusy] = useState(false);
  const [msgOk, setMsgOk] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyBusy, setReplyBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!isOwner) return;
    let cancelled = false;
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const relevant = (data.messages || []).filter((m: any) => m.listing.id === listingId);
        const map = new Map<string, Thread>();
        for (const m of relevant) {
          const iAmSender = m.sender.username === session?.user.username;
          const other = iAmSender ? m.receiver : m.sender;
          const otherUsername = other.username;
          const otherName = other.companyName || other.fullName || other.username;
          if (!map.has(otherUsername)) {
            map.set(otherUsername, {
              otherId: other.id,
              senderUsername: otherUsername,
              senderName: otherName,
              messages: [],
            });
          }
          map.get(otherUsername)!.messages.push({
            id: m.id,
            body: m.body,
            createdAt: m.createdAt,
            fromMe: m.sender.username === session?.user.username,
            read: m.read,
          });
        }
        map.forEach((t) => t.messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
        setThreads(Array.from(map.values()));
      })
      .catch(() => setThreads([]));
    return () => {
      cancelled = true;
    };
  }, [isOwner, listingId, session]);

  async function toggle(field: "isSold" | "isVitrin", value: boolean) {
    setBusy(true);
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        if (field === "isSold") setSold(value);
        else setVitrin(value);
      }
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!msgDraft.trim()) return;
    setMsgBusy(true);
    setMsgError("");
    setMsgOk(false);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, body: msgDraft.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsgError(data.error || "Mesaj gönderilemedi.");
      } else {
        setMsgOk(true);
        setMsgDraft("");
      }
    } catch {
      setMsgError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setMsgBusy(false);
    }
  }

  async function sendReply(toUsername: string, toId: string) {
    const body = replyDrafts[toUsername]?.trim();
    if (!body) return;
    setReplyBusy(toUsername);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, body, receiverId: toId }),
      });
      if (res.ok) {
        setReplyDrafts((d) => ({ ...d, [toUsername]: "" }));
      }
    } finally {
      setReplyBusy(null);
    }
  }

  if (isOwner) {
    return (
      <div className="mt-5">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => toggle("isSold", !sold)}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
              sold ? "input" : "btn-blueprint"
            }`}
          >
            {sold ? "Satıldı İşaretini Kaldır" : "Satıldı Olarak İşaretle"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => toggle("isVitrin", !vitrin)}
            className="input rounded-lg px-4 py-2.5 text-sm font-semibold"
          >
            {vitrin ? "Vitrinden Kaldır" : "Vitrine Ekle"}
          </button>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 font-display text-base font-semibold">Bu İlana Gelen Mesajlar</h2>
          {threads === null ? (
            <p className="text-sm text-ink-muted">Yükleniyor...</p>
          ) : threads.length === 0 ? (
            <p className="text-sm text-ink-muted">Henüz mesaj yok.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {threads.map((t) => (
                <div key={t.senderUsername} className="rounded-lg border border-border p-3">
                  <p className="mb-2 text-sm font-semibold">{t.senderName}</p>
                  <div className="flex flex-col gap-1.5">
                    {t.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`max-w-[85%] rounded-lg px-3 py-1.5 text-sm ${
                          m.fromMe ? "self-end bg-blueprint text-white" : "bg-surface2"
                        }`}
                      >
                        <p>{m.body}</p>
                        <p className={`mt-0.5 text-[10px] ${m.fromMe ? "text-white/70" : "text-ink-muted"}`}>
                          {fmtDateTime(m.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={replyDrafts[t.senderUsername] || ""}
                      onChange={(e) =>
                        setReplyDrafts((d) => ({ ...d, [t.senderUsername]: e.target.value }))
                      }
                      placeholder="Yanıt yazın..."
                      className="input flex-1 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <button
                      type="button"
                      disabled={replyBusy === t.senderUsername}
                      onClick={() => sendReply(t.senderUsername, t.otherId)}
                      className="btn-accent rounded-lg px-3 py-1.5 text-sm font-semibold"
                    >
                      Gönder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status === "loading") return null;

  if (status !== "authenticated") {
    return (
      <div className="mt-5 rounded-lg border border-dashed border-border p-4 text-center">
        <p className="mb-2 text-sm text-ink-muted">Satıcıya mesaj göndermek için giriş yapın.</p>
        <Link
          href={`/giris?callbackUrl=${encodeURIComponent(pathname)}`}
          className="btn-accent inline-block rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={sendMessage} className="mt-5">
      <h2 className="mb-2 font-display text-base font-semibold">Satıcıya Mesaj Gönder</h2>
      <textarea
        value={msgDraft}
        onChange={(e) => setMsgDraft(e.target.value)}
        rows={3}
        placeholder="Tezgah hakkında merak ettiklerinizi yazın..."
        className="input w-full resize-none rounded-lg px-3 py-2 text-sm"
      />
      {msgError && <p className="mt-1 text-xs text-red-500">{msgError}</p>}
      {msgOk && <p className="mt-1 text-xs text-emerald-600">Mesajınız gönderildi.</p>}
      <button
        type="submit"
        disabled={msgBusy || sold}
        className="btn-accent mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {sold ? "İlan Satıldı" : msgBusy ? "Gönderiliyor..." : "Mesaj Gönder"}
      </button>
    </form>
  );
}
