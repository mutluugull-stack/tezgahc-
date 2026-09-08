"use client";

import { useState, useRef, useEffect } from "react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/translations";
import { useLanguage } from "./LanguageProvider";
import { GlobeIcon } from "../Icons";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="input flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium"
        aria-label="Dil seçin / Language / Sprache"
      >
        <GlobeIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[9rem] overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          {LOCALES.map((l: Locale) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-surface2 ${
                l === locale ? "font-semibold text-blueprint" : "text-ink"
              }`}
            >
              {LOCALE_LABELS[l]}
              {l === locale && <span className="text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
