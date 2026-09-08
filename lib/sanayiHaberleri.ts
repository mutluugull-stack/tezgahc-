export type NewsItem = {
  title: string;
  source: string;
  link: string;
  publishedAt: string;
};

const FEED_URL = "https://news.google.com/rss/search?q=sanayi&hl=tr&gl=TR&ceid=TR:tr";

function decodeEntities(input: string): string {
  return input
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&apos;/g, "'")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&");
}

function extractTag(block: string, tag: string): string {
  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = block.match(pattern);
  if (!match) return "";
  const inner = match[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
  return decodeEntities(inner).trim();
}

async function fetchSanayiHaberleriRaw(limit: number): Promise<NewsItem[]> {
  const res = await fetch(FEED_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; TezgahciBot/1.0)" },
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) {
    throw new Error(`Google Haberler RSS ${res.status}`);
  }
  const xml = await res.text();
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

return blocks.slice(0, limit).map((block) => {
  const rawTitle = extractTag(block, "title");
  const link = extractTag(block, "link");
  const pubDate = extractTag(block, "pubDate");
  const sourceTag = extractTag(block, "source");

                                  let title = rawTitle;
  let source = sourceTag;
  const sepIndex = rawTitle.lastIndexOf(" - ");
  if (sepIndex > 0) {
    const tail = rawTitle.slice(sepIndex + 3).trim();
    if (!source || tail === source) {
      title = rawTitle.slice(0, sepIndex).trim();
      source = tail;
    }
  }

                                  return { title, source, link, publishedAt: pubDate };
});
}

let newsCache: { data: NewsItem[]; expiresAt: number } | null = null;
const NEWS_CACHE_MS = 10 * 60 * 1000;

export async function getSanayiHaberleri(limit = 6): Promise<NewsItem[]> {
  const now = Date.now();
  if (newsCache && newsCache.expiresAt > now) {
    return newsCache.data;
  }
  try {
    const data = await fetchSanayiHaberleriRaw(limit);
    newsCache = { data, expiresAt: now + NEWS_CACHE_MS };
    return data;
  } catch {
    if (newsCache) return newsCache.data;
    return [];
  }
}
