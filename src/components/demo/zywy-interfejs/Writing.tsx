import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { postPath, type Locale } from "@/i18n/config"
import { formatDate, formatReadingTime } from "@/i18n/format"
import type { Post } from "@/lib/posts"

/**
 * Najnowsze wpisy jako lista: data, tytuł, kategoria, czas lektury. Cały
 * wiersz jest celem (link rozciągnięty), strzałka wjeżdża przy wskazaniu.
 */
export function Writing({ posts, locale }: { posts: Post[]; locale: Locale }) {
  return (
    <ul className="overflow-hidden rounded-fm-3xl bg-fm-surface p-1.5 shadow-fm-card">
      {posts.map((post) => (
        <li key={post.slug} className="group relative">
          <article className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 rounded-[18px] px-4 py-4 transition-colors duration-150 group-hover:bg-fm-fill md:grid-cols-[7.5rem_1fr_auto] md:px-5 md:py-5">
            <time
              dateTime={post.frontmatter.date}
              className="col-span-2 text-fm-micro text-fm-ink-3 tabular-nums md:col-span-1 md:text-fm-small"
            >
              {formatDate(post.frontmatter.date, locale)}
            </time>
            <h3 className="min-w-0 text-[0.9375rem] font-medium tracking-tight text-pretty md:text-base">
              <Link
                href={postPath(locale, post.slug)}
                className="rounded-sm fm-focus after:absolute after:inset-0"
              >
                {post.frontmatter.title}
              </Link>
            </h3>
            <span className="flex items-center gap-3 text-fm-micro text-fm-ink-3">
              <span className="hidden sm:inline">{post.frontmatter.categories[0]}</span>
              <span className="hidden tabular-nums lg:inline">
                {formatReadingTime(post.readingMinutes, locale)}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 -translate-x-1 text-fm-ink opacity-0 transition-[opacity,translate] duration-200 ease-fm-snap group-hover:translate-x-0 group-hover:opacity-100"
              />
            </span>
          </article>
        </li>
      ))}
    </ul>
  )
}
