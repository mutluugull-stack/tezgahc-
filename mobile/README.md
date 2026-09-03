# Tezgahçı — Mobil Uygulama (Capacitor)

Bu klasör, [www.tezgahci.com.tr](https://www.tezgahci.com.tr) sitesini bir
native uygulama kabuğu (Capacitor) içinde gösteren mobil uygulamayı içerir.
Uygulama, siteyi olduğu gibi kendi içinde açar; sitede yaptığımız her
güncelleme otomatik olarak uygulamaya da yansır — App Store/Play Store'a
her seferinde yeni bir sürüm yüklemenize gerek kalmaz (yalnızca ikon, isim
gibi native ayarlar değiştiğinde yeniden derleme gerekir).

## Nasıl derlenir?

Bu depoya `mobile/**` altında bir değişiklik push edildiğinde veya
**Actions → Build Mobile App → Run workflow** ile elle tetiklendiğinde,
`.github/workflows/build-mobile.yml` iş akışı:

- Android için imzasız bir **debug APK** derler (`tezgahci-android-debug-apk`
  adlı artifact). Bu APK doğrudan bir Android telefona kurulup test
  edilebilir (Play Store'a yüklemek için ayrıca imzalı bir *release* build
  ve bir Play Console hesabı gerekir).
- iOS için Xcode projesini oluşturur, simülatörde derlemesini doğrular ve
  projeyi bir zip (`tezgahci-ios-xcode-project`) olarak sunar. **iOS'ta
  gerçek bir cihaza kurulabilir uygulama üretmek için Apple, bir Mac +
  Xcode + kendi Apple Developer hesabınızla imzalama ister** — bu adım CI
  içinde otomatikleştirilemez, projeyi indirip Xcode'da açmanız ve kendi
  Apple ID'nizle "Signing & Capabilities" sekmesinden imzalamanız gerekir.

## Yerelde (kendi bilgisayarınızda) çalıştırmak isterseniz

```bash
cd mobile
npm install
npx cap add android   # ve/veya: npx cap add ios
npx capacitor-assets generate
npx cap sync
npx cap open android  # Android Studio'yu açar
npx cap open ios      # Xcode'u açar (yalnızca macOS)
```

## Native ayarları değiştirmek

- **Uygulama adı / paket kimliği**: `capacitor.config.ts` içindeki `appName`
  ve `appId`.
- **Hangi site açılıyor**: `capacitor.config.ts` içindeki `server.url`.
- **İkon / açılış ekranı görselleri**: `resources/icon.png`,
  `resources/icon-foreground.png`, `resources/icon-background.png`,
  `resources/splash.png` — bunlar sitedeki `public/logo.png`'den
  türetilmiştir. Değiştirmek için bu dosyaları güncelleyip iş akışını
  yeniden çalıştırmanız yeterli.
