"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "tezgahci_cerez_onay";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage erişilemezse (gizli sekme vb.) bandı hiç gösterme.
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // yoksay
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/98 px-4 py-3.5 pb-[calc(env(safe-area-inset-bottom)+0.875rem)] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-ink-muted sm:text-left">
          Tezgahçı, oturumunuzu yönetmek ve deneyiminizi iyileştirmek için zorunlu çerezler kullanır.
          Detaylar için{" "}
          <Link href="/gizlilik" className="font-semibold text-blueprint hover:underline">
            Gizlilik Politikası
          </Link>
          &apos;nı inceleyebilirsiniz.
        </p>
        <button
          type="button"
          onClick={accept}
          className="btn-accent shrink-0 rounded-lg px-5 py-2 text-sm font-semibold"
        >
          Anladım
        </button>
      </div>
    </div>
  );
}
