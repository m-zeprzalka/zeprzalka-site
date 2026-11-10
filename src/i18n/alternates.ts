/**
 * „Ta sama strona w drugim języku” — jedno źródło dla znaczników `hreflang`
 * (metadane), mapy strony i przełącznika języka. Moduł to czyste dane i
 * funkcje (bez `fs`), więc korzysta z niego także komponent kliencki.
 */
import {
  DEFAULT_LOCALE,
  PATH_BASES,
  ROUTES,
  blogPagePath,
  categoryPath,
  locales,
  postPath,
  tagPath,
  type Locale,
  type Localized,
} from "@/i18n/config"
import { translateCategorySlug, translatePostSlug, translateTagSlug } from "@/i18n/blog-map"

/** Para ścieżek; `null` — w tym języku strony nie ma. */
export type LocalizedPaths = Localized<string | null>

/** Ta sama funkcja dla każdego języka serwisu. */
export function mapLocales<T>(fn: (locale: Locale) => T): Localized<T> {
  return Object.fromEntries(locales.map((locale) => [locale, fn(locale)])) as Record<Locale, T>
}

/**
 * Mapa `hreflang` → adres. `x-default` wskazuje wersję polską: to język
 * oryginału i domena bez prefiksu. `toUrl` zamienia ścieżkę na pełny adres
 * (mapa strony); metadane zostawiają ścieżki, bo Next dokleja `metadataBase`.
 */
export function hreflangMap(
  paths: LocalizedPaths,
  toUrl: (path: string) => string = (path) => path
): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    const path = paths[locale]
    if (path) languages[locale] = toUrl(path)
  }
  const fallback = paths[DEFAULT_LOCALE]
  if (fallback) languages["x-default"] = toUrl(fallback)
  return languages
}

type Translate = (slug: string, from: Locale, to: Locale) => string | null

function slugPaths(
  locale: Locale,
  slug: string,
  translate: Translate,
  build: (locale: Locale, slug: string) => string
): LocalizedPaths {
  return mapLocales((other) => {
    if (other === locale) return build(locale, slug)
    const translated = translate(slug, locale, other)
    return translated ? build(other, translated) : null
  })
}

export const postPaths = (locale: Locale, slug: string) =>
  slugPaths(locale, slug, translatePostSlug, postPath)

export const categoryPaths = (locale: Locale, slug: string) =>
  slugPaths(locale, slug, translateCategorySlug, categoryPath)

export const tagPaths = (locale: Locale, slug: string) =>
  slugPaths(locale, slug, translateTagSlug, tagPath)

/** Strona archiwum istnieje w drugim języku tylko wtedy, gdy ten ma tyle stron. */
export const archivePaths = (page: number, pageCounts: Localized<number>) =>
  mapLocales((other) => (page <= pageCounts[other] ? blogPagePath(other, page) : null))

/**
 * Odpowiednik bieżącego adresu w drugim języku (przełącznik języka — liczony z adresu,
 * więc link jest dobry już w HTML z serwera, przed hydratacją i bez JS).
 * Gdy go nie ma — najbliższa sensowna strona: indeks bloga albo strona główna.
 */
export function counterpart(
  pathname: string,
  from: Locale,
  to: Locale,
  pageCounts: Localized<number>
): string {
  const clean = pathname.replace(/\/$/, "") || "/"

  for (const paths of Object.values(ROUTES)) {
    if (paths[from] === clean) return paths[to]
  }

  const rest = (base: string) =>
    clean.startsWith(`${base}/`) ? clean.slice(base.length + 1) : null
  const orBlog = (paths: LocalizedPaths) => paths[to] ?? ROUTES.blog[to]

  const page = rest(PATH_BASES.blogPage[from])
  if (page) return orBlog(archivePaths(Number(page), pageCounts))

  const category = rest(ROUTES.categories[from])
  if (category) return orBlog(categoryPaths(from, category))

  const tag = rest(PATH_BASES.tags[from])
  if (tag) return orBlog(tagPaths(from, tag))

  const post = rest(ROUTES.blog[from])
  if (post) return orBlog(postPaths(from, post))

  return ROUTES.home[to]
}
