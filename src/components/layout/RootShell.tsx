import type { ReactNode } from "react"
import "@/app/globals.css"
import { fontVariables } from "@/app/fonts"
import { ThemeProvider } from "next-themes"
import { ReadingProgress } from "@/components/layout/ReadingProgress"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ScrollToTop } from "@/components/ScrollToTop"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"

/**
 * Wspólny szkielet dokumentu dla obu wersji językowych.
 *
 * Serwis ma dwa układy główne — jeden dla polskiej wersji w katalogu głównym,
 * drugi dla angielskiej pod `/en` — bo atrybut `lang` na `<html>` musi się
 * różnić, a w App Routerze ustawia go wyłącznie układ główny. Cała reszta
 * (kroje, motyw, nagłówek, stopka, pomiary) siedzi tutaj, żeby oba układy
 * nie mogły się rozjechać.
 */
export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    // Zmienne krojów muszą siedzieć na <html>: Tailwind v4 ustawia
    // font-family właśnie na tym elemencie, więc deklaracja na <body>
    // była o poziom za nisko i serwis renderował się krojem systemowym.
    // `data-scroll-behavior`: Next 16 wyłącza płynne przewijanie na czas
    // nawigacji tylko wtedy, gdy wie, że arkusz je włącza (globals.css).
    <html
      lang={locale}
      className={fontVariables}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* Bez przejść podczas zmiany motywu — inaczej każdy `transition-colors` animuje się osobno. */}
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          {/* Widoczny tylko po wejściu klawiszem Tab — omija nagłówek (WCAG 2.4.1). */}
          <a
            href="#main"
            data-print-hide
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-70 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:ring-2 focus:ring-ring"
          >
            {getCommon(locale).ui.skipToContent}
          </a>
          <ScrollToTop />
          <ReadingProgress />
          <Header locale={locale} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
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
