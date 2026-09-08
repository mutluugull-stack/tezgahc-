// Basit, bağımlılıksız çoklu dil sözlüğü. Yeni bir npm paketi kurmadan
// (next-intl vb.) App Router ile hem sunucu hem istemci bileşenlerinde
// çalışacak şekilde tasarlandı. Kullanıcı içerikleri (ilan başlığı/açıklaması
// gibi) buraya dahil değildir — her zaman girildiği dilde (Türkçe) kalır.

export const LOCALES = ["tr", "en", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "tr";

export const LOCALE_LABELS: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
};

export const LOCALE_COOKIE = "NEXT_LOCALE";

type Entry = Record<Locale, string>;

function e(tr: string, en: string, de: string): Entry {
  return { tr, en, de };
}

export const dict = {
  common: {
    loading: e("Yükleniyor...", "Loading...", "Wird geladen..."),
    save: e("Kaydet", "Save", "Speichern"),
    cancel: e("Vazgeç", "Cancel", "Abbrechen"),
    delete: e("Sil", "Delete", "Löschen"),
    edit: e("Düzenle", "Edit", "Bearbeiten"),
    search: e("Ara", "Search", "Suchen"),
    filter: e("Filtrele", "Filter", "Filtern"),
    clear: e("Temizle", "Clear", "Zurücksetzen"),
    send: e("Gönder", "Send", "Senden"),
    close: e("Kapat", "Close", "Schließen"),
    back: e("Geri", "Back", "Zurück"),
    next: e("İleri", "Next", "Weiter"),
    yes: e("Evet", "Yes", "Ja"),
    no: e("Hayır", "No", "Nein"),
    approve: e("Onayla", "Approve", "Genehmigen"),
    reject: e("Reddet", "Reject", "Ablehnen"),
    all: e("Tümü", "All", "Alle"),
    status: e("Durum", "Status", "Status"),
    date: e("Tarih", "Date", "Datum"),
    actions: e("İşlemler", "Actions", "Aktionen"),
    name: e("Ad", "Name", "Name"),
    email: e("E-posta", "Email", "E-Mail"),
    phone: e("Telefon", "Phone", "Telefon"),
    city: e("Şehir", "City", "Stadt"),
    price: e("Fiyat", "Price", "Preis"),
    category: e("Kategori", "Category", "Kategorie"),
    description: e("Açıklama", "Description", "Beschreibung"),
    title: e("Başlık", "Title", "Titel"),
    noResults: e("Sonuç bulunamadı.", "No results found.", "Keine Ergebnisse gefunden."),
    error: e("Bir hata oluştu.", "Something went wrong.", "Ein Fehler ist aufgetreten."),
    loginRequired: e("Bu işlem için giriş yapmalısınız.", "You must log in for this.", "Dafür müssen Sie sich anmelden."),
  },

  nav: {
    home: e("Ana Sayfa", "Home", "Startseite"),
    listings: e("İlanlar", "Listings", "Anzeigen"),
    postListing: e("İlan Ver", "Post Listing", "Anzeige aufgeben"),
    messages: e("Mesajlarım", "Messages", "Nachrichten"),
    messagesShort: e("Mesajlar", "Messages", "Nachrichten"),
    favorites: e("Favorilerim", "Favorites", "Favoriten"),
    dealerPanel: e("Bayi Panelim", "Dealer Panel", "Händlerbereich"),
    adminPanel: e("Panel", "Admin", "Admin"),
    login: e("Giriş Yap", "Log In", "Anmelden"),
    register: e("Üye Ol", "Sign Up", "Registrieren"),
    tagline: e("CNC Makine Pazarı", "CNC Machine Marketplace", "CNC-Maschinenmarkt"),
    language: e("Dil", "Language", "Sprache"),
  },

  footer: {
    tagline: e(
      "Türkiye'nin CNC tezgah ve makine pazarı.",
      "Turkey's CNC machine tool marketplace.",
      "Der türkische Marktplatz für CNC-Maschinen."
    ),
    listings: e("İlanlar", "Listings", "Anzeigen"),
    postListing: e("İlan Ver", "Post Listing", "Anzeige aufgeben"),
    register: e("Üye Ol", "Sign Up", "Registrieren"),
    adminLogin: e("Yönetici Girişi", "Admin Login", "Admin-Anmeldung"),
    privacy: e("Gizlilik ve KVKK", "Privacy Policy", "Datenschutz"),
    terms: e("Kullanım Şartları", "Terms of Use", "Nutzungsbedingungen"),
    rights: e("Tezgahçı · tezgahci.com.tr", "Tezgahçı · tezgahci.com.tr", "Tezgahçı · tezgahci.com.tr"),
  },

  home: {
    eyebrow: e(
      "Türkiye'nin CNC Makine Pazarı",
      "Turkey's CNC Machine Marketplace",
      "Der türkische CNC-Maschinenmarkt"
    ),
    title: e(
      "Tezgahınızı bulun, ilanınızı verin",
      "Find your machine, list yours",
      "Finden Sie Ihre Maschine, inserieren Sie Ihre"
    ),
    subtitle: e(
      "CNC torna, freze, router, lazer, plazma, EDM ve abkant pres tezgahları; yedek parça, yağ, aparat ve divizör ürünleri için alıcı ve satıcıları buluşturan ilan platformu.",
      "The listings platform connecting buyers and sellers of CNC lathes, mills, routers, lasers, plasma and EDM machines, press brakes, spare parts, lubricants, fixtures and rotary tables.",
      "Die Plattform, die Käufer und Verkäufer von CNC-Drehmaschinen, Fräsmaschinen, Routern, Laser-, Plasma- und EDM-Maschinen, Abkantpressen sowie Ersatzteilen, Schmierstoffen, Vorrichtungen und Drehtischen zusammenbringt."
    ),
    searchPlaceholder: e(
      "Marka, model veya anahtar kelime ara...",
      "Search brand, model or keyword...",
      "Marke, Modell oder Suchbegriff..."
    ),
    allCategories: e("Tüm Kategoriler", "All Categories", "Alle Kategorien"),
    statActiveListings: e("Aktif İlan", "Active Listings", "Aktive Anzeigen"),
    statDealers: e("Onaylı Bayi", "Verified Dealers", "Verifizierte Händler"),
    statCategories: e("Kategori", "Categories", "Kategorien"),
    showcaseTitle: e("Vitrin İlanlar", "Featured Listings", "Empfohlene Anzeigen"),
    viewAll: e("Tüm ilanları gör →", "View all listings →", "Alle Anzeigen ansehen →"),
    emptyShowcaseTitle: e(
      "Henüz vitrin ilanı yok",
      "No featured listings yet",
      "Noch keine empfohlenen Anzeigen"
    ),
    emptyShowcaseDesc: e(
      "İlk ilanı siz verin, burada öne çıksın.",
      "Be the first to post a listing and get featured here.",
      "Geben Sie die erste Anzeige auf und werden Sie hier vorgestellt."
    ),
  },

  market: {
    ratesTitle: e("Güncel Kurlar", "Exchange Rates", "Wechselkurse"),
    connectionIssue: e("Bağlantı sorunu", "Connection issue", "Verbindungsproblem"),
    lastUpdate: e("Son güncelleme", "Last updated", "Letzte Aktualisierung"),
    loadingRates: e("Yükleniyor...", "Loading...", "Wird geladen..."),
    buy: e("Alış", "Buy", "Kauf"),
    gramGold: e("Gram Altın", "Gold (gram)", "Gold (Gramm)"),
    newsTitle: e("Sanayi Haberleri", "Industry News", "Branchennachrichten"),
  },
} as const;

type DeepDict = typeof dict;

type PathsOf<T, Prefix extends string = ""> = T extends Entry
  ? Prefix extends `${infer P}.`
    ? P
    : never
  : {
      [K in keyof T & string]: PathsOf<T[K], `${Prefix}${K}.`>;
    }[keyof T & string];

export type TranslationKey = PathsOf<DeepDict>;

function resolve(path: string): Entry | undefined {
  const parts = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = dict;
  for (const part of parts) {
    if (node == null) return undefined;
    node = node[part];
  }
  return node as Entry | undefined;
}

export function t(key: TranslationKey | string, locale: Locale = DEFAULT_LOCALE): string {
  const entry = resolve(key);
  if (!entry) return key;
  return entry[locale] ?? entry[DEFAULT_LOCALE];
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
