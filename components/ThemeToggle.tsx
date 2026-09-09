"use client";

import { useEffect, useState } from "react";
import { useT } from "@/components/i18n/LanguageProvider";

export default function ThemeToggle() {
  const t = useT();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tezgahci_theme");
    const isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("tezgahci_theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? t("themeToggle.switchToLight") : t("themeToggle.switchToDark")}
      className="input flex h-9 w-9 items-center justify-center rounded-full text-sm"
      type="button"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
