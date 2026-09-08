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
  currencies: {
    TRY: e("TL", "TRY", "TRY"),
    USD: e("Dolar", "Dollar", "Dollar"),
    EUR: e("Euro", "Euro", "Euro"),
  },
  auth: {
    loginTitle: e("Giriş Yap", "Log In", "Anmelden"),
    loginSubtitle: e(
      "Hesabınıza giriş yaparak devam edin.",
      "Log in to your account to continue.",
      "Melden Sie sich an, um fortzufahren."
    ),
    loginSubtitleAdmin: e(
      "Bu sayfaya erişmek için yönetici hesabıyla giriş yapın.",
      "Log in with an administrator account to access this page.",
      "Melden Sie sich mit einem Administratorkonto an, um auf diese Seite zuzugreifen."
    ),
    userLoginTab: e("Kullanıcı Girişi", "User Login", "Benutzeranmeldung"),
    dealerLoginTab: e("Bayi Girişi", "Dealer Login", "Händleranmeldung"),
    username: e("Kullanıcı Adı", "Username", "Benutzername"),
    usernameHint: e(
      "3-24 karakter, küçük harf ve rakam",
      "3-24 characters, lowercase letters and digits",
      "3-24 Zeichen, Kleinbuchstaben und Ziffern"
    ),
    password: e("Şifre", "Password", "Passwort"),
    forgotPasswordNote: e(
      "Şifrenizi mi unuttunuz? Şu an için otomatik sıfırlama yok — yönetici ile iletişime geçin, sizin için yeni bir şifre oluştursun.",
      "Forgot your password? There's no automatic reset yet — contact an administrator to have a new one set for you.",
      "Passwort vergessen? Es gibt noch kein automatisches Zurücksetzen — wenden Sie sich an einen Administrator, um ein neues Passwort zu erhalten."
    ),
    loggingIn: e("Giriş yapılıyor...", "Logging in...", "Anmeldung läuft..."),
    noAccount: e("Hesabınız yok mu?", "Don't have an account?", "Noch kein Konto?"),
    signUpLink: e("Üye olun", "Sign up", "Registrieren"),
    registerTitle: e("Üye Ol", "Sign Up", "Registrieren"),
    registerSubtitle: e(
      "Ücretsiz üye olun, hemen ilan verin veya satıcılarla iletişime geçin.",
      "Sign up for free, post a listing right away or get in touch with sellers.",
      "Registrieren Sie sich kostenlos, schalten Sie sofort eine Anzeige auf oder kontaktieren Sie Verkäufer."
    ),
    individualTab: e("Bireysel Üyelik", "Individual Membership", "Einzelmitgliedschaft"),
    dealerTab: e("Bayi Üyeliği", "Dealer Membership", "Händlermitgliedschaft"),
    dealerApprovalNote: e(
      "Bayi hesapları, sahte ilanları önlemek için yönetici onayından sonra aktif olur.",
      "Dealer accounts become active after administrator approval, to prevent fake listings.",
      "Händlerkonten werden nach Genehmigung durch den Administrator aktiv, um gefälschte Anzeigen zu verhindern."
    ),
    fullName: e("Ad Soyad", "Full Name", "Vollständiger Name"),
    companyName: e("Firma Adı", "Company Name", "Firmenname"),
    phone: e("Telefon", "Phone", "Telefon"),
    address: e("Açık Adres", "Full Address", "Vollständige Adresse"),
    addressPlaceholder: e(
      "Mahalle, cadde, no, ilçe...",
      "Neighborhood, street, no., district...",
      "Stadtteil, Straße, Nr., Bezirk..."
    ),
    officialDocuments: e("Resmi Evraklar", "Official Documents", "Offizielle Dokumente"),
    activityCertificate: e(
      "Güncel Faaliyet Belgesi",
      "Current Certificate of Activity",
      "Aktuelle Tätigkeitsbescheinigung"
    ),
    signatureCircular: e("İmza Sirküleri", "Signature Circular", "Unterschriftenzirkular"),
    uploading: e("Yükleniyor...", "Uploading...", "Wird hochgeladen..."),
    uploaded: e("Yüklendi", "Uploaded", "Hochgeladen"),
    docsNote: e(
      "PDF, JPEG, PNG veya WEBP, en fazla 10MB. Belgeleriniz yönetici onayı sırasında incelenir.",
      "PDF, JPEG, PNG or WEBP, up to 10MB. Your documents are reviewed during administrator approval.",
      "PDF, JPEG, PNG oder WEBP, bis zu 10 MB. Ihre Dokumente werden bei der Genehmigung durch den Administrator geprüft."
    ),
    email: e("E-posta", "Email", "E-Mail"),
    city: e("Şehir", "City", "Stadt"),
    registering: e("Kaydediliyor...", "Signing up...", "Registrierung läuft..."),
    registerButton: e("Üye Ol", "Sign Up", "Registrieren"),
    alreadyMember: e("Zaten üye misiniz?", "Already a member?", "Bereits Mitglied?"),
    loginLink: e("Giriş yapın", "Log in", "Anmelden"),
    docUploadFailed: e("Belge yüklenemedi.", "Document could not be uploaded.", "Dokument konnte nicht hochgeladen werden."),
    connectionError: e("Bağlantı hatası. Tekrar deneyin.", "Connection error. Please try again.", "Verbindungsfehler. Bitte versuchen Sie es erneut."),
    registrationFailed: e("Kayıt oluşturulamadı.", "Registration could not be created.", "Registrierung konnte nicht erstellt werden."),
    docsRequiredError: e(
      "Devam etmeden önce güncel faaliyet belgesi ve imza sirkülerini yükleyin.",
      "Upload the current certificate of activity and signature circular before continuing.",
      "Laden Sie vor dem Fortfahren die aktuelle Tätigkeitsbescheinigung und das Unterschriftenzirkular hoch."
    ),
  },
  postListing: {
    title: e("Yeni İlan Ver", "Post New Listing", "Neue Anzeige aufgeben"),
    subtitle: e(
      "Tezgahınızın bilgilerini eksiksiz girin, hızla alıcı bulun.",
      "Enter your machine's details completely to find a buyer quickly.",
      "Geben Sie die Daten Ihrer Maschine vollständig ein, um schnell einen Käufer zu finden."
    ),
    loginRequiredTitle: e("İlan vermek için giriş yapın", "Log in to post a listing", "Melden Sie sich an, um eine Anzeige aufzugeben"),
    loginRequiredDesc: e(
      "Ücretsiz üye olun ve tezgahınızı hemen ilana çıkarın.",
      "Sign up for free and list your machine right away.",
      "Registrieren Sie sich kostenlos und listen Sie Ihre Maschine sofort."
    ),
    dealerPendingTitle: e("Bayi hesabınız onay bekliyor", "Your dealer account is pending approval", "Ihr Händlerkonto wartet auf Genehmigung"),
    dealerPendingDesc: e(
      "Hesabınız yönetici onayından geçtikten sonra ilan verebilirsiniz. Onay genellikle kısa sürede tamamlanır.",
      "You can post listings once your account passes administrator approval. Approval is usually completed quickly.",
      "Sie können Anzeigen aufgeben, sobald Ihr Konto vom Administrator genehmigt wurde. Die Genehmigung erfolgt in der Regel schnell."
    ),
    listingTitle: e("İlan Başlığı *", "Listing Title *", "Anzeigentitel *"),
    listingTitlePlaceholder: e(
      "örn. Haas VF-2 Dikey İşleme Merkezi",
      "e.g. Haas VF-2 Vertical Machining Center",
      "z. B. Haas VF-2 Vertikales Bearbeitungszentrum"
    ),
    category: e("Kategori *", "Category *", "Kategorie *"),
    condition: e("Durum *", "Condition *", "Zustand *"),
    controller: e("Kontrolör", "Controller", "Steuerung"),
    axisCount: e("Eksen Sayısı", "Number of Axes", "Achsenzahl"),
    axisCountPlaceholder: e("3 Eksen", "e.g. 3", "z. B. 3"),
    year: e("Üretim Yılı", "Manufacture Year", "Baujahr"),
    yearPlaceholder: e("2018", "2018", "2018"),
    workArea: e("Çalışma Alanı", "Work Area", "Arbeitsbereich"),
    workAreaPlaceholder: e("762 x 406 x 508 mm", "762 x 406 x 508 mm", "762 x 406 x 508 mm"),
    price: e("Fiyat *", "Price *", "Preis *"),
    currency: e("Para Birimi", "Currency", "Währung"),
    city: e("Şehir *", "City *", "Stadt *"),
    description: e("Açıklama *", "Description *", "Beschreibung *"),
    descriptionPlaceholder: e(
      "Tezgahın bakım durumu, kullanım geçmişi, dahil aksesuarlar...",
      "The machine's maintenance condition, usage history, included accessories...",
      "Wartungszustand der Maschine, Nutzungsverlauf, enthaltenes Zubehör..."
    ),
    photos: e("Fotoğraflar (opsiyonel, en fazla 8)", "Photos (optional, up to 8)", "Fotos (optional, bis zu 8)"),
    uploading: e("Yükleniyor...", "Uploading...", "Wird hochgeladen..."),
    photoAlt: e("Fotoğraf", "Photo", "Foto"),
    previewConsentPrefix: e('Fotoğraflarımın "', 'I consent to my photos being shown to customers in the "', 'Ich stimme zu, dass meine Fotos Kunden im Panel "'),
    previewConsentBold: e("Makine Önizleme", "Machine Preview", "Maschinenvorschau"),
    previewConsentSuffix: e(
      '" panelinde marka/model bazlı olarak müşterilere gösterilmesine izin veriyorum ve bu fotoğrafların telif hakkına sahip olduğumu veya kullanım iznim olduğunu onaylıyorum.',
      '" panel by brand/model, and I confirm that I own the copyright to these photos or have permission to use them.',
      '" nach Marke/Modell angezeigt werden, und ich bestätige, dass ich die Urheberrechte an diesen Fotos besitze oder zur Nutzung berechtigt bin.'
    ),
    publishing: e("Yayınlanıyor...", "Publishing...", "Wird veröffentlicht..."),
    publishButton: e("İlanı Yayınla", "Publish Listing", "Anzeige veröffentlichen"),
    uploadFailed: e("Fotoğraf yüklenemedi.", "Photo could not be uploaded.", "Foto konnte nicht hochgeladen werden."),
    publishFailed: e("İlan yayınlanamadı.", "Listing could not be published.", "Anzeige konnte nicht veröffentlicht werden."),
    connectionError: e("Bağlantı hatası. Tekrar deneyin.", "Connection error. Please try again.", "Verbindungsfehler. Bitte versuchen Sie es erneut."),
    loading: e("Yükleniyor...", "Loading...", "Wird geladen..."),
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
