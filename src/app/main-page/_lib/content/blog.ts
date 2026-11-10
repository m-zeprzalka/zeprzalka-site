/** Dane strony archiwum bloga (`/blog`, `/blog/strona/n`). */
import "server-only"
import type { Locale } from "@/i18n/config"
import { getBlogPages, postsOnPage } from "@/lib/blog-pages"
import { cardsOf } from "./pages"
import { getSource, need } from "./source"

/** Strona archiwum bloga: wyróżnione (tylko pierwsza) i wpisy tej strony jako karty. */
export function blogPage(locale: Locale, page: number) {
  const pages = getBlogPages(locale)
  const { current, posts } = postsOnPage(pages, page)
  const descriptions = new Map(
    getSource(locale).posts.map((post) => [post.card.slug, post.description])
  )
  const featured = current === 1 ? pages.featured : []
  return {
    current,
    total: pages.totalPages,
    /** Wpisy widoczne na tej stronie (dane strukturalne). */
    visible: [...featured, ...posts],
    featured: cardsOf(locale, featured).map((card) => ({
      card,
      description: need(descriptions.get(card.slug), `opis wpisu ${card.slug}`),
    })),
    posts: cardsOf(locale, posts),
  }
}
