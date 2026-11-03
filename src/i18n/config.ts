/**
 * Konfiguracja dwujęzyczności / Bilingual configuration.
 *
 * Serwis ma dwie wersje językowe i jedną zasadę: **żaden tekst nie istnieje
 * tylko w jednym języku**. Pilnują tego dwa mechanizmy, oba wymuszane przez
 * TypeScript:
 *
 * 1. `Localized<T>` — para `{ pl, en }` wpisana w miejscu, w którym tekst
 *    należy do danych (tytuł realizacji, nazwa pakietu). Brak jednego pola
 *    to błąd kompilacji.
 * 2. Moduły treści w `src/i18n/content/*` — lustrzane drzewa `pl` i `en`,
 *    gdzie `en` ma typ `typeof pl`. Brak klucza to błąd kompilacji.
 *
 * Polska wersja mieszka w katalogu głównym (`/uslugi`), angielska pod `/en`
 * (`/en/services`). Adresy polskie nie zmieniły się ani o znak — są zaindeksowane.
 */
import type { Metadata } from "next"

export const locales = ["pl", "en"] as const
export type Locale = (typeof locales)[number]

/** Język serwisu bez prefiksu w adresie. */
export const DEFAULT_LOCALE: Locale = "pl"

/** Para tekstów: obie wersje albo błąd kompilacji. */
export type Localized<T> = Readonly<Record<Locale, T>>

/** Strażnik typu dla wartości z zewnątrz (formularz, parametr). */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value)
}

/**
 * Znacznik języka z regionem (BCP 47) — dla `Intl`, danych strukturalnych
 * (`inLanguage`) i kanału RSS. Angielskie copy jest brytyjskie, stąd `en-GB`.
 * Atrybut `lang` na `<html>` i `hreflang` używają samego kodu języka (`Locale`).
 */
export const INTL_LOCALE: Localized<string> = { pl: "pl-PL", en: "en-GB" }

/** `og:locale` — Open Graph wymaga formatu `język_REGION`. */
export const OG_LOCALE: Localized<string> = { pl: "pl_PL", en: "en_GB" }

/**
 * Mapa adresów. Jedno miejsce, w którym para „ta sama strona w dwóch
 * językach" jest zapisana — z niej powstają linki, przełącznik języka,
 * znaczniki `hreflang` i mapa strony.
 */
export const ROUTES = {
  home: { pl: "/", en: "/en" },
  services: { pl: "/uslugi", en: "/en/services" },
  about: { pl: "/o-mnie", en: "/en/about" },
  contact: { pl: "/kontakt", en: "/en/contact" },
  portfolio: { pl: "/portfolio", en: "/en/portfolio" },
  blog: { pl: "/blog", en: "/en/blog" },
  categories: { pl: "/blog/kategoria", en: "/en/blog/category" },
  feed: { pl: "/feed.xml", en: "/en/feed.xml" },
  privacy: { pl: "/polityka-prywatnosci", en: "/en/privacy" },
} as const satisfies Record<string, Localized<string>>

/**
 * Prefiksy adresów, pod którymi nie ma własnej strony — tylko podstrony
 * (`/blog/strona/2`, `/blog/tag/next.js`). Osobno od `ROUTES`, żeby nie dało
 * się ich podać jako strony (mapa strony, przełącznik języka, metadane).
 */
export const PATH_BASES = {
  /** Kolejne strony archiwum bloga. Strona 1 to `ROUTES.blog`. */
  blogPage: { pl: "/blog/strona", en: "/en/blog/page" },
  tags: { pl: "/blog/tag", en: "/en/blog/tag" },
} as const satisfies Record<string, Localized<string>>

export type RouteKey = keyof typeof ROUTES

export function route(key: RouteKey, locale: Locale): string {
  return ROUTES[key][locale]
}

export function postPath(locale: Locale, slug: string): string {
  return `${ROUTES.blog[locale]}/${slug}`
}

/**
 * Adres n-tej strony archiwum. Pierwsza strona to sam indeks bloga — bez
 * tego `/blog` i `/blog/strona/1` byłyby dwoma adresami tej samej treści.
 */
export function blogPagePath(locale: Locale, page: number): string {
  return page <= 1 ? ROUTES.blog[locale] : `${PATH_BASES.blogPage[locale]}/${page}`
}

export function categoryPath(locale: Locale, slug: string): string {
  return `${ROUTES.categories[locale]}/${slug}`
}

export function tagPath(locale: Locale, slug: string): string {
  return `${PATH_BASES.tags[locale]}/${slug}`
}

/**
 * Adres kanoniczny plus `hreflang`. Wyszukiwarka dostaje wprost, że dwie
 * strony to ten sam dokument w dwóch językach — bez tego traktuje je jak
 * treść zduplikowaną albo pokazuje Polakowi wersję angielską.
 *
 * `x-default` wskazuje polską wersję: to język oryginału i domena `.com`
 * bez prefiksu.
 */
export function alternatesFor(
  locale: Locale,
  paths: Localized<string | null>
): Metadata["alternates"] {
  const languages: Record<string, string> = {}
  for (const other of locales) {
    const path = paths[other]
    if (path) languages[other] = path
  }
  if (paths.pl) languages["x-default"] = paths.pl

  return {
    canonical: paths[locale] ?? undefined,
    languages,
  }
}

/** Drugi język serwisu. */
export function otherLocale(locale: Locale): Locale {
  return locale === "pl" ? "en" : "pl"
}
