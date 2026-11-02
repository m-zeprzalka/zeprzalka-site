/**
 * Budowanie metadanych dla obu wersji językowych.
 *
 * Układy główne wołają `rootMetadata(locale)`; metadane podstron buduje
 * `buildMetadata` w `src/i18n/page-metadata.ts`, więc `hreflang`, RSS
 * i karta Open Graph nie mogą wypaść z żadnej strony przez przeoczenie.
 */
import type { Metadata } from "next"
import { OG_LOCALE, ROUTES, otherLocale, type Locale } from "@/i18n/config"
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
      // Duże podglądy obrazów i pełne fragmenty — warunek wejścia do Google
      // Discover i większych kart w wynikach.
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
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
