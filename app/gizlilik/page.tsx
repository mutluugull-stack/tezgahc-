import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/locale-server";
import { t, type TranslationKey } from "@/lib/i18n/translations";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  return {
    title: `${t("legal.privacy.pageTitle", locale)} | Tezgahçı`,
    description: t("legal.privacy.metaDescription", locale),
  };
}

export default function GizlilikPage() {
  const locale = getLocale();
  const tt = (key: TranslationKey) => t(key, locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-1 font-display text-2xl font-bold">{tt("legal.privacy.pageTitle")}</h1>
      <p className="mb-8 text-sm text-ink-muted">{tt("legal.privacy.lastUpdated")}</p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.privacy.section1Title")}</h2>
          <p className="text-ink-muted" dangerouslySetInnerHTML={{ __html: tt("legal.privacy.section1Body") }} />
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.privacy.section2Title")}</h2>
          <p className="mb-2 text-ink-muted">{tt("legal.privacy.section2Intro")}</p>
          <p className="text-ink-muted">{tt("legal.privacy.section2Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.privacy.section3Title")}</h2>
          <p className="mb-2 text-ink-muted">{tt("legal.privacy.section3Intro")}</p>
          <p className="mb-2 text-ink-muted" dangerouslySetInnerHTML={{ __html: tt("legal.privacy.section3Location") }} />
          <p className="mb-2 text-ink-muted" dangerouslySetInnerHTML={{ __html: tt("legal.privacy.section3Device") }} />
          <p className="text-ink-muted">{tt("legal.privacy.section3Note")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.privacy.section4Title")}</h2>
          <p className="text-ink-muted">{tt("legal.privacy.section4Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.privacy.section5Title")}</h2>
          <p className="text-ink-muted">{tt("legal.privacy.section5Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.privacy.section6Title")}</h2>
          <p className="text-ink-muted">{tt("legal.privacy.section6Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.privacy.section7Title")}</h2>
          <p className="text-ink-muted">{tt("legal.privacy.section7Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.privacy.section8Title")}</h2>
          <p className="mb-2 text-ink-muted">{tt("legal.privacy.section8Intro")}</p>
          <p className="text-ink-muted">{tt("legal.privacy.section8Body")}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">{tt("legal.privacy.section9Title")}</h2>
          <p className="text-ink-muted">
            {tt("legal.privacy.section9BodyPrefix")}{" "}
            <strong className="text-ink">{tt("legal.privacy.contactEmailPlaceholder")}</strong>{" "}
            {tt("legal.privacy.section9BodySuffix")}
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-border pt-4 text-sm">
        <Link href="/kullanim-sartlari" className="font-semibold text-blueprint hover:underline">
          {tt("legal.privacy.footerLink")}
        </Link>
      </div>
    </div>
  );
}
