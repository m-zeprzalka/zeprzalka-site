import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import "@/app/main-page/globals.css"
import { fontVariables } from "@/app/fonts"
import { getShellContent } from "@/app/main-page/_lib/content/shell"
import type { Locale } from "@/i18n/config"
import { logoFontVariables } from "./fonts"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"

/**
 * Platforma przed pierwszym malowaniem: skrót wyszukiwarki pokazuje od razu
 * ⌘ albo Ctrl (`in-data-[os=other]:`), bez podmiany po hydratacji.
 */
const PLATFORM_SCRIPT = `document.documentElement.dataset.os=/Mac|iPhone|iPad|iPod/.test(navigator.userAgent)?"apple":"other"`

/**
 * Szkielet dokumentu nowej wersji: kroje, motyw (ciemny na start, bez animacji
 * przy zmianie), nagłówek, treść i stopka. Wspólny dla przyszłych układów
 * `(pl)` i `en` — atrybut `lang` ustawia tylko układ główny.
 */
export function MainShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const { skipToContent, header, footer } = getShellContent(locale)

  return (
    <html
      lang={locale}
      className={`${fontVariables} ${logoFontVariables}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: PLATFORM_SCRIPT }} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground"
          >
            {skipToContent}
          </a>
          <SiteHeader {...header} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter {...footer} locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  )
}
