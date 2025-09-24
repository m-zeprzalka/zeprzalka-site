// [project]/src/components/alternative/BlogC.tsx

import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllPosts } from "@/lib/posts"

export function BlogG() {
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
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl"
              >
                {/* Obraz w tle - subtelny zoom i delikatne przyciemnienie dla kontrastu */}
                <Image
                  src={post.frontmatter.image}
                  alt={post.frontmatter.title}
                  fill
                  className="z-0 object-cover transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Kontener "Glassmorphism" */}
                <div
                  className="absolute bottom-4 left-4 right-4 z-20 overflow-hidden rounded-xl border border-white/10 p-5 shadow-lg transition-all duration-500 ease-in-out 
                               before:absolute before:inset-0 before:-z-10 before:bg-gray-900/40 before:backdrop-blur-lg group-hover:border-white/20"
                >
                  {/* Kontener na treść, który "robi miejsce" na dodatkowe informacje */}
                  <div className="transition-all duration-500 ease-in-out group-hover:-translate-y-1">
                    {/* Tagi */}
                    <div className="mb-2 flex flex-wrap gap-2">
                      {(post.frontmatter.tags || []).map((tag) => (
                        <Badge
                          key={tag}
                          className="border-white/20 bg-white/10 text-xs font-medium text-white"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Tytuł */}
                    <h3 className="text-xl font-bold leading-tight tracking-tight text-balance text-white md:text-2xl">
                      {post.frontmatter.title}
                    </h3>
                  </div>

                  {/* Kontener z opisem i metadanymi - wsuwa się od dołu */}
                  <div className="absolute -bottom-full left-0 w-full p-5 pt-2 opacity-0 transition-all duration-500 ease-in-out group-hover:bottom-0 group-hover:opacity-100">
                    <p className="mb-3 text-sm text-white/90 text-balance">
                      {post.frontmatter.excerpt ||
                        "Odkryj kluczowe strategie i techniki, które zdefiniują przyszłość developmentu."}
                    </p>
                    <div className="flex items-center text-xs text-white/70">
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
