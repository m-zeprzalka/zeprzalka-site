import { getAllPosts } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kategorie",
  description: "Przeglądaj artykuły według kategorii",
}

export default function CategoryIndexPage() {
  const posts = getAllPosts()

  const categoryCounts = posts.reduce<Record<string, number>>((acc, post) => {
    post.frontmatter.categories?.forEach((cat) => {
      const slug = cat.toLowerCase().replace(/\s+/g, "-")
      acc[slug] = (acc[slug] || 0) + 1
    })
    return acc
  }, {})

  const categories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Kategorie
        </h1>
        <p className="text-xl text-muted-foreground">
          Przeglądaj artykuły według kategorii
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map(([slug, count]) => (
          <Link key={slug} href={`/blog/kategoria/${slug}`}>
            <Badge
              variant="outline"
              className="text-sm px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer capitalize"
            >
              {slug.replace(/-/g, " ")}
              <span className="ml-2 text-muted-foreground">{count}</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}
