"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Her sayfa gezinmesinde arka planda sessizce bir ziyaret kaydı gönderir.
 * Yönetici panelindeki "Ziyaretler" sayfasının veri kaynağıdır. Yönetici
 * panelinin kendi sayfaları (/admin/...) izlenmez — amaç ziyaretçi
 * trafiğini ölçmek, yöneticinin kendi kullanımını değil. Görünür bir
 * arayüzü yoktur.
 */
export default function VisitTracker() {
  const pathname = usePathname();

useEffect(() => {
  if (!pathname || pathname.startsWith("/admin")) return;

          try {
            const body = JSON.stringify({
              path: pathname,
              referrer: typeof document !== "undefined" ? document.referrer || null : null,
            });

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
  } else {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
          } catch {
            // Ziyaret takibi asla kullanıcı deneyimini bozmamalı.
          }
}, [pathname]);

return null;
}
