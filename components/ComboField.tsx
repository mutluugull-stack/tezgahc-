"use client";

import { useMemo, useState } from "react";

function normalize(s: string): string {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted";
const inputClass = "input w-full rounded-lg px-3 py-2.5 text-sm";
const dropdownClass =
  "absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-border bg-surface shadow-lg";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
};

// Genel amaçlı, tek alanlı aranabilir açılır liste (Kontrolör, Eksen Sayısı
// gibi serbest metin + öneri listesi gerektiren alanlar için). Controlled
// bileşen — state ilan-ver formunda tutulur.
export default function ComboField({ label, value, onChange, options, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);

  const matches = useMemo(() => {
    const q = normalize(value.trim());
    const pool = q ? options.filter((o) => normalize(o).includes(q)) : options;
    return pool.slice(0, q ? 8 : 100);
  }, [value, options]);

  function select(v: string) {
    onChange(v);
    setOpen(false);
  }

  return (
    <div className="relative">
      <label className={labelClass}>{label}</label>
      <input
        value={value}
        autoComplete="off"
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHi(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (!open || matches.length === 0) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHi((i) => Math.min(i + 1, matches.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHi((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            select(matches[hi]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className={inputClass}
      />
      {open && matches.length > 0 && (
        <ul className={dropdownClass}>
          {matches.map((m, i) => (
            <li
              key={m}
              onMouseDown={(e) => {
                e.preventDefault();
                select(m);
              }}
              className={`cursor-pointer px-3 py-2 text-sm ${i === hi ? "bg-surface2" : "hover:bg-surface2"}`}
            >
              {m}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
