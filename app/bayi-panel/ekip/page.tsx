"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fmtDate } from "@/lib/constants";
import EmptyState from "@/components/EmptyState";
import { BackIcon, TrashIcon, PlusIcon } from "@/components/Icons";
import { useT } from "@/components/i18n/LanguageProvider";

type Member = {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  role: string | null;
  approved: boolean;
  createdAt: string;
  _count: { listings: number };
};

const emptyForm = { username: "", email: "", password: "", fullName: "", role: "Müşteri Temsilcisi" };

export default function BayiEkipPage() {
  const t = useT();
  const [members, setMembers] = useState<Member[] | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetch("/api/bayi/ekip")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || t("dealerPanel.teamListError"));
        return data;
      })
      .then((data) => setMembers(data.members))
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
  }, []);

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setBusy(true);
    try {
      const res = await fetch("/api/bayi/ekip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || t("dealerPanel.addMemberError"));
        return;
      }
      setForm(emptyForm);
      load();
    } finally {
      setBusy(false);
    }
  }

  async function removeMember(id: string) {
    if (!confirm(t("dealerPanel.removeConfirm"))) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/bayi/ekip/${id}`, { method: "DELETE" });
      if (res.ok) load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link href="/bayi-panel" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> {t("dealerPanel.myPanelTitle")}
      </Link>
      <h1 className="mb-1 font-display text-2xl font-bold">{t("dealerPanel.tileTeam")}</h1>
      <p className="mb-5 text-sm text-ink-muted">{t("dealerPanel.teamSubtitle")}</p>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!error && (
        <>
          {!members && <p className="text-sm text-ink-muted">{t("common.loading")}</p>}

          {members && (
            <div className="mb-6">
              {members.length === 0 ? (
                <EmptyState title={t("dealerPanel.emptyTeamTitle")} description={t("dealerPanel.emptyTeamDesc")} />
              ) : (
                <div className="flex flex-col gap-2">
                  {members.map((m) => (
                    <div key={m.id} className="card flex items-center justify-between gap-3 p-3.5">
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {m.fullName || `@${m.username}`}
                          <span className="ml-2 rounded-full bg-surface2 px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
                            {m.role || t("dealerProfile.teamMemberRole")}
                          </span>
                        </p>
                        <p className="text-xs text-ink-muted">
                          @{m.username} · {m.email} · {t("dealerProfile.listingCount").replace("{n}", String(m._count.listings))} · {fmtDate(m.createdAt)}
                        </p>
                      </div>
                      <button
                        disabled={busyId === m.id}
                        onClick={() => removeMember(m.id)}
                        title={t("dealerPanel.removeTooltip")}
                        className="input flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <form onSubmit={addMember} className="card flex flex-col gap-4 p-5">
            <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold">
              <PlusIcon className="h-4 w-4" /> {t("dealerPanel.addMemberSectionTitle")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {t("dealerPanel.fullNameRequired")}
                </label>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="input w-full rounded-lg px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {t("dealerPanel.roleLabel")}
                </label>
                <input
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="Müşteri Temsilcisi"
                  className="input w-full rounded-lg px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {t("dealerPanel.usernameRequired")}
                </label>
                <input
                  required
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  className="input w-full rounded-lg px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {t("dealerPanel.emailRequired")}
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="input w-full rounded-lg px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {t("dealerPanel.tempPasswordRequired")}
                </label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="input w-full rounded-lg px-3 py-2.5 text-sm"
                />
              </div>
            </div>
            {formError && <p className="text-sm text-red-500">{formError}</p>}
            <button disabled={busy} type="submit" className="btn-accent self-start rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
              {busy ? t("dealerPanel.adding") : t("dealerPanel.addMemberButton")}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
