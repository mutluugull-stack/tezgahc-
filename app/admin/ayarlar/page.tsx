"use client";

import Link from "next/link";
import { BackIcon } from "@/components/Icons";
import AccountSettingsForm from "@/components/AccountSettingsForm";

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Yönetici Paneli
      </Link>
      <h1 className="mb-1 font-display text-2xl font-bold">Ayarlar</h1>
      <p className="mb-5 text-sm text-ink-muted">Yönetici hesap bilgilerinizi güncelleyin.</p>

      <AccountSettingsForm />
    </div>
  );
}
