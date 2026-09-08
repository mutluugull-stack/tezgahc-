import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./translations";

// Sunucu bileşenlerinde aktif dili okumak için. Next.js 14'te cookies()
// senkrondur. Bilinmeyen/eksik değerde varsayılan dile (tr) düşer.
export function getLocale(): Locale {
  const raw = cookies().get(LOCALE_COOKIE)?.value;
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}
