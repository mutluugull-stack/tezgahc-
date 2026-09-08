export type RateItem = {
  buy: number;
  sell: number;
  changePercent: number;
};

export type MarketRates = {
  updatedAt: string;
  fetchedAt: string;
  usd: RateItem;
  eur: RateItem;
  gbp: RateItem;
  gramAltin: RateItem;
};

const TRUNCGIL_URL = "https://finans.truncgil.com/today.json";

function parseTLNumber(raw: unknown): number {
  if (typeof raw !== "string" || raw.length === 0) return 0;
  const normalized = raw.replace(/\./g, "").replace(",", ".");
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

function parseChangePercent(raw: unknown): number {
  if (typeof raw !== "string" || raw.length === 0) return 0;
  const normalized = raw.replace("%", "").replace(",", ".");
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

function pickRate(raw: Record<string, any>, keys: string[]): RateItem {
  for (const key of keys) {
    const entry = raw[key];
    if (entry && typeof entry === "object") {
      const buyRaw = entry["Alış"] ?? entry["Alis"] ?? entry["Buying"];
      const sellRaw = entry["Satış"] ?? entry["Satis"] ?? entry["Selling"];
      const changeRaw = entry["Değişim"] ?? entry["Degisim"] ?? entry["Change"];
      return {
        buy: parseTLNumber(buyRaw),
        sell: parseTLNumber(sellRaw),
        changePercent: parseChangePercent(changeRaw),
      };
    }
  }
  return { buy: 0, sell: 0, changePercent: 0 };
}

export async function fetchMarketRates(): Promise<MarketRates> {
  const res = await fetch(TRUNCGIL_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; TezgahciBot/1.0)" },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    throw new Error(`Truncgil API ${res.status}`);
  }
  const raw = (await res.json()) as Record<string, any>;

return {
  updatedAt: typeof raw.Update_Date === "string" ? raw.Update_Date : "",
  fetchedAt: new Date().toISOString(),
  usd: pickRate(raw, ["USD"]),
  eur: pickRate(raw, ["EUR"]),
  gbp: pickRate(raw, ["GBP"]),
  gramAltin: pickRate(raw, ["gram-altin", "GRAM-ALTIN", "gram-altın"]),
};
}
