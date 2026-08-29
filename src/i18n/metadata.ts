/**
 * Budowanie metadanych dla obu wersji językowych.
 *
 * Cała różnica między polską a angielską wersją nagłówka dokumentu siedzi
 * tutaj — układy główne tylko wołają `rootMetadata(locale)`, a podstrony
 * `pageAlternates(...)`. Dzięki temu `hreflang` nie może wypaść z żadnej
 * strony przez przeoczenie w JSX-ie.
 */
import type { Metadata } from "next"
import {
  OG_LOCALE,
  ROUTES,
  alternatesFor,
  locales,
  otherLocale,
  type Locale,
  type Localized,
  type RouteKey,
} from "@/i18n/config"
import { getMeta } from "@/i18n/content/meta"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site"

export function rootMetadata(locale: Locale): Metadata {
  const m = getMeta(locale)

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: m.root.titleDefault,
      template: m.root.titleTemplate,
    },
    description: SITE_DESCRIPTION[locale],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: OG_LOCALE[otherLocale(locale)],
      url: absoluteUrl(ROUTES.home[locale]),
      title: m.root.titleDefault,
      description: m.root.ogDescription,
      siteName: m.root.siteName,
    },
    robots: {
      index: true,
      follow: true,
    },
    twitter: {
      card: "summary_large_image",
      title: m.root.titleDefault,
      description: m.root.ogDescription,
    },
    // Potwierdzenie własności domeny w Google Search Console i Bing.
    // Tokeny są danymi wdrożeniowymi, nie kodem — wystarczy ustawić zmienne.
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      other: process.env.BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
        : undefined,
    },
    alternates: {
      types: {
        "application/rss+xml": [
          { url: ROUTES.feed[locale], title: m.root.feedTitle },
        ],
      },
    },
  }
}

/** `canonical` + `hreflang` dla strony, która istnieje w obu językach. */
export function pageAlternates(locale: Locale, key: RouteKey) {
  return alternatesFor(locale, ROUTES[key])
}

/**
 * To samo dla adresów budowanych z segmentu (wpis, kategoria, tag).
 * `null` po jednej stronie oznacza brak tłumaczenia — wtedy `hreflang`
 * dla tego języka po prostu nie powstaje.
 */
export function dynamicAlternates(
  locale: Locale,
  paths: Localized<string | null>
) {
  return alternatesFor(locale, paths)
}

/** Skrót do budowania pary ścieżek przez funkcję na slugu. */
export function pathsBySlug(
  slugs: Localized<string | null>,
  build: (locale: Locale, slug: string) => string
): Localized<string | null> {
  const result = {} as Record<Locale, string | null>
  for (const locale of locales) {
    const slug = slugs[locale]
    result[locale] = slug ? build(locale, slug) : null
  }
  return result
}
