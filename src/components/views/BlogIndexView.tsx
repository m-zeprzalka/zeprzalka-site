import { getAllPosts, getFeaturedPosts, slugify, type Post } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PageHeader } from "@/components/PageHeader"
import { PostListView } from "@/components/views/PostListView"
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
  blogPagePath,
  categoryPath,
  formatDate,
  formatReadingTime,
  postPath,
  type Locale,
} from "@/i18n/config"
import { fill } from "@/i18n/content/common"
import { getPages } from "@/i18n/content/pages"

const PAGE_SIZE = 12
/** Ile wyróżnionych wpisów stoi nad listą na pierwszej stronie. */
const FEATURED_COUNT = 2

/**
 * Podział wpisów na strony. Wyróżnione stoją tylko na pierwszej stronie
 * i nie są liczone do paginacji — inaczej pojawiałyby się dwa razy.
 *
 * Strony są statyczne (`/blog`, `/blog/strona/2`…), a nie sterowane
 * parametrem `?page=`: odczyt parametru wymuszał renderowanie indeksu
 * bloga przy każdym żądaniu, bez cache CDN.
 */
function paginate(locale: Locale) {
  const featured = getFeaturedPosts(locale).slice(0, FEATURED_COUNT)
  const featuredSlugs = new Set(featured.map((p) => p.slug))
  const rest = getAllPosts(locale).filter((p) => !featuredSlugs.has(p.slug))
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE))
  return { featured, rest, totalPages }
}

export function getBlogPageCount(locale: Locale): number {
  return paginate(locale).totalPages
}

export function BlogIndexView({
  locale,
  page = 1,
}: {
  locale: Locale
  page?: number
}) {
  const copy = getPages(locale).blog
  const { featured, rest, totalPages } = paginate(locale)
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const offset = (currentPage - 1) * PAGE_SIZE
  const displayedPosts = rest.slice(offset, offset + PAGE_SIZE)

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <PageHeader
        badge={copy.badge}
        title={currentPage === 1 ? copy.title : fill(copy.pageTitle, { current: currentPage })}
        description={copy.description}
      />

      {/* Wyróżnione — tylko na pierwszej stronie */}
      {currentPage === 1 && featured.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">{copy.featuredHeading}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featured.map((post: Post) => (
              <article key={post.slug} className="group relative">
                <div>
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
                    <Image
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      fill
                      preload
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {post.frontmatter.categories.map((cat) => (
                        <Link
                          key={cat}
                          href={categoryPath(locale, slugify(cat))}
                          className="relative z-10"
                        >
                          <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer transition-colors">
                            {cat}
                          </Badge>
                        </Link>
                      ))}
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

      {/* Wszystkie artykuły — ta sama karta co w kategoriach, tagach i pod wpisem */}
      <section>
        <h2 className="text-2xl font-semibold mb-8">
          {copy.allHeading}
          {totalPages > 1 && (
            <span className="ml-3 text-base font-normal text-muted-foreground">
              {fill(copy.pageOf, { current: currentPage, total: totalPages })}
            </span>
          )}
        </h2>
        <PostListView posts={displayedPosts} locale={locale} headingLevel="h3" />
      </section>

      {totalPages > 1 && (
        <div className="mt-16">
          <Pagination aria-label={copy.paginationAria}>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  label={copy.previousPage}
                  href={currentPage > 1 ? blogPagePath(locale, currentPage - 1) : "#"}
                  aria-disabled={currentPage === 1}
                  tabIndex={currentPage === 1 ? -1 : undefined}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const showPage =
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - currentPage) <= 1

                const showEllipsisAfterFirst = p === 2 && currentPage > 3
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
                    <PaginationLink
                      href={blogPagePath(locale, p)}
                      isActive={p === currentPage}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  label={copy.nextPage}
                  href={currentPage < totalPages ? blogPagePath(locale, currentPage + 1) : "#"}
                  aria-disabled={currentPage === totalPages}
                  tabIndex={currentPage === totalPages ? -1 : undefined}
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
