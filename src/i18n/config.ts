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

/** Wybiera wersję językową z pary. */
export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale]
}

/** Wartość atrybutu `lang` na `<html>`. */
export const HTML_LANG: Localized<string> = { pl: "pl", en: "en" }

/** `og:locale` — Open Graph wymaga formatu z regionem. */
export const OG_LOCALE: Localized<string> = { pl: "pl_PL", en: "en_US" }

/** Znacznik języka BCP 47 dla danych strukturalnych i kanału RSS. */
export const BCP47: Localized<string> = { pl: "pl-PL", en: "en-US" }

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
  tags: { pl: "/blog/tag", en: "/en/blog/tag" },
  feed: { pl: "/feed.xml", en: "/en/feed.xml" },
} as const satisfies Record<string, Localized<string>>

export type RouteKey = keyof typeof ROUTES

export function route(key: RouteKey, locale: Locale): string {
  return ROUTES[key][locale]
}

export function postPath(locale: Locale, slug: string): string {
  return `${ROUTES.blog[locale]}/${slug}`
}

export function categoryPath(locale: Locale, slug: string): string {
  return `${ROUTES.categories[locale]}/${slug}`
}

export function tagPath(locale: Locale, slug: string): string {
  return `${ROUTES.tags[locale]}/${slug}`
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
    if (path) languages[HTML_LANG[other]] = path
  }
  if (paths.pl) languages["x-default"] = paths.pl

  return {
    canonical: paths[locale] ?? undefined,
    languages,
  }
}

/** Ta sama strona w drugim języku — `null`, jeśli tłumaczenia nie ma. */
export function otherLocale(locale: Locale): Locale {
  return locale === "pl" ? "en" : "pl"
}

/**
 * Data w formacie czytelnym w danym języku. Polska notacja `21.10.2025`
 * zostaje bez zmian; angielska świadomie nie jest `21/10/2025`, bo ten zapis
 * czyta się inaczej po obu stronach Atlantyku.
 */
export function formatDate(value: string | Date, locale: Locale): string {
  const date = value instanceof Date ? value : new Date(value)
  if (locale === "pl") return date.toLocaleDateString("pl-PL")
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/**
 * `reading-time` zwraca zawsze angielskie „5 min read". Polska wersja
 * podmienia końcówkę; angielska zostaje bez zmian.
 */
export function formatReadingTime(text: string, locale: Locale): string {
  return locale === "pl" ? text.replace("min read", "min czytania") : text
}
