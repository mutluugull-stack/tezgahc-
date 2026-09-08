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

  categories: {
    torna: e("CNC Torna", "CNC Lathe", "CNC-Drehmaschine"),
    freze: e("CNC Freze / İşleme Merkezi", "CNC Mill / Machining Center", "CNC-Fräsmaschine / Bearbeitungszentrum"),
    router: e("CNC Router", "CNC Router", "CNC-Router"),
    lazer: e("Lazer Kesim", "Laser Cutting", "Laserschneiden"),
    plazma: e("Plazma Kesim", "Plasma Cutting", "Plasmaschneiden"),
    edm: e("Erozyon (EDM)", "EDM", "Erodiermaschine (EDM)"),
    abkant: e("Abkant Pres", "Press Brake", "Abkantpresse"),
    yag: e("Yağ ve Yağlama Ürünleri", "Oils & Lubricants", "Öle und Schmierstoffe"),
    aparat: e("Aparat ve Bağlama Ekipmanları", "Fixtures & Clamping Equipment", "Vorrichtungen und Spannmittel"),
    divizor: e("Divizör / Döner Tabla", "Rotary Table / Indexer", "Drehtisch / Teilapparat"),
    "yedek-parca": e("Diğer Yedek Parçalar", "Other Spare Parts", "Sonstige Ersatzteile"),
    diger: e("Diğer", "Other", "Sonstiges"),
  },

  conditions: {
    SIFIR: e("Sıfır", "New", "Neu"),
    IKINCI_EL: e("İkinci El", "Used", "Gebraucht"),
    YENILENMIS: e("Yenilenmiş", "Refurbished", "Generalüberholt"),
  },

  listings: {
    pageTitle: e("CNC Makine İlanları", "CNC Machine Listings", "CNC-Maschinenanzeigen"),
    keyword: e("Anahtar Kelime", "Keyword", "Stichwort"),
    keywordPlaceholder: e("Marka, model...", "Brand, model...", "Marke, Modell..."),
    brand: e("Marka", "Brand", "Marke"),
    brandPlaceholder: e(
      "örn. Haas, DMG Mori, Mazak...",
      "e.g. Haas, DMG Mori, Mazak...",
      "z. B. Haas, DMG Mori, Mazak..."
    ),
    model: e("Model", "Model", "Modell"),
    modelPlaceholder: e("örn. VF-2, NLX 2500...", "e.g. VF-2, NLX 2500...", "z. B. VF-2, NLX 2500..."),
    modelPlaceholderGeneric: e("Model adı yazın", "Type a model name", "Modellname eingeben"),
    all: e("Tümü", "All", "Alle"),
    city: e("Şehir", "City", "Stadt"),
    condition: e("Durum", "Condition", "Zustand"),
    controller: e("Kontrolör", "Controller", "Steuerung"),
    axisCount: e("Eksen Sayısı", "Number of Axes", "Achsenzahl"),
    axisCountPlaceholder: e("3 Eksen", "e.g. 3", "z. B. 3"),
    priceRange: e("Fiyat Aralığı (₺)", "Price Range (₺)", "Preisspanne (₺)"),
    min: e("Min", "Min", "Min"),
    max: e("Max", "Max", "Max"),
    onlyDealer: e("Sadece Bayi İlanları", "Dealer Listings Only", "Nur Händleranzeigen"),
    filter: e("Filtrele", "Filter", "Filtern"),
    clear: e("Temizle", "Clear", "Zurücksetzen"),
    resultsFound: e("ilan bulundu", "listings found", "Anzeigen gefunden"),
    listView: e("Liste görünümü", "List view", "Listenansicht"),
    gridView: e("Izgara görünümü", "Grid view", "Rasteransicht"),
    sortNewest: e("En Yeni", "Newest", "Neueste"),
    sortPriceAsc: e("Fiyat: Düşükten Yükseğe", "Price: Low to High", "Preis: Aufsteigend"),
    sortPriceDesc: e("Fiyat: Yüksekten Düşüğe", "Price: High to Low", "Preis: Absteigend"),
    emptyTitle: e(
      "Aradığınız kriterlere uygun ilan bulunamadı",
      "No listings match your criteria",
      "Keine Anzeigen entsprechen Ihren Kriterien"
    ),
    emptyDesc: e(
      "Filtreleri genişletmeyi veya farklı bir kategori denemeyi deneyin.",
      "Try widening your filters or a different category.",
      "Versuchen Sie, die Filter zu erweitern oder eine andere Kategorie."
    ),
    featuredBadge: e("Vitrin", "Featured", "Empfohlen"),
    dealerBadge: e("Bayi", "Dealer", "Händler"),
    soldBadge: e("Satıldı", "Sold", "Verkauft"),
  },

  listingDetail: {
    backToListings: e("← Tüm ilanlara dön", "← Back to all listings", "← Zurück zu allen Anzeigen"),
    description: e("Açıklama", "Description", "Beschreibung"),
    specs: e("Teknik Özellikler", "Specifications", "Technische Daten"),
    year: e("Üretim Yılı", "Year", "Baujahr"),
    workArea: e("Çalışma Alanı", "Work Area", "Arbeitsbereich"),
    condition: e("Durum", "Condition", "Zustand"),
    views: e("görüntülenme", "views", "Aufrufe"),
    verifiedDealer: e("Yetkili Bayi", "Verified Dealer", "Autorisierter Händler"),
    individualSeller: e("Bireysel Satıcı", "Individual Seller", "Privatverkäufer"),
  },

  listingActions: {
    markUnsold: e("Satıldı İşaretini Kaldır", "Remove Sold Mark", "Verkauft-Markierung entfernen"),
    markSold: e("Satıldı Olarak İşaretle", "Mark as Sold", "Als verkauft markieren"),
    removeFromShowcase: e("Vitrinden Kaldır", "Remove from Showcase", "Aus Vitrine entfernen"),
    addToShowcase: e("Vitrine Ekle", "Add to Showcase", "Zur Vitrine hinzufügen"),
    incomingMessages: e("Bu İlana Gelen Mesajlar", "Messages on This Listing", "Nachrichten zu dieser Anzeige"),
    loading: e("Yükleniyor...", "Loading...", "Wird geladen..."),
    noMessagesYet: e("Henüz mesaj yok.", "No messages yet.", "Noch keine Nachrichten."),
    replyPlaceholder: e("Yanıt yazın...", "Write a reply...", "Antwort schreiben..."),
    send: e("Gönder", "Send", "Senden"),
    loginToMessagePrompt: e(
      "Satıcıya mesaj göndermek için giriş yapın.",
      "Log in to message the seller.",
      "Melden Sie sich an, um dem Verkäufer eine Nachricht zu senden."
    ),
    login: e("Giriş Yap", "Log In", "Anmelden"),
    messageSellerTitle: e("Satıcıya Mesaj Gönder", "Send a Message to the Seller", "Nachricht an den Verkäufer senden"),
    messagePlaceholder: e(
      "Tezgah hakkında merak ettiklerinizi yazın...",
      "Write your questions about the machine...",
      "Schreiben Sie Ihre Fragen zur Maschine..."
    ),
    messageSent: e("Mesajınız gönderildi.", "Your message has been sent.", "Ihre Nachricht wurde gesendet."),
    listingSold: e("İlan Satıldı", "Listing Sold", "Anzeige verkauft"),
    sending: e("Gönderiliyor...", "Sending...", "Wird gesendet..."),
    sendMessage: e("Mesaj Gönder", "Send Message", "Nachricht senden"),
    sendFailed: e("Mesaj gönderilemedi.", "Message could not be sent.", "Nachricht konnte nicht gesendet werden."),
    connectionError: e("Bağlantı hatası. Tekrar deneyin.", "Connection error. Please try again.", "Verbindungsfehler. Bitte erneut versuchen."),
  },

  report: {
    reportListing: e("İlanı Bildir", "Report Listing", "Anzeige melden"),
    reasonFake: e("Sahte veya yanıltıcı ilan", "Fake or misleading listing", "Gefälschte oder irreführende Anzeige"),
    reasonWrongCategory: e("Yanlış kategoride", "Wrong category", "Falsche Kategorie"),
    reasonInappropriate: e("Uygunsuz içerik / fotoğraf", "Inappropriate content / photo", "Unangemessener Inhalt / Foto"),
    reasonSoldNotRemoved: e("Satıldı ama kaldırılmamış", "Sold but not removed", "Verkauft, aber nicht entfernt"),
    reasonOther: e("Diğer", "Other", "Sonstiges"),
    thanks: e("Teşekkürler", "Thank you", "Vielen Dank"),
    submitted: e(
      "Bildiriminiz yönetici ekibine iletildi.",
      "Your report has been sent to our admin team.",
      "Ihre Meldung wurde an unser Admin-Team weitergeleitet."
    ),
    close: e("Kapat", "Close", "Schließen"),
    reason: e("Sebep", "Reason", "Grund"),
    descriptionOptional: e("Açıklama (opsiyonel)", "Description (optional)", "Beschreibung (optional)"),
    explainPlaceholder: e("Kısaca açıklayın...", "Briefly explain...", "Kurz erklären..."),
    cancel: e("Vazgeç", "Cancel", "Abbrechen"),
    sending: e("Gönderiliyor...", "Sending...", "Wird gesendet..."),
    submit: e("Bildir", "Report", "Melden"),
    submitFailed: e("Bildirim gönderilemedi.", "The report could not be sent.", "Die Meldung konnte nicht gesendet werden."),
    connectionError: e("Bağlantı hatası. Tekrar deneyin.", "Connection error. Please try again.", "Verbindungsfehler. Bitte erneut versuchen."),
  },

  favorite: {
    remove: e("Favorilerden çıkar", "Remove from favorites", "Aus Favoriten entfernen"),
    add: e("Favorilere ekle", "Add to favorites", "Zu Favoriten hinzufügen"),
  },

  preview: {
    title: e("Makine Önizleme", "Machine Preview", "Maschinenvorschau"),
    subtitle: e(
      "Marka/model seçin, satıcısının paylaşıma onay verdiği yayındaki ilanların fotoğraflarını görün.",
      "Pick a brand/model to see photos from live listings whose seller has approved sharing.",
      "Wählen Sie Marke/Modell, um Fotos aus aktiven Anzeigen zu sehen, deren Verkäufer die Freigabe erlaubt hat."
    ),
    close: e("Kapat", "Close", "Schließen"),
    selectBrandPrompt: e(
      "Önizlemek istediğiniz markayı yukarıdan seçin.",
      "Select the brand you'd like to preview above.",
      "Wählen Sie oben die Marke, die Sie sich ansehen möchten."
    ),
    loading: e("Yükleniyor...", "Loading...", "Wird geladen..."),
    noResultsSuffix: e(
      "için şu anda önizlemeye açık (satıcısı fotoğraf paylaşımına onay vermiş) yayında ilan bulunamadı.",
      "has no live listings open for preview right now (seller hasn't approved photo sharing).",
      "hat derzeit keine für die Vorschau freigegebenen aktiven Anzeigen (Verkäufer hat die Fotofreigabe nicht erlaubt)."
    ),
    searchListings: e("İlanlarda Ara", "Search Listings", "In Anzeigen suchen"),
    noPhotos: e("Bu ilana fotoğraf eklenmemiş.", "No photos added to this listing.", "Diesem Inserat wurden keine Fotos hinzugefügt."),
    viewListing: e("İlanı Görüntüle →", "View Listing →", "Anzeige ansehen →"),
    prevPhoto: e("Önceki fotoğraf", "Previous photo", "Vorheriges Foto"),
    nextPhoto: e("Sonraki fotoğraf", "Next photo", "Nächstes Foto"),
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
