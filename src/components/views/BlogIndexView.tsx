import { getAllPosts, getFeaturedPosts, slugify, type Post } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PageHeader } from "@/components/PageHeader"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  ROUTES,
  categoryPath,
  formatDate,
  formatReadingTime,
  postPath,
  type Locale,
} from "@/i18n/config"
import { fill } from "@/i18n/content/common"
import { getPages } from "@/i18n/content/pages"

const PAGE_SIZE = 12

export function BlogIndexView({
  locale,
  page,
}: {
  locale: Locale
  page?: string
}) {
  const copy = getPages(locale).blog
  const blogHref = ROUTES.blog[locale]

  const parsedPage = parseInt(page || "1", 10)
  const currentPage = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage)

  const allPosts = getAllPosts(locale)
  const featuredPosts = getFeaturedPosts(locale).slice(0, 2)
  const featuredSlugs = new Set(featuredPosts.map((p) => p.slug))

  // Wykluczamy wyróżnione artykuły ze wszystkich, aby nie wpływały na paginację
  const nonFeaturedPosts = allPosts.filter((p) => !featuredSlugs.has(p.slug))

  const totalPages = Math.ceil(nonFeaturedPosts.length / PAGE_SIZE)
  const offset = (currentPage - 1) * PAGE_SIZE
  const displayedPosts = nonFeaturedPosts.slice(offset, offset + PAGE_SIZE)

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <PageHeader
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

      {/* Featured Posts — only on first page */}
      {currentPage === 1 && featuredPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">{copy.featuredHeading}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.slice(0, 2).map((post: Post) => (
              <article key={post.slug} className="group relative">
                <div>
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
                    <Image
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      fill
                      priority
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(post.frontmatter.categories || []).map(
                        (cat: string) => (
                          <Link
                            key={cat}
                            href={categoryPath(locale, slugify(cat))}
                            className="relative z-10"
                          >
                            <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer transition-colors">
                              {cat}
                            </Badge>
                          </Link>
                        )
                      )}
                    </div>
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      <Link href={postPath(locale, post.slug)} className="after:absolute after:inset-0">
                        {post.frontmatter.title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {post.frontmatter.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {formatDate(post.frontmatter.date, locale)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatReadingTime(post.readingTime, locale)}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      <section>
        <h2 className="text-2xl font-semibold mb-8">
          {copy.allHeading}
          {totalPages > 1 && (
            <span className="ml-3 text-base font-normal text-muted-foreground">
              {fill(copy.pageOf, { current: currentPage, total: totalPages })}
            </span>
          )}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.map((post: Post, index) => (
            <article key={post.slug} className="group relative">
              <div>
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                  <Image
                    src={post.frontmatter.image}
                    alt={post.frontmatter.title}
                    fill
                    priority={currentPage === 1 && index < 3}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {(post.frontmatter.categories || [])
                      .slice(0, 2)
                      .map((cat: string) => (
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
                    <span>
                      {formatDate(post.frontmatter.date, locale)}
                    </span>
                    <span>•</span>
                    <span>{formatReadingTime(post.readingTime, locale)}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={currentPage > 1 ? `${blogHref}?page=${currentPage - 1}` : "#"}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const showPage =
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - currentPage) <= 1

                const showEllipsisAfterFirst =
                  p === 2 && currentPage > 3
                const showEllipsisBeforeLast =
                  p === totalPages - 1 && currentPage < totalPages - 2

                if (showEllipsisAfterFirst || showEllipsisBeforeLast) {
                  return (
                    <PaginationItem key={`ellipsis-${p}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }

                if (!showPage) return null

                return (
                  <PaginationItem key={p}>
                    <PaginationLink href={`${blogHref}?page=${p}`} isActive={p === currentPage}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  href={currentPage < totalPages ? `${blogHref}?page=${currentPage + 1}` : "#"}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
