import { getPostsByCategory, getAllPosts } from "@/lib/posts"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ kategoria: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  const categories = new Set<string>()

  posts.forEach((post) => {
    post.frontmatter.categories?.forEach((cat) => {
      categories.add(cat.toLowerCase().replace(/\s+/g, "-"))
    })
  })

  return Array.from(categories).map((kategoria) => ({ kategoria }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kategoria } = await params
  const categoryName = decodeURIComponent(kategoria).replace(/-/g, " ")

  return {
    title: categoryName,
    description: `Artykuły w kategorii: ${categoryName}`,
  }
}

export default async function KategoriaPage({ params }: PageProps) {
  const { kategoria } = await params
  const categoryName = decodeURIComponent(kategoria).replace(/-/g, " ")
  const posts = getPostsByCategory(kategoria)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4 text-sm">
          Kategoria
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 capitalize">
          {categoryName}
        </h1>
        <p className="text-xl text-muted-foreground">
          {posts.length} {posts.length === 1 ? "artykuł" : "artykuły"}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
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
                  {(post.frontmatter.categories || []).slice(0, 2).map((cat: string) => (
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
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(post.frontmatter.date).toLocaleDateString("pl-PL")}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readingTime}
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
