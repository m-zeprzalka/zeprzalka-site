/**
 * Adresy nowej wersji. Podgląd żyje pod `/main-page`, więc każdy link wewnętrzny
 * przechodzi przez `withBase`. Przy przepięciu `BASE` staje się pustym napisem —
 * to jedyna zmiana adresów w całym `main-page` (mapa ścieżek pozostaje w
 * `src/i18n/config.ts`, wspólna z serwisem, metadanymi i mapą strony).
 *
 * Moduł bez `server-only` — wolno go użyć także w komponencie klienckim.
 */
import {
  ROUTES,
  blogPagePath,
  categoryPath,
  postPath,
  tagPath,
  type Locale,
  type RouteKey,
} from "@/i18n/config"

export const BASE = "/main-page"

/** Podstrony w stopce i w ⌘K — ta sama lista i kolejność. */
export const PAGE_KEYS = ["services", "portfolio", "blog", "about", "contact"] as const

export function withBase(path: string): string {
  return path === "/" ? BASE : `${BASE}${path}`
}

export const pageHref = (key: RouteKey, locale: Locale) => withBase(ROUTES[key][locale])
export const postHref = (locale: Locale, slug: string) => withBase(postPath(locale, slug))
export const categoryHref = (locale: Locale, slug: string) => withBase(categoryPath(locale, slug))
export const tagHref = (locale: Locale, slug: string) => withBase(tagPath(locale, slug))
export const blogPageHref = (locale: Locale, page: number) => withBase(blogPagePath(locale, page))

/** Kotwica na stronie głównej — z innej podstrony prowadzi najpierw na start. */
export const homeAnchor = (locale: Locale, id: string) => `${pageHref("home", locale)}#${id}`
