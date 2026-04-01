import { getAllPosts, getFeaturedPosts, type Post } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Odkryj najnowsze artykuły o AI, Next.js, web developmencie i strategiach biznesowych. Praktyczne porady od ekspertów.",
  openGraph: {
    title: "Blog | Zeprzalka.com",
    description: "Najnowsze trendy w technologii i biznesie",
    type: "website",
  },
}

const PAGE_SIZE = 12

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || "1", 10))

  const allPosts = getAllPosts()
  const featuredPosts = getFeaturedPosts()

  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE)
  const offset = (currentPage - 1) * PAGE_SIZE
  const paginatedPosts = allPosts.slice(offset, offset + PAGE_SIZE)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Blog Technologiczny
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Odkryj najnowsze trendy w AI, web developmencie i strategiach
          biznesowych
        </p>
      </div>

      {/* Featured Posts — only on first page */}
      {currentPage === 1 && featuredPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Wyróżnione artykuły</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.slice(0, 2).map((post: Post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
                    <Image
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(post.frontmatter.categories || []).map(
                        (cat: string) => (
                          <Badge key={cat} variant="secondary">
                            {cat}
                          </Badge>
                        )
                      )}
                    </div>
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {post.frontmatter.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {post.frontmatter.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(post.frontmatter.date).toLocaleDateString(
                          "pl-PL"
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readingTime}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      <section>
        <h2 className="text-2xl font-bold mb-8">
          Wszystkie artykuły
          {totalPages > 1 && (
            <span className="ml-3 text-base font-normal text-muted-foreground">
              strona {currentPage} z {totalPages}
            </span>
          )}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post: Post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`}>
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                  <Image
                    src={post.frontmatter.image}
                    alt={post.frontmatter.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {(post.frontmatter.categories || [])
                      .slice(0, 2)
                      .map((cat: string) => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                  </div>
                  <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                    {post.frontmatter.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.frontmatter.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      {new Date(post.frontmatter.date).toLocaleDateString(
                        "pl-PL"
                      )}
                    </span>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>
              </Link>
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
                  href={currentPage > 1 ? `/blog?page=${currentPage - 1}` : "#"}
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
                    <PaginationLink href={`/blog?page=${p}`} isActive={p === currentPage}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  href={currentPage < totalPages ? `/blog?page=${currentPage + 1}` : "#"}
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
