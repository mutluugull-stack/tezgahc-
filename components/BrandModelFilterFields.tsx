"use client";

import { useMemo, useState } from "react";
import { CNC_BRANDS, CNC_BRAND_NAMES, CNC_ALL_MODELS } from "@/lib/cnc-brands";

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
const inputClass = "input w-full rounded-lg px-3 py-2 text-sm";
const dropdownClass =
  "absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-border bg-surface shadow-lg";

type Props = {
  defaultBrand?: string;
  defaultModel?: string;
};

// Filtre formu için Marka/Model otomatik tamamlama alanları. Kendi state'ini
// tutar ve native <form> GET submit akışına name="brand" / name="model"
// input'ları ile katılır — sayfa bir server component olduğu için burada
// controlled değil, kendi kendine yeten (self-contained) bir istemci bileşeni.
export default function BrandModelFilterFields({ defaultBrand = "", defaultModel = "" }: Props) {
  const [brand, setBrand] = useState(defaultBrand);
  const [model, setModel] = useState(defaultModel);
  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [brandHi, setBrandHi] = useState(0);
  const [modelHi, setModelHi] = useState(0);

  const selectedBrandEntry = useMemo(
    () => CNC_BRANDS.find((b) => normalize(b.name) === normalize(brand.trim())),
    [brand]
  );

  const brandMatches = useMemo(() => {
    const q = normalize(brand.trim());
    const pool = q ? CNC_BRAND_NAMES.filter((name) => normalize(name).includes(q)) : CNC_BRAND_NAMES;
    return pool.slice(0, q ? 8 : 100);
  }, [brand]);

  const modelMatches = useMemo(() => {
    const q = normalize(model.trim());
    if (selectedBrandEntry) {
      const pool = q
        ? selectedBrandEntry.models.filter((m) => normalize(m).includes(q))
        : selectedBrandEntry.models;
      return pool.slice(0, q ? 8 : 100).map((m) => ({ label: m, brand: selectedBrandEntry.name }));
    }
    const pool = q ? CNC_ALL_MODELS.filter((m) => normalize(m.label).includes(q)) : CNC_ALL_MODELS;
    return pool.slice(0, q ? 8 : 40);
  }, [model, selectedBrandEntry]);

  function selectBrand(name: string) {
    setBrand(name);
    setBrandOpen(false);
  }

  function selectModel(m: { label: string; brand: string }) {
    setModel(m.label);
    if (!selectedBrandEntry) setBrand(m.brand);
    setModelOpen(false);
  }

  return (
    <>
      <div className="relative">
        <label className={labelClass}>Marka</label>
        <input
          name="brand"
          value={brand}
          autoComplete="off"
          placeholder="örn. Haas, DMG Mori, Mazak..."
          onChange={(e) => {
            setBrand(e.target.value);
            setBrandOpen(true);
            setBrandHi(0);
          }}
          onFocus={() => setBrandOpen(true)}
          onBlur={() => setTimeout(() => setBrandOpen(false), 120)}
          onKeyDown={(e) => {
            if (!brandOpen || brandMatches.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setBrandHi((i) => Math.min(i + 1, brandMatches.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setBrandHi((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              selectBrand(brandMatches[brandHi]);
            } else if (e.key === "Escape") {
              setBrandOpen(false);
            }
          }}
          className={inputClass}
        />
        {brandOpen && brandMatches.length > 0 && (
          <ul className={dropdownClass}>
            {brandMatches.map((name, i) => (
              <li
                key={name}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectBrand(name);
                }}
                className={`cursor-pointer px-3 py-2 text-sm ${i === brandHi ? "bg-surface2" : "hover:bg-surface2"}`}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative">
        <label className={labelClass}>Model</label>
        <input
          name="model"
          value={model}
          autoComplete="off"
          placeholder={selectedBrandEntry ? "örn. VF-2, NLX 2500..." : "Model adı yazın"}
          onChange={(e) => {
            setModel(e.target.value);
            setModelOpen(true);
            setModelHi(0);
          }}
          onFocus={() => setModelOpen(true)}
          onBlur={() => setTimeout(() => setModelOpen(false), 120)}
          onKeyDown={(e) => {
            if (!modelOpen || modelMatches.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setModelHi((i) => Math.min(i + 1, modelMatches.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setModelHi((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              selectModel(modelMatches[modelHi]);
            } else if (e.key === "Escape") {
              setModelOpen(false);
            }
          }}
          className={inputClass}
        />
        {modelOpen && modelMatches.length > 0 && (
          <ul className={dropdownClass}>
            {modelMatches.map((m, i) => (
              <li
                key={`${m.brand}-${m.label}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectModel(m);
                }}
                className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm ${
                  i === modelHi ? "bg-surface2" : "hover:bg-surface2"
                }`}
              >
                <span>{m.label}</span>
                {!selectedBrandEntry && <span className="text-xs text-ink-muted">{m.brand}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
