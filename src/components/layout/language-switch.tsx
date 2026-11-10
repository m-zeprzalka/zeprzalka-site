"use client"

import { usePathname } from "next/navigation"
import { counterpart } from "@/i18n/alternates"
import { locales, otherLocale, type Locale, type Localized } from "@/i18n/config"

const SEGMENT =
  "relative grid h-7 min-w-9 place-items-center rounded-full px-2.5 text-xs font-medium uppercase outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring after:absolute after:-inset-y-2 after:inset-x-0"
const CURRENT = `${SEGMENT} bg-background text-foreground shadow-xs`
const OTHER = `${SEGMENT} text-muted-foreground hover:text-foreground`

/**
 * PL / EN jako przełącznik segmentowy w stylu shadcn (Tabs): obła ścieżka tej
 * samej wysokości co wyszukiwarka i przycisk motywu, bieżący język na jasnym
 * segmencie (nie jest linkiem — `aria-current`).
 *
 * Drugi język prowadzi na odpowiednik oglądanej strony: `counterpart()` z bieżącej
 * ścieżki (ta sama mapa co znaczniki `hreflang` — `src/i18n/alternates.ts`), więc link
 * jest dobry już w HTML z serwera — przed hydratacją, bez JS i dla robotów. Wpis bez
 * tłumaczenia prowadzi na indeks bloga. Zwykłe `<a>`: wersje językowe mają osobne
 * układy główne. Klasy jako stałe napisy (bez `cn()`) — nic tu nie scala klas.
 */
export function LanguageSwitch({
  label,
  aria,
  locale,
  pageCounts,
}: {
  label: string
  /** Nazwa linku do drugiej wersji, po kodzie języka („PL — Switch language to Polish”). */
  aria: string
  locale: Locale
  /** Liczba stron archiwum bloga w każdym języku (strona 3 może nie mieć odpowiednika). */
  pageCounts: Localized<number>
}) {
  const target = otherLocale(locale)
  const href = counterpart(usePathname(), locale, target, pageCounts)

  return (
    <nav aria-label={label} className="flex h-9 items-center rounded-full bg-secondary p-1">
      {locales.map((code) =>
        code === locale ? (
          <span key={code} aria-current="page" className={CURRENT}>
            {code}
          </span>
        ) : (
          <a
            key={code}
            href={href}
            hrefLang={code}
            // Nazwa w języku strony („EN — Zmień język na angielski”), więc bez `lang` na linku.
            aria-label={`${code.toUpperCase()} — ${aria}`}
            className={OTHER}
          >
            {code}
          </a>
        )
      )}
    </nav>
  )
}
