import { getPostsByCategory, getAllPosts } from "@/lib/posts"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader } from "@/components/PageHeader"

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
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <PageHeader
        badge="Kategoria"
        title={categoryName}
        description={`${posts.length} ${posts.length === 1 ? "artykuł" : "artykuły"} w tej kategorii`}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="group relative">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
              <Image
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {(post.frontmatter.categories || []).slice(0, 2).map((cat: string) => (
                  <Link
                    key={cat}
                    href={`/blog/kategoria/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    className="relative z-10"
                  >
                    <Badge variant="outline" className="text-xs hover:bg-secondary/80 cursor-pointer transition-colors">
                      {cat}
                    </Badge>
                  </Link>
                ))}
              </div>
              <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                  {post.frontmatter.title}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.frontmatter.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {new Date(post.frontmatter.date).toLocaleDateString("pl-PL")}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readingTime.replace("min read", "min czytania")}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
