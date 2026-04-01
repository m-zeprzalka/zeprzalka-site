import { getAllPosts } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader } from "@/components/PageHeader"

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
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <PageHeader
        badge="Blog"
        title="Kategorie"
        description="Przeglądaj artykuły według kategorii"
      />

      <div className="flex flex-wrap gap-3">
        {categories.map(([slug, count]) => (
          <Link key={slug} href={`/blog/kategoria/${slug}`}>
            <Badge
              variant="outline"
              className="text-sm px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer capitalize gap-2"
            >
              {slug.replace(/-/g, " ")}
              <span className="text-muted-foreground font-normal">{count}</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}
