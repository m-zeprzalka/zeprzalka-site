/**
 * Adresy podstron, wpisów, kategorii, tagów i archiwum — każdy link wewnętrzny widoku
 * przechodzi przez te funkcje. Mapa ścieżek jest w `src/i18n/config.ts`, wspólna
 * z metadanymi, mapą strony i przełącznikiem języka.
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

/** Podstrony w stopce i w ⌘K — ta sama lista i kolejność. */
export const PAGE_KEYS = ["services", "portfolio", "blog", "about", "contact"] as const

export const pageHref = (key: RouteKey, locale: Locale) => ROUTES[key][locale]
export const postHref = (locale: Locale, slug: string) => postPath(locale, slug)
export const categoryHref = (locale: Locale, slug: string) => categoryPath(locale, slug)
export const tagHref = (locale: Locale, slug: string) => tagPath(locale, slug)
export const blogPageHref = (locale: Locale, page: number) => blogPagePath(locale, page)

/** Kotwica na stronie głównej — z innej podstrony prowadzi najpierw na start. */
export const homeAnchor = (locale: Locale, id: string) => `${pageHref("home", locale)}#${id}`
