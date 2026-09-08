"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useT } from "@/components/i18n/LanguageProvider";

function LoginForm() {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const adminOnly = searchParams.get("adminOnly") === "1";

  const [accountType, setAccountType] = useState<"BIREYSEL" | "BAYI">("BIREYSEL");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await signIn("credentials", {
      username,
      password,
      accountType,
      redirect: false,
    });
    setBusy(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-1 text-center font-display text-2xl font-bold">{t("auth.loginTitle")}</h1>
      <p className="mb-6 text-center text-sm text-ink-muted">
        {adminOnly ? t("auth.loginSubtitleAdmin") : t("auth.loginSubtitle")}
      </p>

      <div className="mb-5 flex overflow-hidden rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setAccountType("BIREYSEL")}
          className={`flex-1 py-2.5 text-sm font-semibold ${
            accountType === "BIREYSEL" ? "bg-blueprint text-white" : "bg-surface text-ink-muted"
          }`}
        >
          {t("auth.userLoginTab")}
        </button>
        <button
          type="button"
          onClick={() => setAccountType("BAYI")}
          className={`flex-1 py-2.5 text-sm font-semibold ${
            accountType === "BAYI" ? "bg-blueprint text-white" : "bg-surface text-ink-muted"
          }`}
        >
          {t("auth.dealerLoginTab")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-3 p-5">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {t("auth.username")}
          </label>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">{t("auth.password")}</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full rounded-lg px-3 py-2.5 text-sm"
            autoComplete="current-password"
          />
          <p className="mt-1.5 text-xs text-ink-muted">
            {t("auth.forgotPasswordNote")}
          </p>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="btn-accent mt-1 rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {busy ? t("auth.loggingIn") : t("auth.loginTitle")}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-muted">
        {t("auth.noAccount")}{" "}
        <Link href="/kayit" className="font-semibold text-blueprint hover:underline">
          {t("auth.signUpLink")}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
