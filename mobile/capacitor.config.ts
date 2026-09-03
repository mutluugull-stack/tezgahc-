import type { CapacitorConfig } from "@capacitor/cli";

// Tezgahçı mobil uygulaması: canlı siteyi (www.tezgahci.com.tr) native bir
// pencere içinde gösterir. Sitede yapılan her güncelleme otomatik olarak
// uygulamaya da yansır — ayrı bir mobil derleme/yayın gerekmez.
const config: CapacitorConfig = {
  appId: "com.tezgahci.app",
  appName: "Tezgahçı",
  webDir: "www",
  server: {
    url: "https://www.tezgahci.com.tr",
    androidScheme: "https",
    iosScheme: "https",
    // Uygulama içinde kalması beklenen linkler (kendi alan adımız) ve
    // girişte kullanılabilecek yardımcı bağlantılar için gezinmeye izin ver.
    allowNavigation: ["www.tezgahci.com.tr", "tezgahci.com.tr", "*.public.blob.vercel-storage.com"],
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "automatic",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#004aad",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#004aad",
    },
  },
};

export default config;
