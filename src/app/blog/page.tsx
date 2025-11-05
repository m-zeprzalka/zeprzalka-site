import { getAllPosts, getFeaturedPosts, type Post } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Zeprzalka.com - Najnowsze trendy w technologii",
  description:
    "Odkryj najnowsze artykuły o AI, Next.js, web developmencie i strategiach biznesowych. Praktyczne porady od ekspertów.",
  openGraph: {
    title: "Blog | Zeprzalka.com",
    description: "Najnowsze trendy w technologii i biznesie",
    type: "website",
  },
}

export default function BlogPage() {
  const allPosts = getAllPosts()
  const featuredPosts = getFeaturedPosts()

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

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
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
        <h2 className="text-2xl font-bold mb-8">Wszystkie artykuły</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post: Post) => (
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
    </div>
  )
}
