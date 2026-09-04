import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base font-semibold text-blueprint">TEZGAHÇI</p>
          <p>Türkiye&apos;nin CNC tezgah ve makine pazarı.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/ilanlar" className="hover:text-ink">
            İlanlar
          </Link>
          <Link href="/ilan-ver" className="hover:text-ink">
            İlan Ver
          </Link>
          <Link href="/kayit" className="hover:text-ink">
            Üye Ol
          </Link>
          <Link href="/admin" className="hover:text-ink">
            Yönetici Girişi
          </Link>
          <Link href="/gizlilik" className="hover:text-ink">
            Gizlilik ve KVKK
          </Link>
          <Link href="/kullanim-sartlari" className="hover:text-ink">
            Kullanım Şartları
          </Link>
        </div>
        <p>© {new Date().getFullYear()} Tezgahçı · tezgahci.com.tr</p>
      </div>
    </footer>
  );
}
