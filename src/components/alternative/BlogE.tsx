// [project]/src/components/alternative/BlogC.tsx

import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllPosts } from "@/lib/posts"

export function BlogE() {
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
                className="group relative block aspect-[4/3] overflow-hidden rounded-xl"
              >
                {/* Tło z obrazkiem - lekko przyciemnia się i rozmywa po najechaniu */}
                <Image
                  src={post.frontmatter.image}
                  alt={post.frontmatter.title}
                  fill
                  className="object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:blur-sm group-hover:brightness-75"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Kontener na treść "unoszący się" nad obrazkiem */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ease-in-out sm:p-6 group-hover:p-3 sm:group-hover:p-4">
                  <div className="rounded-lg bg-black/50 p-4 text-white backdrop-blur-lg transition-all duration-500 ease-in-out group-hover:bg-black/60">
                    {/* Tagi widoczne od razu */}
                    <div className="mb-2 flex flex-wrap gap-2">
                      {(post.frontmatter.tags || []).map((tag) => (
                        <Badge
                          key={tag}
                          className="border-white/20 bg-white/10 text-xs font-normal text-white"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Tytuł */}
                    <h3 className="text-xl font-bold leading-tight tracking-tight lg:text-2xl">
                      {post.frontmatter.title}
                    </h3>

                    {/* Metadane */}
                    <div className="mt-4 flex items-center text-sm text-white/80">
                      <span>
                        {new Date(post.frontmatter.date).toLocaleDateString(
                          "pl-PL"
                        )}
                      </span>
                      <span className="mx-2">&middot;</span>
                      <span>{post.readingTime}</span>
                    </div>

                    {/* Ukryty opis, który pojawia się po najechaniu */}
                    <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-0 group-hover:max-h-40 group-hover:mt-4">
                      <p className="text-sm text-white/90">
                        {post.frontmatter.excerpt ||
                          "Odkryj kluczowe strategie i techniki, które zdefiniują przyszłość developmentu. Zanurz się w analizie pełnej praktycznych przykładów."}
                      </p>
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
