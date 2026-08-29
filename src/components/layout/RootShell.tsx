import { Geist, Geist_Mono } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Bar } from "@/components/layout/Bar"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ScrollToTop } from "@/components/ScrollToTop"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { HTML_LANG, type Locale } from "@/i18n/config"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

/**
 * Wspólny szkielet dokumentu dla obu wersji językowych.
 *
 * Serwis ma dwa układy główne — jeden dla polskiej wersji w katalogu głównym,
 * drugi dla angielskiej pod `/en` — bo atrybut `lang` na `<html>` musi się
 * różnić, a w App Routerze ustawia go wyłącznie układ główny. Cała reszta
 * (kroje, motyw, nagłówek, stopka, pomiary) siedzi tutaj, żeby oba układy
 * nie mogły się rozjechać.
 */
export function RootShell({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return (
    // Zmienne krojów muszą siedzieć na <html>: Tailwind v4 ustawia
    // font-family właśnie na tym elemencie, więc deklaracja na <body>
    // była o poziom za nisko i serwis renderował się krojem systemowym.
    <html
      lang={HTML_LANG[locale]}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ScrollToTop />
          <Bar />
          <Header locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
        </ThemeProvider>
        {/*
          Pomiar ruchu i Core Web Vitals. Oba skrypty ładują się z tej samej
          domeny (/_vercel/...), nie ustawiają ciasteczek i nie profilują
          użytkowników — nie wymagają więc zgody na ciasteczka.
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
