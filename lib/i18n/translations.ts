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
  settings: {
    loginRequiredTitle: e("Ayarlara erişmek için giriş yapın", "Log in to access settings", "Melden Sie sich an, um auf die Einstellungen zuzugreifen"),
    title: e("Ayarlar", "Settings", "Einstellungen"),
    subtitle: e("Hesap bilgilerinizi güncelleyin.", "Update your account information.", "Aktualisieren Sie Ihre Kontoinformationen."),
    subtitleAdmin: e("Yönetici hesap bilgilerinizi güncelleyin.", "Update your administrator account information.", "Aktualisieren Sie Ihre Administratorkontoinformationen."),
    backHome: e("Ana Sayfa", "Home", "Startseite"),
    backAdmin: e("Yönetici Paneli", "Admin Panel", "Admin-Bereich"),
    backDealerPanel: e("Bayi Panelim", "My Dealer Panel", "Mein Händlerbereich"),
    logoSectionTitle: e("Firma Logosu", "Company Logo", "Firmenlogo"),
    logoSectionDesc: e(
      "Logonuz ilan detay sayfanızda ve bayi panelinizde görünür. JPEG, PNG veya WEBP, en fazla 8MB.",
      "Your logo appears on your listing detail pages and in your dealer panel. JPEG, PNG or WEBP, up to 8MB.",
      "Ihr Logo erscheint auf Ihren Anzeigendetailseiten und in Ihrem Händlerbereich. JPEG, PNG oder WEBP, bis zu 8MB."
    ),
    logoAlt: e("Firma logosu", "Company logo", "Firmenlogo"),
    noLogo: e("Logo yok", "No logo", "Kein Logo"),
    uploadLogo: e("Logo Yükle", "Upload Logo", "Logo hochladen"),
    removeLogo: e("Logoyu Kaldır", "Remove Logo", "Logo entfernen"),
    logoUploadFailed: e("Logo yüklenemedi.", "Logo could not be uploaded.", "Logo konnte nicht hochgeladen werden."),
    logoSaveFailed: e("Logo kaydedilemedi.", "Logo could not be saved.", "Logo konnte nicht gespeichert werden."),
    bioSectionTitle: e("Bayi Profil Sayfası", "Dealer Profile Page", "Händlerprofilseite"),
    viewProfileLink: e("Profilinizi Görüntüle →", "View Your Profile →", "Ihr Profil ansehen →"),
    bioSectionDescPrefix: e(
      "Bu tanıtım metni, herkese açık bayi profil sayfanızda (tezgahci.com.tr/bayi/",
      "This description appears on your public dealer profile page (tezgahci.com.tr/bayi/",
      "Dieser Beschreibungstext erscheint auf Ihrer öffentlichen Händlerprofilseite (tezgahci.com.tr/bayi/"
    ),
    bioSectionDescSuffix: e(") görünür.", ").", ")."),
    bioPlaceholder: e(
      "Firmanızı, uzmanlık alanlarınızı ve sunduğunuz hizmetleri kısaca tanıtın...",
      "Briefly introduce your company, areas of expertise, and the services you offer...",
      "Stellen Sie kurz Ihr Unternehmen, Ihre Fachgebiete und Ihre Dienstleistungen vor..."
    ),
    bioSaveButton: e("Tanıtım Yazısını Kaydet", "Save Description", "Beschreibung speichern"),
    saving: e("Kaydediliyor...", "Saving...", "Wird gespeichert..."),
    bioUpdated: e("Tanıtım yazınız güncellendi.", "Your description has been updated.", "Ihre Beschreibung wurde aktualisiert."),
    updateFailed: e("Güncellenemedi, tekrar deneyin.", "Could not be updated, please try again.", "Aktualisierung fehlgeschlagen, bitte erneut versuchen."),
    profileInfoTitle: e("Profil Bilgileri", "Profile Information", "Profilinformationen"),
    username: e("Kullanıcı Adı", "Username", "Benutzername"),
    email: e("E-posta", "Email", "E-Mail"),
    fullName: e("Ad Soyad", "Full Name", "Vollständiger Name"),
    companyName: e("Firma Adı", "Company Name", "Firmenname"),
    phone: e("Telefon", "Phone", "Telefon"),
    city: e("Şehir", "City", "Stadt"),
    citySelectOption: e("Seçin", "Select", "Auswählen"),
    address: e("Açık Adres", "Address", "Adresse"),
    addressPlaceholder: e("Mahalle, cadde, no, ilçe...", "Neighborhood, street, number, district...", "Stadtteil, Straße, Hausnummer, Bezirk..."),
    profileUpdated: e("Bilgileriniz güncellendi.", "Your information has been updated.", "Ihre Informationen wurden aktualisiert."),
    saveInfoButton: e("Bilgileri Kaydet", "Save Information", "Informationen speichern"),
    changePasswordTitle: e("Şifre Değiştir", "Change Password", "Passwort ändern"),
    currentPassword: e("Mevcut Şifre", "Current Password", "Aktuelles Passwort"),
    newPassword: e("Yeni Şifre", "New Password", "Neues Passwort"),
    newPasswordConfirm: e("Yeni Şifre (Tekrar)", "New Password (Confirm)", "Neues Passwort (Bestätigen)"),
    passwordMismatch: e("Yeni şifreler eşleşmiyor.", "New passwords do not match.", "Die neuen Passwörter stimmen nicht überein."),
    passwordChangeFailed: e("Şifre değiştirilemedi.", "Password could not be changed.", "Passwort konnte nicht geändert werden."),
    passwordChanged: e("Şifreniz değiştirildi.", "Your password has been changed.", "Ihr Passwort wurde geändert."),
    changingPassword: e("Değiştiriliyor...", "Changing...", "Wird geändert..."),
    changePasswordButton: e("Şifreyi Değiştir", "Change Password", "Passwort ändern"),
  },
  messages: {
    loginRequiredTitle: e("Mesajlarınızı görmek için giriş yapın", "Log in to view your messages", "Melden Sie sich an, um Ihre Nachrichten zu sehen"),
    title: e("Mesajlarım", "My Messages", "Meine Nachrichten"),
    emptyTitle: e("Henüz mesajınız yok", "You have no messages yet", "Sie haben noch keine Nachrichten"),
    emptyDesc: e(
      "Bir ilana mesaj gönderdiğinizde ya da size mesaj geldiğinde burada görünecek.",
      "Messages you send about a listing, or receive, will appear here.",
      "Nachrichten, die Sie zu einer Anzeige senden oder erhalten, werden hier angezeigt."
    ),
    replyPlaceholder: e("Yanıt yazın...", "Write a reply...", "Antwort schreiben..."),
  },
  dealerProfile: {
    notFoundTitle: e("Bayi Bulunamadı | Tezgahçı", "Dealer Not Found | Tezgahçı", "Händler nicht gefunden | Tezgahçı"),
    metaTitleTemplate: e("{name} | Tezgahçı Bayi Profili", "{name} | Tezgahçı Dealer Profile", "{name} | Tezgahçı Händlerprofil"),
    metaDescriptionTemplate: e(
      "{name} firmasının CNC tezgah ve makine ilanlarını Tezgahçı'da inceleyin.",
      "Browse {name}'s CNC machine tool listings on Tezgahçı.",
      "Entdecken Sie die CNC-Maschinenanzeigen von {name} auf Tezgahçı."
    ),
    verifiedBadge: e("Onaylı Bayi", "Verified Dealer", "Verifizierter Händler"),
    noLocation: e("Konum belirtilmemiş", "Location not specified", "Standort nicht angegeben"),
    memberSince: e("{date} tarihinden beri Tezgahçı'da", "On Tezgahçı since {date}", "Seit {date} bei Tezgahçı"),
    statActiveListings: e("Aktif İlan", "Active Listing", "Aktive Anzeige"),
    statSoldListings: e("Satılan İlan", "Sold Listing", "Verkaufte Anzeige"),
    statViews: e("Görüntülenme", "Views", "Aufrufe"),
    teamTitle: e("Temsilciler", "Representatives", "Vertreter"),
    teamMemberRole: e("Ekip Üyesi", "Team Member", "Teammitglied"),
    listingCount: e("{n} ilan", "{n} listings", "{n} Anzeigen"),
    tabActive: e("Aktif İlanlar ({n})", "Active Listings ({n})", "Aktive Anzeigen ({n})"),
    tabSold: e("Satılanlar ({n})", "Sold ({n})", "Verkauft ({n})"),
    soldBadge: e("Satıldı", "Sold", "Verkauft"),
    emptyActive: e("Şu anda yayında ilan bulunmuyor.", "No listings are currently live.", "Derzeit sind keine Anzeigen aktiv."),
    emptySold: e("Henüz satılan ilan bulunmuyor.", "No listings sold yet.", "Bisher wurden keine Anzeigen verkauft."),
  },
  legal: {
    privacy: {
      pageTitle: e(
        "Gizlilik Politikası ve KVKK Aydınlatma Metni",
        "Privacy Policy and KVKK Disclosure Text",
        "Datenschutzerklärung und KVKK-Informationstext"
      ),
      metaDescription: e(
        "Tezgahçı'nın kişisel verilerinizi nasıl işlediğine dair KVKK aydınlatma metni ve gizlilik politikası.",
        "The KVKK disclosure text and privacy policy on how Tezgahçı processes your personal data.",
        "Der KVKK-Informationstext und die Datenschutzerklärung darüber, wie Tezgahçı Ihre personenbezogenen Daten verarbeitet."
      ),
      lastUpdated: e("Son güncelleme: 4 Eylül 2026", "Last updated: September 4, 2026", "Zuletzt aktualisiert: 4. September 2026"),
      section1Title: e("1. Veri Sorumlusu", "1. Data Controller", "1. Verantwortlicher für die Datenverarbeitung"),
      section1Body: e(
        '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Tezgahçı platformunu ("Tezgahçı", "Platform", www.tezgahci.com.tr) işleten <strong class="text-ink">MELİS DİJİTAL</strong> veri sorumlusu sıfatıyla hareket etmektedir. Bu metin, Platform üzerinden topladığımız kişisel verilerin hangi amaçlarla işlendiğini, kimlerle paylaşılabileceğini ve haklarınızı ne şekilde kullanabileceğinizi açıklamak amacıyla hazırlanmıştır.',
        'Under Law No. 6698 on the Protection of Personal Data ("KVKK"), <strong class="text-ink">MELİS DİJİTAL</strong>, which operates the Tezgahçı platform ("Tezgahçı", "Platform", www.tezgahci.com.tr), acts as the data controller. This text has been prepared to explain the purposes for which we process personal data collected through the Platform, with whom it may be shared, and how you can exercise your rights.',
        'Gemäß dem türkischen Gesetz Nr. 6698 zum Schutz personenbezogener Daten ("KVKK") handelt <strong class="text-ink">MELİS DİJİTAL</strong>, der Betreiber der Plattform Tezgahçı ("Tezgahçı", "Plattform", www.tezgahci.com.tr), als Verantwortlicher für die Datenverarbeitung. Dieser Text erläutert, zu welchen Zwecken wir die über die Plattform erhobenen personenbezogenen Daten verarbeiten, mit wem sie geteilt werden können und wie Sie Ihre Rechte ausüben können.'
      ),
      section2Title: e("2. İşlenen Kişisel Veriler", "2. Personal Data Processed", "2. Verarbeitete personenbezogene Daten"),
      section2Intro: e(
        "Üyelik ve ilan işlemleri sırasında aşağıdaki veriler işlenebilir:",
        "The following data may be processed during membership and listing transactions:",
        "Bei Mitgliedschafts- und Anzeigenvorgängen können folgende Daten verarbeitet werden:"
      ),
      section2Body: e(
        "Kimlik ve iletişim bilgileri (ad soyad veya firma unvanı, kullanıcı adı, e-posta, telefon, adres, şehir); bayi hesapları için güncel faaliyet belgesi ve imza sirküleri gibi resmi belgeler; ilan içerikleri ve fotoğraflar; alıcı-satıcı arasındaki mesajlaşma içerikleri; hesap güvenliği için şifrenin şifrelenmiş (hash'lenmiş) hâli; site kullanımına dair teknik veriler (yaklaşık konum, cihaz ve tarayıcı bilgisi, görüntülenme istatistikleri — ayrıntılar için bkz. Madde 3).",
        "Identity and contact information (full name or company title, username, email, phone, address, city); for dealer accounts, official documents such as an up-to-date certificate of activity and signature circular; listing content and photos; messages exchanged between buyers and sellers; the encrypted (hashed) form of your password for account security; technical data related to site usage (approximate location, device and browser information, view statistics — see Section 3 for details).",
        "Identitäts- und Kontaktdaten (Name oder Firmenbezeichnung, Benutzername, E-Mail, Telefon, Adresse, Stadt); für Händlerkonten offizielle Dokumente wie eine aktuelle Tätigkeitsbescheinigung und ein Unterschriftszirkular; Anzeigeninhalte und Fotos; Nachrichten zwischen Käufern und Verkäufern; die verschlüsselte (gehashte) Form Ihres Passworts zur Kontosicherheit; technische Daten zur Nutzung der Website (ungefährer Standort, Geräte- und Browserinformationen, Aufrufstatistiken — Einzelheiten siehe Abschnitt 3)."
      ),
      section3Title: e(
        "3. Site Trafiği, Yaklaşık Konum ve Cihaz Bilgileri",
        "3. Site Traffic, Approximate Location, and Device Information",
        "3. Website-Verkehr, ungefährer Standort und Geräteinformationen"
      ),
      section3Intro: e(
        "Platform'u ziyaret ettiğinizde, trafik istatistiklerini ölçmek ve hizmet kalitesini artırmak amacıyla, üyelik gerektirmeden ve sizi bireysel olarak hedeflemeden, otomatik olarak aşağıdaki teknik veriler toplanır:",
        "When you visit the Platform, the following technical data is automatically collected to measure traffic statistics and improve service quality, without requiring membership and without targeting you individually:",
        "Beim Besuch der Plattform werden automatisch, ohne Mitgliedschaft und ohne individuelle Zielausrichtung, folgende technische Daten erhoben, um Verkehrsstatistiken zu messen und die Servicequalität zu verbessern:"
      ),
      section3Location: e(
        '<strong class="text-ink">Yaklaşık konum bilgisi:</strong> Ziyaretinizin geldiği ülke, il/bölge ve şehir bilgisi, barındırma altyapımızın (Vercel) sunucu düzeyinde sağladığı IP tabanlı konum tahmininden elde edilir. Ham IP adresiniz veritabanımızda saklanmaz; yalnızca bu bilgiden türetilen yaklaşık il/bölge kaydedilir. Bu bilgi kesin olmayabilir; özellikle VPN veya mobil operatör ağları kullanan ziyaretçilerde farklı bir il/bölge görünebilir.',
        '<strong class="text-ink">Approximate location information:</strong> The country, region, and city your visit originates from is derived from the IP-based location estimate provided at the server level by our hosting infrastructure (Vercel). Your raw IP address is not stored in our database; only the approximate region/city derived from it is recorded. This information may not be exact; visitors using VPNs or mobile carrier networks in particular may show a different region.',
        '<strong class="text-ink">Ungefähre Standortinformationen:</strong> Das Land, die Region und die Stadt, aus der Ihr Besuch stammt, werden aus der IP-basierten Standortschätzung abgeleitet, die unsere Hosting-Infrastruktur (Vercel) auf Serverebene bereitstellt. Ihre rohe IP-Adresse wird nicht in unserer Datenbank gespeichert; es wird nur die daraus abgeleitete ungefähre Region/Stadt erfasst. Diese Angabe kann ungenau sein; insbesondere bei Besuchern, die VPNs oder mobile Netzwerke nutzen, kann eine andere Region angezeigt werden.'
      ),
      section3Device: e(
        '<strong class="text-ink">Cihaz bilgisi:</strong> Tarayıcınızın gönderdiği teknik bilgilerden (User-Agent) cihaz türü (mobil telefon/tablet/bilgisayar), işletim sistemi, tarayıcı ve mümkün olduğunda cihaz modeli (ör. "Samsung SM-G991B") tespit edilir. Apple\'ın güvenlik politikası gereği iPhone cihazlarda model bilgisi paylaşılmaz; bu cihazlar yalnızca "iPhone" olarak görünür.',
        '<strong class="text-ink">Device information:</strong> From the technical information sent by your browser (User-Agent), the device type (mobile phone/tablet/computer), operating system, browser, and, where possible, device model (e.g. "Samsung SM-G991B") are detected. Due to Apple\'s security policy, model information is not shared for iPhone devices; these devices appear only as "iPhone".',
        '<strong class="text-ink">Geräteinformationen:</strong> Aus den von Ihrem Browser übermittelten technischen Informationen (User-Agent) werden der Gerätetyp (Mobiltelefon/Tablet/Computer), das Betriebssystem, der Browser und, sofern möglich, das Gerätemodell (z. B. "Samsung SM-G991B") ermittelt. Aufgrund der Sicherheitsrichtlinie von Apple wird bei iPhone-Geräten keine Modellinformation weitergegeben; diese Geräte werden nur als "iPhone" angezeigt.'
      ),
      section3Note: e(
        "Bu veriler kullanıcı hesabınızla veya kimliğinizle eşleştirilmez; yalnızca toplu istatistik olarak (hangi bölgelerden ve hangi cihazlardan erişildiğini anlamak, Platform'u bu doğrultuda iyileştirmek ve kötüye kullanımı önlemek amacıyla) yönetici panelimizde görüntülenir.",
        "This data is not matched to your user account or identity; it is displayed in our admin panel only as aggregate statistics (to understand which regions and devices are used to access the Platform, to improve the Platform accordingly, and to prevent misuse).",
        "Diese Daten werden nicht mit Ihrem Benutzerkonto oder Ihrer Identität verknüpft; sie werden in unserem Admin-Panel ausschließlich als aggregierte Statistiken angezeigt (um zu verstehen, aus welchen Regionen und mit welchen Geräten auf die Plattform zugegriffen wird, um die Plattform entsprechend zu verbessern und Missbrauch vorzubeugen)."
      ),
      section4Title: e("4. İşleme Amaçları", "4. Purposes of Processing", "4. Verarbeitungszwecke"),
      section4Body: e(
        "Kişisel verileriniz; üyelik oluşturma ve kimlik doğrulama, ilan yayınlama ve yönetme, alıcı-satıcı arasında iletişim kurulmasını sağlama, bayi başvurularının incelenip onaylanması, dolandırıcılık ve kötüye kullanımın önlenmesi, site trafiğinin ve ziyaretçi istatistiklerinin (yaklaşık konum ve cihaz dağılımı dâhil) analiz edilmesi, yasal yükümlülüklerin yerine getirilmesi ve Platform'un güvenliğinin sağlanması amaçlarıyla işlenir.",
        "Your personal data is processed for the purposes of creating membership and identity verification, publishing and managing listings, enabling communication between buyers and sellers, reviewing and approving dealer applications, preventing fraud and misuse, analyzing site traffic and visitor statistics (including approximate location and device distribution), fulfilling legal obligations, and ensuring the security of the Platform.",
        "Ihre personenbezogenen Daten werden zu folgenden Zwecken verarbeitet: Erstellung der Mitgliedschaft und Identitätsprüfung, Veröffentlichung und Verwaltung von Anzeigen, Ermöglichung der Kommunikation zwischen Käufern und Verkäufern, Prüfung und Genehmigung von Händleranträgen, Verhinderung von Betrug und Missbrauch, Analyse des Website-Verkehrs und der Besucherstatistiken (einschließlich ungefährem Standort und Geräteverteilung), Erfüllung gesetzlicher Verpflichtungen und Gewährleistung der Sicherheit der Plattform."
      ),
      section5Title: e("5. Aktarım", "5. Data Transfer", "5. Datenweitergabe"),
      section5Body: e(
        "Kişisel verileriniz, yalnızca hizmetin sunulması için gerekli olduğu ölçüde barındırma (hosting), bulut depolama ve altyapı hizmeti aldığımız tedarikçilerimizle (ör. Vercel) ve yasal zorunluluk hâlinde yetkili kamu kurum ve kuruluşlarıyla paylaşılabilir. Verileriniz pazarlama amacıyla üçüncü taraflara satılmaz veya kiralanmaz.",
        "Your personal data may be shared, only to the extent necessary for providing the service, with our hosting, cloud storage, and infrastructure providers (e.g. Vercel), and, where legally required, with authorized public institutions and organizations. Your data is not sold or rented to third parties for marketing purposes.",
        "Ihre personenbezogenen Daten können, nur soweit dies für die Erbringung der Dienstleistung erforderlich ist, mit unseren Hosting-, Cloud-Speicher- und Infrastrukturanbietern (z. B. Vercel) sowie, sofern gesetzlich vorgeschrieben, mit zuständigen Behörden geteilt werden. Ihre Daten werden nicht zu Marketingzwecken an Dritte verkauft oder vermietet."
      ),
      section6Title: e("6. Saklama Süresi", "6. Retention Period", "6. Aufbewahrungsdauer"),
      section6Body: e(
        "Kişisel veriler, ilgili işleme amacının gerektirdiği süre boyunca ve mevzuatta öngörülen yasal saklama süreleri boyunca muhafaza edilir; bu sürelerin sonunda silinir, yok edilir veya anonim hâle getirilir.",
        "Personal data is retained for as long as required by the relevant processing purpose and the legal retention periods stipulated by legislation; at the end of these periods, it is deleted, destroyed, or anonymized.",
        "Personenbezogene Daten werden so lange aufbewahrt, wie es der jeweilige Verarbeitungszweck und die gesetzlich vorgeschriebenen Aufbewahrungsfristen erfordern; nach Ablauf dieser Fristen werden sie gelöscht, vernichtet oder anonymisiert."
      ),
      section7Title: e("7. Çerezler", "7. Cookies", "7. Cookies"),
      section7Body: e(
        "Platform, oturumunuzu yönetmek ve tercihlerinizi hatırlamak amacıyla zorunlu çerezler kullanır. Sitede gezinmeye devam ederek çerez kullanımını kabul etmiş olursunuz; tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz.",
        "The Platform uses essential cookies to manage your session and remember your preferences. By continuing to browse the site, you accept the use of cookies; you can manage or delete cookies through your browser settings.",
        "Die Plattform verwendet notwendige Cookies, um Ihre Sitzung zu verwalten und Ihre Einstellungen zu speichern. Durch die weitere Nutzung der Website akzeptieren Sie die Verwendung von Cookies; Sie können Cookies über Ihre Browser-Einstellungen verwalten oder löschen."
      ),
      section8Title: e("8. KVKK Kapsamındaki Haklarınız", "8. Your Rights under the KVKK", "8. Ihre Rechte im Rahmen des KVKK"),
      section8Intro: e(
        "KVKK'nın 11. maddesi uyarınca her veri sahibi;",
        "Under Article 11 of the KVKK, every data subject has the right to:",
        "Gemäß Artikel 11 des KVKK hat jede betroffene Person das Recht,"
      ),
      section8Body: e(
        "kişisel verisinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme, bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme, işlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi nedeniyle aleyhine bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme haklarına sahiptir.",
        "learn whether their personal data is being processed, request information about it if processed, learn the purpose of processing and whether the data is used in accordance with that purpose, know the third parties to whom it is transferred domestically or abroad, request correction if it has been processed incompletely or incorrectly, request its deletion or destruction, request that these operations be notified to the third parties to whom the data has been transferred, object to a result that arises to their detriment through the exclusive analysis of processed data by automated systems, and request compensation for damages suffered due to unlawful processing.",
        "zu erfahren, ob ihre personenbezogenen Daten verarbeitet werden, bei Verarbeitung entsprechende Informationen zu verlangen, den Verarbeitungszweck zu erfahren und ob die Daten zweckgemäß verwendet werden, die Dritten zu kennen, an die sie im In- oder Ausland übermittelt werden, bei unvollständiger oder fehlerhafter Verarbeitung eine Berichtigung zu verlangen, deren Löschung oder Vernichtung zu verlangen, die Benachrichtigung dieser Vorgänge an Dritte zu verlangen, denen die Daten übermittelt wurden, einem Ergebnis zu widersprechen, das ausschließlich durch automatisierte Analyse der verarbeiteten Daten zu ihrem Nachteil entsteht, und bei rechtswidriger Verarbeitung Schadensersatz zu verlangen."
      ),
      section9Title: e("9. Başvuru ve İletişim", "9. Application and Contact", "9. Antragstellung und Kontakt"),
      section9BodyPrefix: e(
        "Yukarıdaki haklarınızı kullanmak için taleplerinizi, kayıtlı e-posta adresinizden",
        "To exercise your rights above, you can send your requests from your registered email address to",
        "Um Ihre oben genannten Rechte auszuüben, können Sie Ihre Anfragen von Ihrer registrierten E-Mail-Adresse an"
      ),
      contactEmailPlaceholder: e(
        "[iletişim e-postası buraya eklenecek]",
        "[contact email to be added here]",
        "[Kontakt-E-Mail wird hier ergänzt]"
      ),
      section9BodySuffix: e(
        "adresine iletebilirsiniz. Talepleriniz, mevzuatta öngörülen süreler içinde değerlendirilip sonuçlandırılır.",
        ". Your requests will be evaluated and concluded within the periods stipulated by legislation.",
        " senden. Ihre Anfragen werden innerhalb der gesetzlich vorgeschriebenen Fristen geprüft und bearbeitet."
      ),
      footerLink: e("Kullanım Şartları →", "Terms of Use →", "Nutzungsbedingungen →"),
    },
    terms: {
      pageTitle: e("Kullanım Şartları", "Terms of Use", "Nutzungsbedingungen"),
      metaDescription: e(
        "Tezgahçı platformunu kullanırken geçerli olan kullanım şartları ve kurallar.",
        "The terms of use and rules that apply when using the Tezgahçı platform.",
        "Die Nutzungsbedingungen und Regeln, die bei der Nutzung der Plattform Tezgahçı gelten."
      ),
      lastUpdated: e("Son güncelleme: 4 Eylül 2026", "Last updated: September 4, 2026", "Zuletzt aktualisiert: 4. September 2026"),
      section1Title: e("1. Kabul", "1. Acceptance", "1. Annahme"),
      section1Body: e(
        'www.tezgahci.com.tr ("Tezgahçı", "Platform") üzerinden üye olarak veya siteyi kullanarak bu Kullanım Şartları\'nı kabul etmiş sayılırsınız. Bu şartları kabul etmiyorsanız Platform\'u kullanmamalısınız.',
        'By becoming a member of or using www.tezgahci.com.tr ("Tezgahçı", "Platform"), you are deemed to have accepted these Terms of Use. If you do not accept these terms, you should not use the Platform.',
        'Durch die Anmeldung als Mitglied oder die Nutzung von www.tezgahci.com.tr ("Tezgahçı", "Plattform") gelten diese Nutzungsbedingungen als von Ihnen akzeptiert. Wenn Sie diese Bedingungen nicht akzeptieren, dürfen Sie die Plattform nicht nutzen.'
      ),
      section2Title: e("2. Platformun Niteliği", "2. Nature of the Platform", "2. Wesen der Plattform"),
      section2Body: e(
        "Tezgahçı, CNC tezgahları, makineleri ve bunlara ait yedek parça, yağ, aparat ve divizör gibi ürünlerin alıcı ve satıcılarını buluşturan bir ilan/pazar yeri platformudur. Tezgahçı, ilan veren kullanıcılar ile alıcılar arasındaki alım-satım işlemlerine taraf değildir; ödeme, teslimat ve garanti gibi konular tamamen taraflar arasındadır. Tezgahçı bu işlemlerin sonucundan sorumlu tutulamaz.",
        "Tezgahçı is a listings/marketplace platform that connects buyers and sellers of CNC machine tools, machinery, and related products such as spare parts, oils, fixtures, and rotary tables. Tezgahçı is not a party to the buying and selling transactions between listing users and buyers; matters such as payment, delivery, and warranty are entirely between the parties. Tezgahçı cannot be held responsible for the outcome of these transactions.",
        "Tezgahçı ist eine Anzeigen-/Marktplattform, die Käufer und Verkäufer von CNC-Werkzeugmaschinen, Maschinen und zugehörigen Produkten wie Ersatzteilen, Ölen, Vorrichtungen und Teiltischen zusammenbringt. Tezgahçı ist nicht Partei der Kauf- und Verkaufsgeschäfte zwischen anzeigenden Nutzern und Käufern; Angelegenheiten wie Zahlung, Lieferung und Garantie liegen ausschließlich zwischen den Parteien. Tezgahçı kann für das Ergebnis dieser Geschäfte nicht verantwortlich gemacht werden."
      ),
      section3Title: e("3. Üyelik", "3. Membership", "3. Mitgliedschaft"),
      section3Body: e(
        "Üyelik için verdiğiniz bilgilerin doğru, güncel ve eksiksiz olması gerekir. Hesabınızın güvenliğinden (şifrenizin gizliliği dâhil) siz sorumlusunuz. Bayi hesapları, yönetici onayı ile aktif hâle gelir; onay sürecinde talep edilen faaliyet belgesi ve imza sirküleri gibi belgelerin gerçek ve güncel olması zorunludur.",
        "The information you provide for membership must be accurate, current, and complete. You are responsible for the security of your account, including the confidentiality of your password. Dealer accounts become active upon administrator approval; documents requested during the approval process, such as the certificate of activity and signature circular, must be genuine and up to date.",
        "Die für die Mitgliedschaft angegebenen Informationen müssen korrekt, aktuell und vollständig sein. Sie sind für die Sicherheit Ihres Kontos verantwortlich, einschließlich der Vertraulichkeit Ihres Passworts. Händlerkonten werden nach Genehmigung durch den Administrator aktiv; im Genehmigungsverfahren angeforderte Dokumente wie Tätigkeitsbescheinigung und Unterschriftszirkular müssen echt und aktuell sein."
      ),
      section4Title: e("4. İlan Verme Kuralları", "4. Listing Rules", "4. Regeln für Anzeigen"),
      section4Body: e(
        "İlana konu ürünün mülkiyetinize ait olması veya satışa yetkili olmanız gerekir. Yanıltıcı, gerçek dışı, hukuka aykırı veya üçüncü kişilerin haklarını ihlal eden içerik (izinsiz fotoğraf/marka kullanımı dâhil) paylaşılamaz. Tezgahçı, bu kurallara aykırı ilanları veya hesapları önceden bildirimde bulunmaksızın kaldırma/askıya alma hakkını saklı tutar.",
        "You must own the product subject to the listing or be authorized to sell it. Misleading, false, unlawful content, or content that infringes the rights of third parties (including unauthorized use of photos/trademarks) may not be shared. Tezgahçı reserves the right to remove or suspend listings or accounts that violate these rules without prior notice.",
        "Sie müssen Eigentümer des in der Anzeige beworbenen Produkts sein oder zu dessen Verkauf berechtigt sein. Irreführende, falsche, rechtswidrige Inhalte oder Inhalte, die Rechte Dritter verletzen (einschließlich unbefugter Nutzung von Fotos/Marken), dürfen nicht veröffentlicht werden. Tezgahçı behält sich das Recht vor, Anzeigen oder Konten, die gegen diese Regeln verstoßen, ohne vorherige Ankündigung zu entfernen oder zu sperren."
      ),
      section5Title: e("5. İçerik ve Sorumluluk", "5. Content and Responsibility", "5. Inhalt und Verantwortung"),
      section5Body: e(
        "İlan başlığı, açıklama, fiyat ve fotoğraflar dâhil tüm ilan içeriğinden ilanı veren kullanıcı sorumludur. Tezgahçı, ilanların doğruluğunu garanti etmez ve ilan içeriğinden doğabilecek zararlardan sorumlu tutulamaz. Alıcıların, satın alma kararı öncesinde satıcı ve ürünle ilgili makul özeni göstermesi beklenir.",
        "The user who posts the listing is responsible for all listing content, including the title, description, price, and photos. Tezgahçı does not guarantee the accuracy of listings and cannot be held responsible for damages arising from listing content. Buyers are expected to exercise reasonable care regarding the seller and the product before making a purchase decision.",
        "Der Nutzer, der die Anzeige einstellt, ist für alle Anzeigeninhalte verantwortlich, einschließlich Titel, Beschreibung, Preis und Fotos. Tezgahçı garantiert nicht die Richtigkeit der Anzeigen und kann nicht für Schäden verantwortlich gemacht werden, die aus dem Anzeigeninhalt entstehen. Von Käufern wird erwartet, dass sie vor einer Kaufentscheidung angemessene Sorgfalt hinsichtlich des Verkäufers und des Produkts walten lassen."
      ),
      section6Title: e("6. Yasaklı Davranışlar", "6. Prohibited Behavior", "6. Verbotenes Verhalten"),
      section6Body: e(
        "Platform'u kötüye kullanma, sahte ilan/hesap oluşturma, diğer kullanıcıları taciz etme, spam gönderme, Platform'un teknik altyapısına zarar verecek girişimlerde bulunma ve hukuka aykırı içerik paylaşma yasaktır. Bu kurallara aykırı davranan hesaplar askıya alınabilir veya kalıcı olarak kapatılabilir.",
        "Misusing the Platform, creating fake listings/accounts, harassing other users, sending spam, attempting to damage the Platform's technical infrastructure, and sharing unlawful content are prohibited. Accounts that violate these rules may be suspended or permanently closed.",
        "Der Missbrauch der Plattform, das Erstellen gefälschter Anzeigen/Konten, die Belästigung anderer Nutzer, das Versenden von Spam, Versuche, die technische Infrastruktur der Plattform zu schädigen, sowie das Teilen rechtswidriger Inhalte sind untersagt. Konten, die gegen diese Regeln verstoßen, können gesperrt oder dauerhaft geschlossen werden."
      ),
      section7Title: e("7. Fikri Mülkiyet", "7. Intellectual Property", "7. Geistiges Eigentum"),
      section7Body: e(
        "Platform'un tasarımı, yazılımı ve markası Tezgahçı'ya aittir. Kullanıcılar tarafından yüklenen ilan fotoğrafları ve metinlerinin telif hakları kullanıcılara ait olup, bu içeriklerin Platform üzerinde görüntülenmesi için Tezgahçı'ya gerekli kullanım izni verilmiş sayılır.",
        "The design, software, and brand of the Platform belong to Tezgahçı. The copyrights of listing photos and texts uploaded by users belong to the users; by uploading them, the necessary usage permission is deemed to have been granted to Tezgahçı for displaying this content on the Platform.",
        "Design, Software und Marke der Plattform gehören Tezgahçı. Die Urheberrechte an von Nutzern hochgeladenen Anzeigenfotos und -texten liegen bei den Nutzern; durch das Hochladen gilt die erforderliche Nutzungserlaubnis für die Anzeige dieser Inhalte auf der Plattform als Tezgahçı erteilt."
      ),
      section8Title: e("8. Değişiklikler", "8. Changes", "8. Änderungen"),
      section8Body: e(
        "Tezgahçı, bu Kullanım Şartları'nı zaman zaman güncelleyebilir. Güncel metin her zaman bu sayfada yayınlanır ve yayınlandığı andan itibaren geçerli olur.",
        "Tezgahçı may update these Terms of Use from time to time. The current text is always published on this page and takes effect from the moment it is published.",
        "Tezgahçı kann diese Nutzungsbedingungen von Zeit zu Zeit aktualisieren. Der aktuelle Text wird stets auf dieser Seite veröffentlicht und gilt ab dem Zeitpunkt der Veröffentlichung."
      ),
      section9Title: e("9. İletişim", "9. Contact", "9. Kontakt"),
      section9BodyPrefix: e(
        "Kullanım Şartları hakkındaki sorularınız için",
        "For questions about these Terms of Use, you can reach us at",
        "Bei Fragen zu diesen Nutzungsbedingungen erreichen Sie uns unter"
      ),
      section9BodySuffix: e(
        "adresinden bize ulaşabilirsiniz.",
        ".",
        "."
      ),
      footerLink: e(
        "← Gizlilik Politikası ve KVKK Aydınlatma Metni",
        "← Privacy Policy and KVKK Disclosure Text",
        "← Datenschutzerklärung und KVKK-Informationstext"
      ),
    },
  },
  dealerPanel: {
    loginRequiredTitle: e("Bayi paneline erişmek için giriş yapın", "Log in to access the dealer panel", "Melden Sie sich an, um auf den Händlerbereich zuzugreifen"),
    individualOnlyTitle: e("Bu panel yalnızca bayi hesapları içindir", "This panel is for dealer accounts only", "Dieser Bereich ist nur für Händlerkonten"),
    individualOnlyDesc: e(
      "Bireysel hesabınızla bayi paneline erişemezsiniz.",
      "You cannot access the dealer panel with an individual account.",
      "Mit einem Einzelkonto können Sie nicht auf den Händlerbereich zugreifen."
    ),
    pendingApprovalTitle: e("Bayi hesabınız onay bekliyor", "Your dealer account is pending approval", "Ihr Händlerkonto wartet auf Genehmigung"),
    pendingApprovalDesc: e(
      "Hesabınız yönetici onayından geçtikten sonra bayi paneline erişebilirsiniz.",
      "You can access the dealer panel once your account has been approved by an administrator.",
      "Sie können auf den Händlerbereich zugreifen, sobald Ihr Konto von einem Administrator genehmigt wurde."
    ),
    myPanelTitle: e("Bayi Panelim", "My Dealer Panel", "Mein Händlerbereich"),
    tileListings: e("İlanlarım", "My Listings", "Meine Anzeigen"),
    tileTeam: e("Ekip", "Team", "Team"),
    tileStats: e("İstatistikler", "Statistics", "Statistiken"),
    teamSubtitle: e(
      "Firmanız adına ilan verip yönetebilecek ekip üyeleri (ör. Müşteri Temsilcisi) tanımlayın.",
      "Define team members (e.g. Customer Representative) who can post and manage listings on behalf of your company.",
      "Definieren Sie Teammitglieder (z. B. Kundenberater), die im Namen Ihres Unternehmens Anzeigen erstellen und verwalten können."
    ),
    teamListError: e("Ekip listelenemedi.", "Could not load the team list.", "Team konnte nicht geladen werden."),
    addMemberError: e("Ekip üyesi eklenemedi.", "Could not add team member.", "Teammitglied konnte nicht hinzugefügt werden."),
    removeConfirm: e(
      "Bu ekip üyesini kaldırmak istediğinize emin misiniz? Hesap tamamen silinecek.",
      "Are you sure you want to remove this team member? The account will be permanently deleted.",
      "Möchten Sie dieses Teammitglied wirklich entfernen? Das Konto wird vollständig gelöscht."
    ),
    emptyTeamTitle: e("Henüz ekip üyeniz yok", "You have no team members yet", "Sie haben noch keine Teammitglieder"),
    emptyTeamDesc: e(
      "Aşağıdaki formla ilk üyeyi ekleyin.",
      "Add your first member using the form below.",
      "Fügen Sie Ihr erstes Mitglied über das untenstehende Formular hinzu."
    ),
    removeTooltip: e("Kaldır", "Remove", "Entfernen"),
    addMemberSectionTitle: e("Yeni Ekip Üyesi Ekle", "Add New Team Member", "Neues Teammitglied hinzufügen"),
    fullNameRequired: e("Ad Soyad *", "Full Name *", "Vollständiger Name *"),
    roleLabel: e("Unvan", "Title", "Position"),
    usernameRequired: e("Kullanıcı Adı *", "Username *", "Benutzername *"),
    emailRequired: e("E-posta *", "Email *", "E-Mail *"),
    tempPasswordRequired: e("Geçici Şifre *", "Temporary Password *", "Vorübergehendes Passwort *"),
    adding: e("Ekleniyor...", "Adding...", "Wird hinzugefügt..."),
    addMemberButton: e("Ekip Üyesi Ekle", "Add Team Member", "Teammitglied hinzufügen"),
    myListingsSubtitle: e(
      "Bayinize ait tüm ilanlar (ekip üyelerinin verdikleri dahil).",
      "All listings belonging to your dealership (including those posted by team members).",
      "Alle Anzeigen Ihres Händlerbetriebs (einschließlich der von Teammitgliedern erstellten)."
    ),
    newListingButton: e("Yeni İlan", "New Listing", "Neue Anzeige"),
    permissionError: e("Bu sayfayı görüntüleme yetkiniz yok.", "You do not have permission to view this page.", "Sie sind nicht berechtigt, diese Seite anzuzeigen."),
    emptyListingsTitle: e("Henüz ilanınız yok", "You have no listings yet", "Sie haben noch keine Anzeigen"),
    emptyListingsDesc: e(
      "İlk ilanınızı vererek başlayın.",
      "Get started by posting your first listing.",
      "Beginnen Sie mit Ihrer ersten Anzeige."
    ),
    viewsCount: e("{n} görüntülenme", "{n} views", "{n} Aufrufe"),
    statusActive: e("Aktif", "Active", "Aktiv"),
    vitrinBadge: e("Vitrin", "Showcase", "Vitrine"),
    deleteConfirm: e(
      "Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?",
      "Are you sure you want to permanently delete this listing?",
      "Möchten Sie diese Anzeige wirklich dauerhaft löschen?"
    ),
    markActiveButton: e("Aktife Al", "Mark Active", "Als aktiv markieren"),
    deleteTooltip: e("Sil", "Delete", "Löschen"),
    statsSubtitle: e(
      "Firmanızın pazar yerindeki performansı.",
      "Your company's performance on the marketplace.",
      "Die Leistung Ihres Unternehmens auf dem Marktplatz."
    ),
    statsError: e("İstatistikler alınamadı.", "Could not load statistics.", "Statistiken konnten nicht geladen werden."),
    statTotal: e("Toplam İlan", "Total Listings", "Anzeigen gesamt"),
    statVitrin: e("Vitrindeki İlan", "Showcased Listings", "Anzeigen in der Vitrine"),
    statTotalViews: e("Toplam Görüntülenme", "Total Views", "Aufrufe gesamt"),
    statTotalMessages: e("Toplam Mesaj", "Total Messages", "Nachrichten gesamt"),
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
