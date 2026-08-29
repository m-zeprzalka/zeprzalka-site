import { getAllPosts } from "@/lib/posts"
import { SITE_URL, absoluteUrl } from "@/lib/site"
import { BCP47, ROUTES, postPath, type Locale } from "@/i18n/config"
import { getMeta } from "@/i18n/content/meta"

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

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
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${absoluteUrl(postPath(locale, post.slug))}</link>
      <guid isPermaLink="true">${absoluteUrl(postPath(locale, post.slug))}</guid>
      <description>${escapeXml(post.frontmatter.description)}</description>
      <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(m.root.feedTitle)}</title>
    <link>${absoluteUrl(ROUTES.blog[locale])}</link>
    <description>${escapeXml(m.blog.feedDescription)}</description>
    <language>${BCP47[locale]}</language>
    <atom:link href="${SITE_URL}${ROUTES.feed[locale]}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}

export const FEED_HEADERS = {
  "Content-Type": "application/rss+xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
}
