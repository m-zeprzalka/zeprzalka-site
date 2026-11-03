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
import { getBlogPages, postsOnPage } from "@/lib/blog-pages"
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
 * `lastmod` musi być prawdziwy, bo Google ufa mu tylko wtedy, gdy jest
 * „konsekwentnie i sprawdzalnie dokładny” — dlatego `latestUpdate` z wpisów
 * danej strony, a dla stron bez wpisów brak daty zamiast daty builda.
 */
const lastModified = latestUpdate

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
    const entry = (paths: LocalizedPaths, modified?: Date): MetadataRoute.Sitemap[number] => ({
      url: absoluteUrl(paths[locale] ?? ROUTES.home[locale]),
      lastModified: modified,
      alternates: { languages: hreflangMap(paths, absoluteUrl) },
    })

    return [
      ...STATIC_PAGES.map((key) =>
        entry(ROUTES[key], POST_DRIVEN.has(key) ? lastModified(posts) : undefined)
      ),
      ...Array.from({ length: pageCounts[locale] - 1 }, (_, i) =>
        entry(
          archivePaths(i + 2, pageCounts),
          lastModified(postsOnPage(pages[locale], i + 2).posts)
        )
      ),
      ...posts.map((post) => entry(postPaths(locale, post.slug), lastModified([post]))),
      // Kategorie z jednym wpisem mają noindex — mapa nie wskazuje adresów spoza indeksu.
      ...getTerms(locale, "categories")
        .filter((term) => term.posts.length >= MIN_POSTS_TO_INDEX_CATEGORY)
        .map((term) => entry(categoryPaths(locale, term.slug), lastModified(term.posts))),
    ]
  })
}
