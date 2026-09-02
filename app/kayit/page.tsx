"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { CITIES } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"BIREYSEL" | "BAYI">("BIREYSEL");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    city: "İstanbul",
    fullName: "",
    companyName: "",
    phone: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, accountType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kayıt oluşturulamadı.");
        return;
      }

      if (accountType === "BAYI" && !data.approved) {
        router.push("/giris?registered=bayi");
        return;
      }

      const signInRes = await signIn("credentials", {
        username: form.username,
        password: form.password,
        accountType,
        redirect: false,
      });
      if (signInRes?.error) {
        router.push("/giris");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-1 text-center font-display text-2xl font-bold">Üye Ol</h1>
      <p className="mb-6 text-center text-sm text-ink-muted">Ücretsiz üye olun, hemen ilan verin veya satıcılarla iletişime geçin.</p>

      <div className="mb-5 flex overflow-hidden rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setAccountType("BIREYSEL")}
          className={`flex-1 py-2.5 text-sm font-semibold ${
            accountType === "BIREYSEL" ? "bg-blueprint text-white" : "bg-surface text-ink-muted"
          }`}
        >
          Bireysel Üyelik
        </button>
        <button
          type="button"
          onClick={() => setAccountType("BAYI")}
          className={`flex-1 py-2.5 text-sm font-semibold ${
            accountType === "BAYI" ? "bg-blueprint text-white" : "bg-surface text-ink-muted"
          }`}
        >
          Bayi Üyeliği
        </button>
      </div>

      {accountType === "BAYI" && (
        <p className="mb-4 rounded-lg bg-surface2 px-3 py-2 text-xs text-ink-muted">
          Bayi hesapları, sahte ilanları önlemek için yönetici onayından sonra aktif olur.
        </p>
      )}

      <form onSubmit={handleSubmit} className="card flex flex-col gap-3 p-5">
        {accountType === "BIREYSEL" ? (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Ad Soyad
            </label>
            <input
              required
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
        ) : (
          <>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Firma Adı
              </label>
              <input
                required
                value={form.companyName}
                onChange={(e) => set("companyName", e.target.value)}
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Telefon
              </label>
              <input
                required
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="0212 000 00 00"
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
          </>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Kullanıcı Adı
          </label>
          <input
            required
            value={form.username}
            onChange={(e) => set("username", e.target.value.toLowerCase())}
            pattern="[a-z0-9][a-z0-9._-]{2,23}"
            title="3-24 karakter, küçük harf ve rakam"
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            E-posta
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">Şifre</label>
          <input
            required
            type="password"
            minLength={6}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">Şehir</label>
          <select
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="btn-accent mt-1 rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {busy ? "Kaydediliyor..." : "Üye Ol"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-muted">
        Zaten üye misiniz?{" "}
        <Link href="/giris" className="font-semibold text-blueprint hover:underline">
          Giriş yapın
        </Link>
      </p>
    </div>
  );
}
