"use client"

import { useSyncExternalStore } from "react"
import { locales, otherLocale, type Locale } from "@/i18n/config"

const SEGMENT =
  "relative grid h-7 min-w-9 place-items-center rounded-full px-2.5 text-xs font-medium uppercase outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring after:absolute after:-inset-y-2 after:inset-x-0"
const CURRENT = `${SEGMENT} bg-background text-foreground shadow-xs`
const OTHER = `${SEGMENT} text-muted-foreground hover:text-foreground`

/** Metadane zmieniają się przy przejściu między stronami — wtedy liczymy adres od nowa. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.head, { childList: true, subtree: true, attributes: true })
  return () => observer.disconnect()
}

/** Odpowiednik oglądanej strony w języku `target` — z jej znacznika `hreflang` (metadane). */
function counterpartFromHead(target: Locale): string | null {
  const link = document.querySelector<HTMLLinkElement>(
    `link[rel="alternate"][hreflang="${target}"]`
  )
  return link ? new URL(link.href).pathname : null
}

/**
 * PL / EN jako przełącznik segmentowy w stylu shadcn (Tabs): obła ścieżka tej
 * samej wysokości co wyszukiwarka i przycisk motywu, bieżący język na jasnym
 * segmencie (nie jest linkiem — `aria-current`).
 *
 * Drugi język prowadzi na odpowiednik oglądanej strony. Adres podaje sama
 * strona: jej znacznik `hreflang` liczy `src/i18n/alternates.ts` (metadane),
 * więc do przeglądarki nie trafia żadna mapa adresów. Do hydratacji (i bez JS)
 * link prowadzi na stronę główną drugiej wersji. Podgląd ma tylko wersję
 * polską — angielski odpowiednik to dziś strona serwisu. Zwykłe `<a>`: wersje
 * językowe mają osobne układy główne. Klasy jako stałe napisy (bez `cn()`) — nic
 * tu nie scala klas.
 */
export function LanguageSwitch({
  label,
  locale,
  fallback,
}: {
  label: string
  locale: Locale
  /** Strona główna drugiej wersji — gdy strona nie ma odpowiednika. */
  fallback: string
}) {
  const target = otherLocale(locale)
  const href = useSyncExternalStore(
    subscribe,
    () => counterpartFromHead(target) ?? fallback,
    () => fallback
  )

  return (
    <nav aria-label={label} className="flex h-9 items-center rounded-full bg-secondary p-1">
      {locales.map((code) =>
        code === locale ? (
          <span key={code} aria-current="page" className={CURRENT}>
            {code}
          </span>
        ) : (
          <a key={code} href={href} hrefLang={code} lang={code} className={OTHER}>
            {code}
          </a>
        )
      )}
    </nav>
  )
}
