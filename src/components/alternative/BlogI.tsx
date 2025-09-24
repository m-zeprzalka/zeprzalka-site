// [project]/src/components/alternative/BlogC.tsx

import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllPosts } from "@/lib/posts"

export function BlogI() {
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
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative block"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="relative h-[520px] overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/25">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      fill
                      className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-30" />
                  </div>

                  {/* Floating Glass Elements */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="h-16 w-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 group-hover:bg-white/10 group-hover:rotate-12">
                      <div className="flex h-full items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white/60"></div>
                      </div>
                    </div>
                  </div>

                  {/* Main Glass Container */}
                  <div className="absolute inset-x-4 bottom-4 z-20">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-2xl transition-all duration-500 group-hover:bg-white/15 group-hover:border-white/30">
                      {/* Tags with floating effect */}
                      {post.frontmatter.tags &&
                        post.frontmatter.tags.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {post.frontmatter.tags
                              .slice(0, 3)
                              .map((tag, tagIndex) => (
                                <Badge
                                  key={tag}
                                  className="border-white/30 bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
                                  style={{
                                    animationDelay: `${
                                      index * 100 + tagIndex * 50
                                    }ms`,
                                    transform: `translateY(${
                                      Math.sin(tagIndex) * 2
                                    }px)`,
                                  }}
                                >
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                        )}

                      {/* Title with text effects */}
                      <h3 className="mb-3 text-2xl font-bold leading-tight text-white transition-all duration-300 group-hover:text-primary-foreground md:text-3xl">
                        {post.frontmatter.title}
                      </h3>

                      {/* Excerpt with reveal animation */}
                      {post.frontmatter.excerpt && (
                        <p className="mb-4 text-sm leading-relaxed text-white/80 transition-all duration-500 group-hover:text-white/90 line-clamp-2">
                          {post.frontmatter.excerpt}
                        </p>
                      )}

                      {/* Animated divider */}
                      <div className="relative mb-4 h-px overflow-hidden bg-white/20">
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
                      </div>

                      {/* Meta with icons and hover effects */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-white/70">
                          <div className="flex items-center space-x-1 transition-colors duration-300 group-hover:text-white/90">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                              />
                            </svg>
                            <time dateTime={post.frontmatter.date}>
                              {new Date(
                                post.frontmatter.date
                              ).toLocaleDateString("pl-PL", {
                                day: "numeric",
                                month: "short",
                              })}
                            </time>
                          </div>
                          <div className="flex items-center space-x-1 transition-colors duration-300 group-hover:text-white/90">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{post.readingTime}</span>
                          </div>
                        </div>

                        {/* Floating CTA arrow */}
                        <div className="rounded-full border border-white/30 bg-white/10 p-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110 group-hover:rotate-45">
                          <svg
                            className="h-4 w-4 text-white transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 17L17 7M17 7H7M17 7v10"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtle animated border */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="shimmer-effect absolute inset-0 rounded-3xl"></div>
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
