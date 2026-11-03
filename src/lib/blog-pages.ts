import type { Locale } from "@/i18n/config"
import { getAllPosts, type Post } from "@/lib/posts"

const POSTS_PER_PAGE = 12
/** Ile wyróżnionych wpisów stoi nad listą na pierwszej stronie. */
const FEATURED_COUNT = 2

export interface BlogPages {
  featured: Post[]
  rest: Post[]
  totalPages: number
}

/**
 * Podział wpisów na strony archiwum. Wyróżnione stoją tylko na pierwszej
 * stronie i nie są liczone do paginacji — inaczej pojawiałyby się dwa razy.
 *
 * Strony są statyczne (`/blog`, `/blog/strona/2`…), a nie sterowane
 * parametrem `?page=`: odczyt parametru wymuszał renderowanie indeksu bloga
 * przy każdym żądaniu, bez cache CDN.
 */
export function getBlogPages(locale: Locale): BlogPages {
  const posts = getAllPosts(locale)
  const featured = posts.filter((post) => post.frontmatter.featured).slice(0, FEATURED_COUNT)
  const rest = posts.filter((post) => !featured.includes(post))
  return { featured, rest, totalPages: Math.max(1, Math.ceil(rest.length / POSTS_PER_PAGE)) }
}

export function getBlogPageCount(locale: Locale): number {
  return getBlogPages(locale).totalPages
}

/** Wpisy n-tej strony (strona spoza zakresu dostaje najbliższą istniejącą). */
export function postsOnPage(pages: BlogPages, page: number): { current: number; posts: Post[] } {
  const current = Math.min(Math.max(1, page), pages.totalPages)
  const offset = (current - 1) * POSTS_PER_PAGE
  return { current, posts: pages.rest.slice(offset, offset + POSTS_PER_PAGE) }
}

/**
 * Numery w paginacji: zawsze pierwsza, ostatnia i sąsiedzi bieżącej strony,
 * a w lukach wielokropek — `[1, "…", 4, 5, 6, "…", 9]`.
 */
export function paginationRange(current: number, total: number): (number | "ellipsis")[] {
  const range: (number | "ellipsis")[] = []
  for (let page = 1; page <= total; page++) {
    const gapAfterFirst = page === 2 && current > 3
    const gapBeforeLast = page === total - 1 && current < total - 2
    if (gapAfterFirst || gapBeforeLast) range.push("ellipsis")
    else if (page === 1 || page === total || Math.abs(page - current) <= 1) range.push(page)
  }
  return range
}
