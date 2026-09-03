import type { Metadata } from "next";
import { Oswald, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PwaRegister from "@/components/PwaRegister";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tezgahçı — CNC Makine Pazarı",
  description:
    "Türkiye'nin CNC tezgah ve makine ilan platformu. CNC torna, freze, router, lazer, plazma, EDM ve abkant pres ilanlarını inceleyin, ilan verin.",
  metadataBase: new URL("https://tezgahci.com.tr"),
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    // iOS Safari: "Ana Ekrana Ekle" ile kurulduğunda tarayıcı çubuğu olmadan,
    // native bir uygulama gibi açılmasını sağlar.
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tezgahçı",
  },
  other: {
    // Android Chrome eski sürümleri için (modern Chrome manifest.json'daki
    // theme_color'ı zaten kullanır, bu satır ek bir garanti).
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  themeColor: "#004aad",
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${oswald.variable} ${plexSans.variable} ${plexMono.variable} font-body antialiased`}>
        <script
          // Tema tercihini ilk çizimden önce uygulayarak yanıp sönmeyi (FOUC) önler.
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('tezgahci_theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
        <PwaRegister />
        <SessionProviderWrapper>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
