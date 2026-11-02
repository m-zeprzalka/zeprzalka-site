import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { slugify, type Post } from "@/lib/posts"
import {
  categoryPath,
  formatDate,
  formatReadingTime,
  postPath,
  type Locale,
} from "@/i18n/config"

/**
 * Siatka wpisów: indeks bloga, kolejne strony archiwum, kategorie, tagi
 * i „Czytaj dalej" pod wpisem. Wcześniej ta sama karta była przepisana
 * w trzech miejscach, z trzema różnymi wierszami metadanych.
 *
 * `headingLevel` dopasowuje poziom tytułu karty do miejsca na stronie —
 * pod nagłówkiem sekcji (h2) karta musi mieć h3, inaczej konspekt dokumentu
 * się spłaszcza.
 */
export function PostListView({
  posts,
  locale,
  headingLevel: Heading = "h2",
}: {
  posts: Post[]
  locale: Locale
  headingLevel?: "h2" | "h3"
}) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article key={post.slug} className="group relative">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
            <Image
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {post.frontmatter.categories.slice(0, 2).map((cat) => (
                <Link
                  key={cat}
                  href={categoryPath(locale, slugify(cat))}
                  className="relative z-10"
                >
                  <Badge variant="outline" className="text-xs hover:bg-secondary/80 cursor-pointer transition-colors">
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>
            <Heading className="font-bold group-hover:text-primary transition-colors line-clamp-2">
              <Link href={postPath(locale, post.slug)} className="after:absolute after:inset-0">
                {post.frontmatter.title}
              </Link>
            </Heading>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.frontmatter.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {formatDate(post.frontmatter.date, locale)}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatReadingTime(post.readingTime, locale)}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
