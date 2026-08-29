import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock } from "lucide-react"
import { getAllPosts, slugify } from "@/lib/posts"
import {
  ROUTES,
  categoryPath,
  formatDate,
  formatReadingTime,
  postPath,
  type Locale,
} from "@/i18n/config"
import { getHome } from "@/i18n/content/home"

export function BlogPreview({ locale }: { locale: Locale }) {
  const posts = getAllPosts(locale).slice(0, 6)
  const copy = getHome(locale).blog

  return (
    <section className="container mx-auto flex flex-col justify-center p-4 py-12 md:py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-3 lg:sticky top-24 self-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium">
              {copy.title}
            </h2>
            <p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-2 lg:mt-6 max-w-xs">
              {copy.lead}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-6">
              <Link href={ROUTES.blog[locale]}>{copy.cta}</Link>
            </Button>
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="grid gap-8 sm:grid-cols-2">
            {posts.map((post, index) => (
              <article key={post.slug} className="group relative">
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                  {post.frontmatter.image && (
                    <Image
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      fill
                      priority={index < 2}
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {(post.frontmatter.categories || []).slice(0, 2).map((cat) => (
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
                  <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={postPath(locale, post.slug)} className="after:absolute after:inset-0">
                      {post.frontmatter.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.frontmatter.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {formatDate(post.frontmatter.date, locale)}
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatReadingTime(post.readingTime, locale)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
