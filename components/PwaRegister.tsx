"use client";

import { useEffect } from "react";

/**
 * Mobil Safari (iOS) ve mobil Chrome (Android) tarayıcılarından siteyi
 * "Ana ekrana ekle / Uygulamayı yükle" ile kurulabilir hale getiren service
 * worker'ı arka planda kaydeder. Görünür bir arayüzü yoktur.
 */
export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Capacitor'ın native kabuğu (Android/iOS uygulaması) içinde çalışırken
    // ayrıca bir service worker kaydetmeye gerek yok — bu yalnızca sitenin
    // düz tarayıcıdan (Safari/Chrome) PWA olarak kurulabilmesi içindir.
    // @ts-expect-error Capacitor global'i yalnızca native kabukta bulunur
    if (window.Capacitor?.isNativePlatform?.()) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Sessizce yok say — PWA kurulabilirliği bir "nice to have", siteyi
      // bloklamamalı.
    });
  }, []);

  return null;
}
