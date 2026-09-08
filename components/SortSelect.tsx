"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useT } from "./i18n/LanguageProvider";

export default function SortSelect({ defaultValue }: { defaultValue: string }) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("sort", e.target.value);
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <select
      defaultValue={defaultValue}
      onChange={onChange}
      className="input rounded-lg px-3 py-1.5 text-sm"
      aria-label={t("common.filter")}
    >
      <option value="date_desc">{t("listings.sortNewest")}</option>
      <option value="price_asc">{t("listings.sortPriceAsc")}</option>
      <option value="price_desc">{t("listings.sortPriceDesc")}</option>
    </select>
  );
}
