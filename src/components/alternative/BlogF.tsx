// [project]/src/components/alternative/BlogC.tsx

import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllPosts } from "@/lib/posts"

export function BlogF() {
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
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-lg"
              >
                {/* Obraz w tle - teraz z subtelniejszym zoomem i efektem paralaksy */}
                <Image
                  src={post.frontmatter.image}
                  alt={post.frontmatter.title}
                  fill
                  className="z-0 object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Gradient na dole - zapewnia lepszą czytelność tekstu w stanie spoczynku */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

                {/* Kontener na treść "unoszący się" nad obrazkiem */}
                <div className="relative z-20 flex h-full flex-col justify-end p-5 text-white transition-transform duration-500 ease-out group-hover:-translate-y-2">
                  {/* Tagi */}
                  <div className="mb-2 flex flex-wrap gap-2">
                    {(post.frontmatter.tags || []).map((tag) => (
                      <Badge
                        key={tag}
                        className="border-white/25 bg-white/15 text-xs font-medium text-white backdrop-blur-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Tytuł */}
                  <h3 className="text-xl font-bold leading-tight tracking-tight text-balance md:text-2xl">
                    {post.frontmatter.title}
                  </h3>

                  {/* Metadane i Ukryty opis - kontener, który razem się wysuwa */}
                  <div className="h-0 transform opacity-0 transition-all duration-500 ease-out group-hover:mt-3 group-hover:h-auto group-hover:opacity-100">
                    <p className="text-sm text-white/90 text-balance">
                      {post.frontmatter.excerpt ||
                        "Odkryj kluczowe strategie i techniki, które zdefiniują przyszłość developmentu."}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-white/70">
                      <span>
                        {new Date(post.frontmatter.date).toLocaleDateString(
                          "pl-PL"
                        )}
                      </span>
                      <span className="mx-2">&middot;</span>
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </section>
  )
}
