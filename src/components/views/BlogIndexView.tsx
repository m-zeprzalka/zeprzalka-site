import { PageHeader } from "@/components/PageHeader"
import { PostCard, PostGrid } from "@/components/blog/PostCard"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { blogPagePath, type Locale } from "@/i18n/config"
import { getPages } from "@/i18n/content/pages"
import { fill } from "@/i18n/format"
import { getBlogPages, paginationRange, postsOnPage } from "@/lib/blog-pages"

/** Indeks bloga i kolejne strony archiwum (`/blog`, `/blog/strona/2`…). */
export function BlogIndexView({ locale, page = 1 }: { locale: Locale; page?: number }) {
  const copy = getPages(locale).blog
  const pages = getBlogPages(locale)
  const { current, posts } = postsOnPage(pages, page)
  const { featured, totalPages } = pages

  return (
    <div className="page-shell">
      <PageHeader
        badge={copy.badge}
        title={current === 1 ? copy.title : fill(copy.pageTitle, { current })}
        description={copy.description}
      />

      {/* Wyróżnione — tylko na pierwszej stronie */}
      {current === 1 && featured.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">{copy.featuredHeading}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featured.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                locale={locale}
                variant="featured"
                headingLevel="h3"
                sizes="(min-width: 768px) 50vw, 100vw"
                preload
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-8">
          {copy.allHeading}
          {totalPages > 1 && (
            <span className="ml-3 text-base font-normal text-muted-foreground">
              {fill(copy.pageOf, { current, total: totalPages })}
            </span>
          )}
        </h2>
        <PostGrid posts={posts} locale={locale} headingLevel="h3" />
      </section>

      {totalPages > 1 && (
        <div className="mt-16">
          <Pagination aria-label={copy.paginationAria}>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  label={copy.previousPage}
                  href={current > 1 ? blogPagePath(locale, current - 1) : undefined}
                />
              </PaginationItem>

              {paginationRange(current, totalPages).map((item, i) => (
                <PaginationItem key={item === "ellipsis" ? `ellipsis-${i}` : item}>
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink href={blogPagePath(locale, item)} isActive={item === current}>
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  label={copy.nextPage}
                  href={current < totalPages ? blogPagePath(locale, current + 1) : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
