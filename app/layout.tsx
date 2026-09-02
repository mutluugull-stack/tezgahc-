import type { Metadata } from "next";
import { Oswald, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
};

export const viewport = {
  themeColor: "#004aad",
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
