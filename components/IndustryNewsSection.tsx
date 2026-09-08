import { MegaphoneIcon, LinkIcon } from "./Icons";
import { getSanayiHaberleri } from "@/lib/sanayiHaberleri";
import { getLocale } from "@/lib/i18n/locale-server";
import { t } from "@/lib/i18n/translations";

function timeAgo(pubDate: string): string {
  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "az önce";
  if (diffMin < 60) return `${diffMin} dk önce`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} sa önce`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} gün önce`;
}

export default async function IndustryNewsSection() {
  const news = await getSanayiHaberleri(6);
  const locale = getLocale();

  if (news.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 font-display text-lg font-bold">
          <MegaphoneIcon className="h-5 w-5 text-blueprint" />
          {t("market.newsTitle", locale)}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((item, i) => (
          <a
            key={item.link || i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="card flex flex-col gap-2 px-4 py-3 transition-shadow hover:shadow-md"
          >
            <p className="line-clamp-3 text-sm font-medium text-ink">{item.title}</p>
            <div className="mt-auto flex items-center justify-between gap-2 text-[11px] text-ink-muted">
              <span className="truncate">{item.source || "Haber"}</span>
              <span className="flex shrink-0 items-center gap-1">
                <LinkIcon className="h-3 w-3" />
                {timeAgo(item.publishedAt)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
