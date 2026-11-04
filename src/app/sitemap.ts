import type { MetadataRoute } from "next"
import {
  archivePaths,
  categoryPaths,
  hreflangMap,
  mapLocales,
  postPaths,
  type LocalizedPaths,
} from "@/i18n/alternates"
import { ROUTES, locales, type RouteKey } from "@/i18n/config"
import { MIN_POSTS_TO_INDEX_CATEGORY } from "@/i18n/page-metadata"
import { getBlogPages } from "@/lib/blog-pages"
import { getAllPosts, getTerms, latestUpdate } from "@/lib/posts"
import { absoluteUrl } from "@/lib/site"

/** Strony stałe w mapie. Tagi celowo poza nią (i z noindex) — robot dociera do nich linkami. */
const STATIC_PAGES: readonly RouteKey[] = [
  "home",
  "blog",
  "services",
  "portfolio",
  "about",
  "contact",
  "privacy",
  "categories",
]

/** Strony, których treść zmienia się razem z wpisami (listy, zajawki). */
const POST_DRIVEN: ReadonlySet<RouteKey> = new Set(["home", "blog", "categories"])

/**
 * Mapa strony obejmuje obie wersje językowe. Każdy adres niesie te same pary
 * co znaczniki `hreflang` w nagłówku (`src/i18n/alternates.ts`). Bez
 * `priority` i `changefreq` — Google i Bing je pomijają.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = mapLocales(getBlogPages)
  const pageCounts = mapLocales((locale) => pages[locale].totalPages)

  return locales.flatMap((locale) => {
    const posts = getAllPosts(locale)
    const entry = (paths: LocalizedPaths, modified?: Date): MetadataRoute.Sitemap[number] => {
      const path = paths[locale]
      // Każda strona ma adres we własnym języku — brak to błąd danych, nie powód do zgadywania.
      if (!path) throw new Error(`sitemap: brak adresu „${locale}” dla ${JSON.stringify(paths)}`)
      return {
        url: absoluteUrl(path),
        lastModified: modified,
        alternates: { languages: hreflangMap(paths, absoluteUrl) },
      }
    }

    // `lastmod` musi być prawdziwy — Google ufa mu tylko wtedy, gdy jest „konsekwentnie
    // i sprawdzalnie dokładny”. Strony bez wpisów: brak daty zamiast daty builda.
    // Archiwum: data najnowszego wpisu, bo każdy nowy wpis przesuwa wszystkie strony listy.
    const newest = latestUpdate(posts)

    return [
      ...STATIC_PAGES.map((key) => entry(ROUTES[key], POST_DRIVEN.has(key) ? newest : undefined)),
      ...Array.from({ length: pageCounts[locale] - 1 }, (_, i) =>
        entry(archivePaths(i + 2, pageCounts), newest)
      ),
      ...posts.map((post) => entry(postPaths(locale, post.slug), latestUpdate([post]))),
      // Kategorie z jednym wpisem mają noindex — mapa nie wskazuje adresów spoza indeksu.
      ...getTerms(locale, "categories")
        .filter((term) => term.posts.length >= MIN_POSTS_TO_INDEX_CATEGORY)
        .map((term) => entry(categoryPaths(locale, term.slug), latestUpdate(term.posts))),
    ]
  })
}
