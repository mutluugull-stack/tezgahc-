export const CATEGORIES = [
  { key: "torna", label: "CNC Torna" },
  { key: "freze", label: "CNC Freze / İşleme Merkezi" },
  { key: "router", label: "CNC Router" },
  { key: "lazer", label: "Lazer Kesim" },
  { key: "plazma", label: "Plazma Kesim" },
  { key: "edm", label: "Erozyon (EDM)" },
  { key: "abkant", label: "Abkant Pres" },
  { key: "diger", label: "Diğer" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export const CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Kocaeli",
  "Konya",
  "Kayseri",
  "Gaziantep",
  "Denizli",
  "Adana",
  "Eskişehir",
  "Manisa",
  "Tekirdağ",
  "Sakarya",
  "Diğer",
];

export const CONTROLLERS = [
  "Fanuc",
  "Siemens",
  "Mitsubishi",
  "Heidenhain",
  "Fagor",
  "Mazatrol",
  "Haas",
  "Okuma OSP",
  "GSK",
  "Syntec",
  "DMG Mori Celos",
  "Num",
  "Fidia",
  "Baldor",
  "Delta",
  "Weihong",
  "Centroid",
  "LinuxCNC",
  "Diğer",
] as const;

export const AXIS_COUNTS = [
  "2 Eksen",
  "2.5 Eksen",
  "3 Eksen",
  "3.5 Eksen",
  "4 Eksen",
  "4.5 Eksen",
  "5 Eksen",
  "5+ Eksen",
  "6 Eksen",
  "9 Eksen",
] as const;

export const CONDITIONS: { key: "SIFIR" | "IKINCI_EL" | "YENILENMIS"; label: string }[] = [
  { key: "SIFIR", label: "Sıfır" },
  { key: "IKINCI_EL", label: "İkinci El" },
  { key: "YENILENMIS", label: "Yenilenmiş" },
];

export const CURRENCIES: { key: "TRY" | "USD" | "EUR"; label: string; symbol: string }[] = [
  { key: "TRY", label: "TL", symbol: "₺" },
  { key: "USD", label: "Dolar", symbol: "$" },
  { key: "EUR", label: "Euro", symbol: "€" },
];

export function catLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label || key;
}

export function conditionLabel(key: string): string {
  return CONDITIONS.find((c) => c.key === key)?.label || key;
}

export function currencySymbol(key: string): string {
  return CURRENCIES.find((c) => c.key === key)?.symbol || key;
}

export function fmtPrice(n: number, currency: string = "TRY"): string {
  const symbol = currencySymbol(currency);
  const formatted = new Intl.NumberFormat("tr-TR").format(n);
  return `${formatted} ${symbol}`;
}

export function fmtDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function fmtDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export const ADMIN_STATS_LABELS = {
  activeListings: "Aktif İlan",
  soldListings: "Satılan İlan",
  individualUsers: "Bireysel Üye",
  dealerUsers: "Bayi Üye",
  pendingDealers: "Onay Bekleyen Bayi",
};
