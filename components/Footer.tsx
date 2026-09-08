import Link from "next/link";
import { getLocale } from "@/lib/i18n/locale-server";
import { t } from "@/lib/i18n/translations";

export default function Footer() {
  const locale = getLocale();
  return (
    <footer className="mt-16 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base font-semibold text-blueprint">TEZGAHÇI</p>
          <p>{t("footer.tagline", locale)}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/ilanlar" className="hover:text-ink">
            {t("footer.listings", locale)}
          </Link>
          <Link href="/ilan-ver" className="hover:text-ink">
            {t("footer.postListing", locale)}
          </Link>
          <Link href="/kayit" className="hover:text-ink">
            {t("footer.register", locale)}
          </Link>
          <Link href="/admin" className="hover:text-ink">
            {t("footer.adminLogin", locale)}
          </Link>
          <Link href="/gizlilik" className="hover:text-ink">
            {t("footer.privacy", locale)}
          </Link>
          <Link href="/kullanim-sartlari" className="hover:text-ink">
            {t("footer.terms", locale)}
          </Link>
        </div>
        <p>© {new Date().getFullYear()} {t("footer.rights", locale)}</p>
      </div>
    </footer>
  );
}
