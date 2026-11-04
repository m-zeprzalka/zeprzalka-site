import "server-only"
import { escapeMarkup } from "@/lib/escape"
import { getAllPosts, latestUpdate } from "@/lib/posts"
import { AUTHOR, absoluteUrl } from "@/lib/site"
import { FEEDS, INTL_LOCALE, ROUTES, postPath, type Locale } from "@/i18n/config"
import { getMeta } from "@/i18n/content/meta"

/**
 * Kanał RSS dla jednej wersji językowej. Każda ma własny adres
 * (`/feed.xml` i `/en/feed.xml`) i własny znacznik `<language>` — czytnik
 * nie powinien mieszać w jednej liście dwóch języków tego samego tekstu.
 */
export function buildFeed(locale: Locale): string {
  const posts = getAllPosts(locale)
  const m = getMeta(locale)

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeMarkup(post.frontmatter.title)}</title>
      <link>${absoluteUrl(postPath(locale, post.slug))}</link>
      <guid isPermaLink="true">${absoluteUrl(postPath(locale, post.slug))}</guid>
      <description>${escapeMarkup(post.frontmatter.description)}</description>
      <dc:creator>${escapeMarkup(AUTHOR.name)}</dc:creator>
${post.frontmatter.categories.map((c) => `      <category>${escapeMarkup(c)}</category>`).join("\n")}
      <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeMarkup(m.root.feedTitle)}</title>
    <link>${absoluteUrl(ROUTES.blog[locale])}</link>
    <description>${escapeMarkup(m.blog.feedDescription)}</description>
    <language>${INTL_LOCALE[locale]}</language>
    <lastBuildDate>${(latestUpdate(posts) ?? new Date()).toUTCString()}</lastBuildDate>
    <image>
      <url>${absoluteUrl("/icon.png")}</url>
      <title>${escapeMarkup(m.root.feedTitle)}</title>
      <link>${absoluteUrl(ROUTES.blog[locale])}</link>
    </image>
    <atom:link href="${absoluteUrl(FEEDS[locale])}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}

export const FEED_HEADERS = {
  "Content-Type": "application/rss+xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
}
