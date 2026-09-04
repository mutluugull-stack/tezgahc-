import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const MONTH_LABELS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

// ISO 3166-2:TR bölge kodu (Vercel'in x-vercel-ip-country-region başlığı) ->
// il adı. Bu kodlar Türkiye'de araç plaka kodlarıyla birebir aynıdır.
const IL_PLAKA_KODLARI: Record<string, string> = {
  "01": "Adana",
  "02": "Adıyaman",
  "03": "Afyonkarahisar",
  "04": "Ağrı",
  "05": "Amasya",
  "06": "Ankara",
  "07": "Antalya",
  "08": "Artvin",
  "09": "Aydın",
  "10": "Balıkesir",
  "11": "Bilecik",
  "12": "Bingöl",
  "13": "Bitlis",
  "14": "Bolu",
  "15": "Burdur",
  "16": "Bursa",
  "17": "Çanakkale",
  "18": "Çankırı",
  "19": "Çorum",
  "20": "Denizli",
  "21": "Diyarbakır",
  "22": "Edirne",
  "23": "Elazığ",
  "24": "Erzincan",
  "25": "Erzurum",
  "26": "Eskişehir",
  "27": "Gaziantep",
  "28": "Giresun",
  "29": "Gümüşhane",
  "30": "Hakkari",
  "31": "Hatay",
  "32": "Isparta",
  "33": "Mersin",
  "34": "İstanbul",
  "35": "İzmir",
  "36": "Kars",
  "37": "Kastamonu",
  "38": "Kayseri",
  "39": "Kırklareli",
  "40": "Kırşehir",
  "41": "Kocaeli",
  "42": "Konya",
  "43": "Kütahya",
  "44": "Malatya",
  "45": "Manisa",
  "46": "Kahramanmaraş",
  "47": "Mardin",
  "48": "Muğla",
  "49": "Muş",
  "50": "Nevşehir",
  "51": "Niğde",
  "52": "Ordu",
  "53": "Rize",
  "54": "Sakarya",
  "55": "Samsun",
  "56": "Siirt",
  "57": "Sinop",
  "58": "Sivas",
  "59": "Tekirdağ",
  "60": "Tokat",
  "61": "Trabzon",
  "62": "Tunceli",
  "63": "Şanlıurfa",
  "64": "Uşak",
  "65": "Van",
  "66": "Yozgat",
  "67": "Zonguldak",
  "68": "Aksaray",
  "69": "Bayburt",
  "70": "Karaman",
  "71": "Kırıkkale",
  "72": "Batman",
  "73": "Şırnak",
  "74": "Bartın",
  "75": "Ardahan",
  "76": "Iğdır",
  "77": "Yalova",
  "78": "Karabük",
  "79": "Kilis",
  "80": "Osmaniye",
  "81": "Düzce",
};

const DEVICE_TYPE_LABELS: Record<string, string> = {
  mobile: "Mobil Telefon",
  tablet: "Tablet",
  desktop: "Bilgisayar",
};

function ilAdi(region: string | null, country: string | null) {
  if (country && country !== "TR") return country;
  if (!region) return "Bilinmiyor";
  // Vercel bazen "TR-34" formatında, bazen yalnızca "34" olarak gönderir.
  const kod = region.replace("TR-", "").padStart(2, "0");
  return IL_PLAKA_KODLARI[kod] || "Bilinmiyor";
}

function lastNDaysBuckets(n: number) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const buckets: { label: string; from: Date; to: Date }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const from = new Date(todayStart);
    from.setDate(from.getDate() - i);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);
    buckets.push({ label: `${from.getDate()} ${MONTH_LABELS[from.getMonth()]}`, from, to });
  }
  return buckets;
}

function referrerHost(referrer: string | null) {
  if (!referrer) return "Doğrudan / Bilinmiyor";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "Doğrudan / Bilinmiyor";
  }
}

// GET /api/admin/visits -> yönetici panelindeki "Ziyaretler" sayfası için
// site trafiği özeti (son 30 günlük ziyaret kayıtlarından hesaplanır).
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const since30 = new Date();
  since30.setDate(since30.getDate() - 30);

  const visits = await prisma.pageVisit.findMany({
    where: { createdAt: { gte: since30 } },
    select: {
      path: true,
      referrer: true,
      createdAt: true,
      country: true,
      region: true,
      deviceType: true,
      deviceModel: true,
    },
  });

  const buckets = lastNDaysBuckets(14);
  const visitsByDay = buckets.map((b) => ({
    label: b.label,
    count: visits.filter((v) => v.createdAt >= b.from && v.createdAt < b.to).length,
  }));

  const pathCounts = new Map<string, number>();
  for (const v of visits) pathCounts.set(v.path, (pathCounts.get(v.path) || 0) + 1);
  const topPages = [...pathCounts.entries()]
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const referrerCounts = new Map<string, number>();
  for (const v of visits) {
    const host = referrerHost(v.referrer);
    referrerCounts.set(host, (referrerCounts.get(host) || 0) + 1);
  }
  const topReferrers = [...referrerCounts.entries()]
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const provinceCounts = new Map<string, number>();
  for (const v of visits) {
    const il = ilAdi(v.region, v.country);
    provinceCounts.set(il, (provinceCounts.get(il) || 0) + 1);
  }
  const topProvinces = [...provinceCounts.entries()]
    .map(([province, count]) => ({ province, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const deviceTypeCounts = new Map<string, number>();
  for (const v of visits) {
    const tip = DEVICE_TYPE_LABELS[v.deviceType || "desktop"] || "Diğer";
    deviceTypeCounts.set(tip, (deviceTypeCounts.get(tip) || 0) + 1);
  }
  const deviceTypes = [...deviceTypeCounts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const deviceModelCounts = new Map<string, number>();
  for (const v of visits) {
    const model = v.deviceModel || (v.deviceType === "mobile" || v.deviceType === "tablet" ? "Bilinmeyen Model" : null);
    if (!model) continue;
    deviceModelCounts.set(model, (deviceModelCounts.get(model) || 0) + 1);
  }
  const topDeviceModels = [...deviceModelCounts.entries()]
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const since7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return NextResponse.json({
    totals: {
      today: visits.filter((v) => v.createdAt >= todayStart).length,
      last7Days: visits.filter((v) => v.createdAt >= since7).length,
      last30Days: visits.length,
    },
    visitsByDay,
    topPages,
    topReferrers,
    topProvinces,
    deviceTypes,
    topDeviceModels,
  });
}
