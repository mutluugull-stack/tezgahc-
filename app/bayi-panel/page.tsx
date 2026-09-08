"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import AppGrid, { type AppTile } from "@/components/AppGrid";
import { WrenchIcon, IdCardIcon, ChartIcon, GearIcon } from "@/components/Icons";
import { useT } from "@/components/i18n/LanguageProvider";

const iconProps = { className: "h-6 w-6" };

export default function BayiPanelPage() {
  const { data: session, status } = useSession();
  const t = useT();

  if (status === "loading") {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-ink-muted">{t("common.loading")}</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">{t("dealerPanel.loginRequiredTitle")}</h1>
        <div className="mt-4 flex justify-center gap-2">
          <Link href="/giris?callbackUrl=/bayi-panel" className="input rounded-lg px-4 py-2 text-sm font-semibold">
            {t("auth.loginTitle")}
          </Link>
        </div>
      </div>
    );
  }

  if (session.user.accountType !== "BAYI") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">{t("dealerPanel.individualOnlyTitle")}</h1>
        <p className="text-sm text-ink-muted">{t("dealerPanel.individualOnlyDesc")}</p>
      </div>
    );
  }

  if (!session.user.approved) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">{t("dealerPanel.pendingApprovalTitle")}</h1>
        <p className="text-sm text-ink-muted">
          {t("dealerPanel.pendingApprovalDesc")}
        </p>
      </div>
    );
  }

  const isTeamMember = !!session.user.parentDealerId;

  const tiles: AppTile[] = [
    { href: "/bayi-panel/ilanlarim", label: t("dealerPanel.tileListings"), icon: <WrenchIcon {...iconProps} />, color: "#0f9d58" },
    ...(isTeamMember
      ? []
      : [{ href: "/bayi-panel/ekip", label: t("dealerPanel.tileTeam"), icon: <IdCardIcon {...iconProps} />, color: "#2f6fed" }]),
    { href: "/bayi-panel/istatistikler", label: t("dealerPanel.tileStats"), icon: <ChartIcon {...iconProps} />, color: "#004aad" },
    { href: "/bayi-panel/ayarlar", label: t("settings.title"), icon: <GearIcon {...iconProps} />, color: "#64748b" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-1 font-display text-2xl font-bold">{t("dealerPanel.myPanelTitle")}</h1>
      <p className="mb-5 text-sm text-ink-muted">
        {session.user.name}
        {isTeamMember && ` · ${t("dealerProfile.teamMemberRole")}`}
      </p>

      <div className="card p-4">
        <AppGrid tiles={tiles} />
      </div>
    </div>
  );
}
