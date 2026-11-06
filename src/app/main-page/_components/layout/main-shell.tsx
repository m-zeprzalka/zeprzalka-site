import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import "@/app/main-page/globals.css"
import { fontVariables } from "@/app/fonts"
import { getHomeContent } from "@/app/main-page/_lib/content"
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
  const { ui, person, search, language, footer } = getHomeContent(locale)

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
            {ui.skipToContent}
          </a>
          <SiteHeader
            domain={person.domain}
            homeHref={person.homeHref}
            themeLabel={ui.themeToggle}
            language={language}
            search={{
              groups: search,
              email: person.email,
              labels: {
                search: ui.search,
                title: ui.searchTitle,
                description: ui.searchDescription,
                placeholder: ui.searchPlaceholder,
                empty: ui.searchEmpty,
                hints: ui.searchHints,
              },
            }}
          />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter
            copyright={footer.copyright}
            profilesHeading={footer.profilesHeading}
            profiles={footer.profiles}
            wordmark={footer.wordmark}
            city={footer.city}
            localTimeLabel={ui.localTime}
            newTabLabel={ui.newTab}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
