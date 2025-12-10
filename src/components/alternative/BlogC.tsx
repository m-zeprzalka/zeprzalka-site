// [project]/src/components/alternative/BlogB.tsx

import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllPosts } from "@/lib/posts"

export function BlogC() {
  const posts = getAllPosts().slice(0, 6)
  return (
    <section className="container mx-auto flex flex-col justify-center p-4 py-12 md:py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-3 lg:sticky top-24 self-start">
          <div>
            <h2 className="text-3xl md:text-4xl md:font-semi-bold font-medium">
              Blog
            </h2>
            <p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-2 lg:mt-6 max-w-xs">
              Myśli, analizy oraz moje projekty z pogranicza technologii i AI
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
                <Card className="relative h-[450px] overflow-hidden rounded-xl border-2 border-transparent transition-all duration-500 ease-in-out hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20">
                  {/* Tło z obrazkiem i efektem zoomu */}
                  <Image
                    src={post.frontmatter.image}
                    alt={post.frontmatter.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Gradient dla czytelności tekstu */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  {/* Kontener na treść */}
                  <div className="relative flex h-full flex-col justify-end px-4 md:px-6 text-white">
                    <div className="flex-grow"></div>
                    {/* Tagi z efektem "Glassmorphism" */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {(post.frontmatter.tags || []).map((tag) => (
                        <Badge
                          key={tag}
                          className="border-white/20 bg-white/10 py-1 px-3 text-xs font-normal text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {/* Tytuł */}
                    <h3 className="text-2xl font-bold leading-tight tracking-tight transition-colors duration-300">
                      {post.frontmatter.title}
                    </h3>
                    {/* Metadane */}
                    <div className="mt-4 flex items-center text-sm text-white/70">
                      <span>
                        {new Date(post.frontmatter.date).toLocaleDateString(
                          "pl-PL"
                        )}
                      </span>
                      <span className="mx-2">&middot;</span>
                      <span>{post.readingTime}</span>
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
