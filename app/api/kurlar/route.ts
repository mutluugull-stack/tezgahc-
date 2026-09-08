import { NextResponse } from "next/server";
import { fetchMarketRates, type MarketRates } from "@/lib/marketData";

export const dynamic = "force-dynamic";

let cached: { data: MarketRates; expiresAt: number } | null = null;
const CACHE_MS = 45000;

export async function GET() {
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return NextResponse.json(cached.data);
  }

try {
  const data = await fetchMarketRates();
  cached = { data, expiresAt: now + CACHE_MS };
  return NextResponse.json(data);
} catch {
  if (cached) {
    return NextResponse.json(cached.data);
  }
  return NextResponse.json({ error: "Kurlar şu anda alınamıyor" }, { status: 502 });
}
}
