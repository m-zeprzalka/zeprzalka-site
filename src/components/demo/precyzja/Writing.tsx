import Link from "next/link"
import { postPath, type Locale } from "@/i18n/config"
import { formatDate, formatReadingTime } from "@/i18n/format"
import type { Post } from "@/lib/posts"

/** Rejestr wpisów: data, tytuł, kategoria, czas lektury — dane w mono, tytuł w Geist. */
export function Writing({ posts, locale }: { posts: readonly Post[]; locale: Locale }) {
  return (
    <ol className="pz-log">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={postPath(locale, post.slug)} className="pz-log__row">
            <time dateTime={post.frontmatter.date} className="pz-mono pz-log__date">
              {formatDate(post.frontmatter.date, locale)}
            </time>
            <span className="pz-log__title">{post.frontmatter.title}</span>
            <span className="pz-log__meta">{post.frontmatter.categories[0]}</span>
            <span className="pz-mono pz-log__meta">
              {formatReadingTime(post.readingMinutes, locale)}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
