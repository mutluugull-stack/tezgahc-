"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import AppGrid, { type AppTile } from "@/components/AppGrid";
import { WrenchIcon, IdCardIcon, ChartIcon, GearIcon } from "@/components/Icons";

const iconProps = { className: "h-6 w-6" };

export default function BayiPanelPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-ink-muted">Yükleniyor...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">Bayi paneline erişmek için giriş yapın</h1>
        <div className="mt-4 flex justify-center gap-2">
          <Link href="/giris?callbackUrl=/bayi-panel" className="input rounded-lg px-4 py-2 text-sm font-semibold">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (session.user.accountType !== "BAYI") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">Bu panel yalnızca bayi hesapları içindir</h1>
        <p className="text-sm text-ink-muted">Bireysel hesabınızla bayi paneline erişemezsiniz.</p>
      </div>
    );
  }

  if (!session.user.approved) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">Bayi hesabınız onay bekliyor</h1>
        <p className="text-sm text-ink-muted">
          Hesabınız yönetici onayından geçtikten sonra bayi paneline erişebilirsiniz.
        </p>
      </div>
    );
  }

  const isTeamMember = !!session.user.parentDealerId;

  const tiles: AppTile[] = [
    { href: "/bayi-panel/ilanlarim", label: "İlanlarım", icon: <WrenchIcon {...iconProps} />, color: "#0f9d58" },
    ...(isTeamMember
      ? []
      : [{ href: "/bayi-panel/ekip", label: "Ekip", icon: <IdCardIcon {...iconProps} />, color: "#2f6fed" }]),
    { href: "/bayi-panel/istatistikler", label: "İstatistikler", icon: <ChartIcon {...iconProps} />, color: "#004aad" },
    { href: "/bayi-panel/ayarlar", label: "Ayarlar", icon: <GearIcon {...iconProps} />, color: "#64748b" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-1 font-display text-2xl font-bold">Bayi Panelim</h1>
      <p className="mb-5 text-sm text-ink-muted">
        {session.user.name}
        {isTeamMember && " · Ekip Üyesi"}
      </p>

      <div className="card p-4">
        <AppGrid tiles={tiles} />
      </div>
    </div>
  );
}
