// [project]/src/components/alternative/BlogC.tsx

import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllPosts } from "@/lib/posts"

export function BlogH() {
  const posts = getAllPosts()
  return (
    <section className="container mx-auto flex flex-col justify-center p-4 py-12 md:py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-3 lg:sticky top-24 self-start">
          <div>
            <h2 className="text-3xl md:text-4xl md:font-semi-bold font-medium">
              Blog
            </h2>
            <p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-2 lg:mt-6 max-w-xs">
              Myśli, analizy i projekty ze świata nowoczesnego developmentu.
            </p>
          </div>
        </aside>

        <main className="lg:col-span-9">
          <div className="grid gap-8 leading-relaxed md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <Card className="overflow-hidden border border-border/50 bg-card transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 hover:-translate-y-2">
                  {/* Zdjęcie */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Subtelny gradient tylko na dole dla lepszej czytelności */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Treść */}
                  <div className="p-6 space-y-4">
                    {/* Tagi */}
                    {post.frontmatter.tags &&
                      post.frontmatter.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.frontmatter.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs px-2 py-1 border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                    {/* Tytuł */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {post.frontmatter.title}
                      </h3>

                      {/* Excerpt jeśli dostępny */}
                      {post.frontmatter.excerpt && (
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                          {post.frontmatter.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Separator line */}
                    <div className="w-12 h-px bg-primary/20 transition-all duration-300 group-hover:w-20 group-hover:bg-primary/40" />

                    {/* Metadane */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <time
                        dateTime={post.frontmatter.date}
                        className="flex items-center gap-1"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(post.frontmatter.date).toLocaleDateString(
                          "pl-PL",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </time>

                      <div className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </section>
  )
}
