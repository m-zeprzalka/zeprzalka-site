// [project]/src/components/alternative/BlogC.tsx

import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllPosts } from "@/lib/posts"

export function BlogD() {
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
          {/* Zmieniamy siatkę na flex z odstępami, aby karty były pod sobą */}
          <div className="flex flex-col gap-12">
            {posts.map((post) => (
              <Card
                key={post.slug}
                className="group grid grid-cols-1 overflow-hidden rounded-xl border transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/10 md:grid-cols-5 md:hover:-translate-y-1"
              >
                {/* Kolumna na obrazek */}
                <div className="col-span-1 md:col-span-2">
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <Image
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-500 ease-in-out md:rounded-l-xl md:rounded-r-none"
                    />
                  </Link>
                </div>

                {/* Kolumna na treść */}
                <div className="col-span-1 flex flex-col p-6 md:col-span-3">
                  <div className="flex-grow">
                    {/* Tagi */}
                    <div className="mb-3 flex flex-wrap gap-2">
                      {(post.frontmatter.tags || []).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="font-normal"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Tytuł - teraz jako klikalny link */}
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                        {post.frontmatter.title}
                      </h3>
                    </Link>

                    {/* Krótki opis dla lepszego kontekstu */}
                    <p className="text-muted-foreground">
                      {post.frontmatter.excerpt ||
                        "Kliknij, aby przeczytać więcej o tym fascynującym temacie i odkryć nowe perspektywy."}
                    </p>
                  </div>

                  {/* Stopka z metadanymi */}
                  <div className="mt-6 flex items-center text-sm text-muted-foreground">
                    <span>
                      {new Date(post.frontmatter.date).toLocaleDateString(
                        "pl-PL",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </span>
                    <span className="mx-2">&middot;</span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </section>
  )
}
