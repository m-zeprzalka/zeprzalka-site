import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock } from "lucide-react"
import { TermLink } from "@/components/blog/TermLink"
import { categoryPath, postPath, type Locale } from "@/i18n/config"
import { formatDate, formatReadingTime } from "@/i18n/format"
import type { Post } from "@/lib/posts"
import { slugify } from "@/lib/slug"
import { cn } from "@/lib/utils"

/**
 * Karta wpisu — jedyna w serwisie: strona główna, indeks bloga (także
 * wyróżnione), archiwum, kategorie, tagi i „Czytaj dalej” pod wpisem.
 *
 * Wariant `featured` to większa karta nad listą na pierwszej stronie bloga.
 * `headingLevel` dopasowuje poziom tytułu do miejsca w konspekcie strony:
 * pod nagłówkiem sekcji (h2) karta musi mieć h3.
 */
const VARIANTS = {
  default: {
    frame: "rounded-lg mb-4",
    image: "duration-500",
    body: "space-y-2",
    categories: { limit: 2, badge: "outline", className: "text-xs" },
    title: "line-clamp-2",
    description: "text-sm",
    meta: "gap-3 text-xs",
    icon: "w-3 h-3",
  },
  featured: {
    frame: "rounded-xl mb-6",
    image: "",
    body: "space-y-3",
    categories: { limit: undefined, badge: "secondary", className: "" },
    title: "text-2xl",
    description: "",
    meta: "gap-4 text-sm",
    icon: "w-4 h-4",
  },
} as const

export function PostCard({
  post,
  locale,
  variant = "default",
  headingLevel: Heading = "h2",
  sizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  preload = false,
}: {
  post: Post
  locale: Locale
  variant?: keyof typeof VARIANTS
  headingLevel?: "h2" | "h3"
  sizes?: string
  preload?: boolean
}) {
  const v = VARIANTS[variant]
  const { frontmatter } = post

  return (
    <article className="group relative">
      <div className={cn("relative aspect-[16/9] overflow-hidden", v.frame)}>
        <Image
          src={frontmatter.image}
          alt=""
          fill
          preload={preload}
          sizes={sizes}
          className={cn("object-cover transition-transform group-hover:scale-105", v.image)}
        />
      </div>
      <div className={v.body}>
        <ul className={cn("flex flex-wrap", variant === "featured" ? "gap-2" : "gap-1")}>
          {frontmatter.categories.slice(0, v.categories.limit).map((category) => (
            <li key={category} className="relative z-10">
              <TermLink
                href={categoryPath(locale, slugify(category))}
                variant={v.categories.badge}
                className={v.categories.className}
              >
                {category}
              </TermLink>
            </li>
          ))}
        </ul>
        <Heading className={cn("font-bold transition-colors group-hover:text-primary", v.title)}>
          <Link href={postPath(locale, post.slug)} className="after:absolute after:inset-0">
            {frontmatter.title}
          </Link>
        </Heading>
        <p className={cn("line-clamp-2 text-muted-foreground", v.description)}>
          {frontmatter.description}
        </p>
        <div className={cn("flex items-center text-muted-foreground", v.meta)}>
          <span className="flex items-center gap-1">
            <CalendarDays className={v.icon} aria-hidden="true" />
            <time dateTime={frontmatter.date}>{formatDate(frontmatter.date, locale)}</time>
          </span>
          {variant === "default" && <span aria-hidden="true">·</span>}
          <span className="flex items-center gap-1">
            <Clock className={v.icon} aria-hidden="true" />
            {formatReadingTime(post.readingMinutes, locale)}
          </span>
        </div>
      </div>
    </article>
  )
}

/**
 * Siatka kart — domyślnie 1 / 2 / 3 kolumny. `className` zastępuje siatkę
 * w całości (strona główna i wyróżnione wpisy mają własną), `sizes` musi
 * opisywać szerokość kafla w tej siatce.
 */
export function PostGrid({
  posts,
  locale,
  headingLevel,
  variant,
  sizes,
  preloadFirst = false,
  className = "grid gap-8 md:grid-cols-2 lg:grid-cols-3",
}: {
  posts: Post[]
  locale: Locale
  headingLevel?: "h2" | "h3"
  variant?: keyof typeof VARIANTS
  sizes?: string
  /** Tylko pierwsza karta bywa elementem LCP — preload dla jednej, nie dla wszystkich. */
  preloadFirst?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      {posts.map((post, index) => (
        <PostCard
          key={post.slug}
          post={post}
          locale={locale}
          headingLevel={headingLevel}
          variant={variant}
          sizes={sizes}
          preload={preloadFirst && index === 0}
        />
      ))}
    </div>
  )
}
