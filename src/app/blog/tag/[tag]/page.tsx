import { getAllPosts } from "@/lib/posts"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader } from "@/components/PageHeader"

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  const tags = new Set<string>()

  posts.forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => {
      tags.add(tag.toLowerCase().replace(/\s+/g, "-"))
    })
  })

  return Array.from(tags).map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  const tagName = decodeURIComponent(tag).replace(/-/g, " ")

  return {
    title: `#${tagName}`,
    description: `Artykuły o tematyce: ${tagName}`,
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  const posts = getAllPosts()
  const tagSlug = tag.toLowerCase()
  const tagName = decodeURIComponent(tag).replace(/-/g, " ")

  const taggedPosts = posts.filter((post) =>
    post.frontmatter.tags?.some(
      (t) => t.toLowerCase().replace(/\s+/g, "-") === tagSlug
    )
  )

  if (taggedPosts.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <PageHeader
        badge="Tag"
        title={`#${tagName}`}
        description={`${taggedPosts.length} ${taggedPosts.length === 1 ? "artykuł" : "artykuły"} z tym tagiem`}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {taggedPosts.map((post) => (
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
