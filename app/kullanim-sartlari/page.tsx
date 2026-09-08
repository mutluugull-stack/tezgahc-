import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/locale-server";
import { t, type TranslationKey } from "@/lib/i18n/translations";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  return {
    title: `${t("legal.terms.pageTitle", locale)} | Tezgahçı`,
    description: t("legal.terms.metaDescription", locale),
  };
}

export default function KullanimSartlariPage() {
  const locale = getLocale();
  const tt = (key: TranslationKey) => t(key, locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-1 font-display text-2xl font-bold">{tt("legal.terms.pageTitle")}</h1>
      <p className="mb-8 text-sm text-ink-muted">{tt("legal.terms.lastUpdated")}</p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.terms.section1Title")}</h2>
          <p className="text-ink-muted">{tt("legal.terms.section1Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.terms.section2Title")}</h2>
          <p className="text-ink-muted">{tt("legal.terms.section2Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.terms.section3Title")}</h2>
          <p className="text-ink-muted">{tt("legal.terms.section3Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.terms.section4Title")}</h2>
          <p className="text-ink-muted">{tt("legal.terms.section4Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.terms.section5Title")}</h2>
          <p className="text-ink-muted">{tt("legal.terms.section5Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.terms.section6Title")}</h2>
          <p className="text-ink-muted">{tt("legal.terms.section6Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.terms.section7Title")}</h2>
          <p className="text-ink-muted">{tt("legal.terms.section7Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.terms.section8Title")}</h2>
          <p className="text-ink-muted">{tt("legal.terms.section8Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.terms.section9Title")}</h2>
          <p className="text-ink-muted">
            {tt("legal.terms.section9BodyPrefix")}{" "}
            <strong className="text-ink">{tt("legal.privacy.contactEmailPlaceholder")}</strong>
            {tt("legal.terms.section9BodySuffix")}
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-border pt-4 text-sm">
        <Link href="/gizlilik" className="font-semibold text-blueprint hover:underline">
          {tt("legal.terms.footerLink")}
        </Link>
      </div>
    </div>
  );
}
