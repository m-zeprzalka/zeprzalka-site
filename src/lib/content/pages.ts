/** Wspólne dane podstron: okruszki, karty wpisów i linki kategorii oraz tagów. */
import "server-only"
import { INTL_LOCALE, type Locale } from "@/i18n/config"
import { formatDate } from "@/i18n/format"
import { slugify } from "@/lib/slug"
import { getTerms, type Post as SourcePost, type TaxonomyField } from "@/lib/posts"
import { categoryHref, pageHref, tagHref } from "../routes"
import type { LinkData, Post } from "../types"
import { need, getSource } from "./source"

/** Okruszki nagłówka podstrony: zawsze od strony głównej, potem `trail`, na końcu ona sama. */
export function breadcrumb(locale: Locale, current: string, trail: readonly LinkData[] = []) {
  const { common, pages } = getSource(locale)
  return {
    label: pages.blog.breadcrumbAria,
    trail: [{ label: common.nav.home, href: pageHref("home", locale) }, ...trail],
    current,
  }
}

/** Wpisy z `src/lib/posts` jako karty widoku (ta sama postać co na starcie). */
export function cardsOf(locale: Locale, posts: readonly SourcePost[]): Post[] {
  const cards = new Map(getSource(locale).posts.map(({ card }) => [card.slug, card]))
  return posts.map((post) => need(cards.get(post.slug), `wpis ${post.slug}`))
}

/** Kategorie od najliczniejszej (przy remisie — kolejność pierwszego wystąpienia). */
export function categoryLinks(locale: Locale): (LinkData & { count: number })[] {
  return getTerms(locale, "categories")
    .sort((a, b) => b.posts.length - a.posts.length)
    .map((term) => ({
      label: term.label,
      href: categoryHref(locale, term.slug),
      count: term.posts.length,
    }))
}

/** Kategorie albo tagi wpisu jako linki. */
export function termLinks(
  locale: Locale,
  field: TaxonomyField,
  labels: readonly string[]
): LinkData[] {
  const href = field === "categories" ? categoryHref : tagHref
  return labels.map((label) => ({
    label: field === "tags" ? `#${label}` : label,
    href: href(locale, slugify(label)),
  }))
}

/**
 * Pełna data wpisu w tym samym zapisie co dzień i miesiąc na listach: polska „02.11.2026”,
 * angielska „2 Nov 2026” (`formatDate` — „02/11/2026” czyta się inaczej po obu stronach Atlantyku).
 */
export function postDate(locale: Locale, iso: string): string {
  if (locale !== "pl") return formatDate(iso, locale)
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso))
}
