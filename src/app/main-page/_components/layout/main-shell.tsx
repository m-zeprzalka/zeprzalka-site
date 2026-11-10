import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "@/app/main-page/globals.css"
import { fontVariables } from "@/app/fonts"
import { getShellContent } from "@/app/main-page/_lib/content/shell"
import { THEME_COLOR } from "@/app/main-page/_lib/theme"
import type { Locale } from "@/i18n/config"
import { logoFontVariables } from "./fonts"
import { HashFocus } from "./hash-focus"
import { RailNav } from "./rail-nav"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"

/**
 * Przed pierwszym malowaniem: platforma (skrót wyszukiwarki pokazuje od razu ⌘ albo
 * Ctrl, `in-data-[os=other]:`) i kolor paska przeglądarki dla jasnego motywu.
 */
const PLATFORM_SCRIPT = `document.documentElement.dataset.os=/Mac|iPhone|iPad|iPod/.test(navigator.userAgent)?"apple":"other";try{if(localStorage.getItem("theme")==="light")document.querySelector('meta[name="theme-color"]')?.setAttribute("content","${THEME_COLOR.light}")}catch(e){}`

/**
 * Szkielet dokumentu nowej wersji: kroje, motyw (ciemny na start, bez animacji
 * przy zmianie — `useToggleTheme`), nagłówek, menu główne w lewym torze, treść i stopka. Wspólny dla przyszłych układów
 * `(pl)` i `en` — atrybut `lang` ustawia tylko układ główny.
 */
export function MainShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const { skipToContent, header, rail, footer } = getShellContent(locale)

  return (
    // `dark` i `color-scheme` już w HTML: domyślny motyw maluje się od pierwszej klatki, bez
    // błysku jasnych tokenów, zanim skrypt next-themes ustawi klasę (jasny motyw ją podmienia).
    // `data-scroll-behavior`: arkusz włącza płynne przewijanie (kotwice), a Next 16 wyłącza je
    // na czas przejścia tylko z tym atrybutem — bez niego nowa strona rysowała się na wysokości
    // poprzedniej i dopiero potem płynęła na górę.
    <html
      lang={locale}
      className={`dark ${fontVariables} ${logoFontVariables}`}
      data-scroll-behavior="smooth"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: PLATFORM_SCRIPT }} />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground"
          >
            {skipToContent}
          </a>
          <SiteHeader {...header} />
          <RailNav {...rail} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter {...footer} locale={locale} />
          <HashFocus />
          {/* Bez JS przyciski akordeonów nic nie robią — treść paneli stoi wtedy otwarta. */}
          <noscript>
            <style>
              {"[data-slot=accordion-content]{visibility:visible!important;height:auto!important}"}
            </style>
          </noscript>
        </ThemeProvider>
        {/* Ruch i Web Vitals z prawdziwych urządzeń — jak w serwisie (bez ciasteczek). */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
