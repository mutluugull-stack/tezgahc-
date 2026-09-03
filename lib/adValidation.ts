import { z } from "zod";
import { CATEGORIES } from "@/lib/constants";

// Reklamlar panelinin (oluşturma/düzenleme) ve /api/admin/ads uçlarının ortak
// doğrulama şeması. route.ts dosyaları yalnızca HTTP metodu export etmelidir,
// bu yüzden şema burada tutulur.

export const PLACEMENTS = [
  "HOME_SEARCH_BANNER",
  "HOME_AFTER_VITRIN",
  "HOME_SERVICE_CARD",
  "LISTING_TOP_BANNER",
  "LISTING_INFEED",
  "LISTING_SIDEBAR",
] as const;

export type Placement = (typeof PLACEMENTS)[number];

export const PLACEMENT_LABELS: Record<Placement, string> = {
  HOME_SEARCH_BANNER: "Ana Sayfa — Arama Altı Banner",
  HOME_AFTER_VITRIN: "Ana Sayfa — Vitrin Sonrası Alan",
  HOME_SERVICE_CARD: "Ana Sayfa — Sponsorlu Hizmet Kartı",
  LISTING_TOP_BANNER: "İlan Listesi — Üst Banner",
  LISTING_INFEED: "İlan Listesi — Akış İçi (Her 8 İlanda Bir)",
  LISTING_SIDEBAR: "İlan Listesi — Sağ Sidebar (Masaüstü)",
};

const CATEGORY_KEYS = CATEGORIES.map((c) => c.key);

const httpUrl = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} girin.`)
    .url(`${label} geçerli bir bağlantı olmalı.`)
    .refine((v) => /^https?:\/\//i.test(v), `${label} http:// veya https:// ile başlamalı.`);

export const adSchema = z
  .object({
    advertiserName: z.string().trim().min(2, "Reklamveren adı girin.").max(120),
    imageUrlDesktop: httpUrl("Masaüstü görseli"),
    imageUrlMobile: z
      .union([httpUrl("Mobil görsel"), z.literal("")])
      .optional()
      .transform((v) => (v ? v : null)),
    altText: z.string().trim().min(2, "Alternatif metin girin.").max(160),
    targetUrl: httpUrl("Hedef bağlantı"),
    placement: z.enum(PLACEMENTS),
    category: z
      .union([z.enum(CATEGORY_KEYS as [string, ...string[]]), z.literal("")])
      .optional()
      .transform((v) => (v ? v : null)),
    startDate: z
      .union([z.string().min(1), z.literal("")])
      .optional()
      .transform((v) => (v ? new Date(v) : null)),
    endDate: z
      .union([z.string().min(1), z.literal("")])
      .optional()
      .transform((v) => (v ? new Date(v) : null)),
    priority: z.coerce.number().int().min(1, "Öncelik en az 1 olmalı.").max(10, "Öncelik en fazla 10 olabilir.").default(1),
    active: z.boolean().default(true),
  })
  .refine((d) => !d.startDate || !isNaN(d.startDate.getTime()), {
    message: "Başlangıç tarihi geçersiz.",
    path: ["startDate"],
  })
  .refine((d) => !d.endDate || !isNaN(d.endDate.getTime()), {
    message: "Bitiş tarihi geçersiz.",
    path: ["endDate"],
  })
  .refine((d) => !d.startDate || !d.endDate || d.endDate >= d.startDate, {
    message: "Bitiş tarihi başlangıçtan önce olamaz.",
    path: ["endDate"],
  });

export const adUpdateSchema = adSchema;
