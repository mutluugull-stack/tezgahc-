"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { BackIcon } from "@/components/Icons";
import AccountSettingsForm from "@/components/AccountSettingsForm";
import { useT } from "@/components/i18n/LanguageProvider";

export default function AyarlarPage() {
  const { status } = useSession();
  const t = useT();

if (status === "loading") {
  return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-ink-muted">{t("common.loading")}</div>;
    }

  if (status !== "authenticated") {
    return (
  <div className="mx-auto max-w-md px-4 py-16 text-center">
  <h1 className="mb-2 font-display text-2xl font-bold">{t("settings.loginRequiredTitle")}</h1>
  <div className="mt-4 flex justify-center gap-2">
  <Link href="/giris?callbackUrl=/ayarlar" className="input rounded-lg px-4 py-2 text-sm font-semibold">
  {t("auth.loginTitle")}
  </Link>
  </div>
  </div>
  );
    }

  return (
  <div className="mx-auto max-w-2xl px-4 py-6">
  <Link href="/" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
  <BackIcon className="h-4 w-4" /> {t("settings.backHome")}
  </Link>
  <h1 className="mb-1 font-display text-2xl font-bold">{t("settings.title")}</h1>
  <p className="mb-5 text-sm text-ink-muted">{t("settings.subtitle")}</p>

  <AccountSettingsForm />
  </div>
  );
    }
