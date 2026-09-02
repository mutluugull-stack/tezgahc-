"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortSelect({ defaultValue }: { defaultValue: string }) {
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
      aria-label="Sıralama"
    >
      <option value="date_desc">En Yeni</option>
      <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
      <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
    </select>
  );
}
