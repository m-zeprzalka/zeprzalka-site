// src/app/blog/[slug]/page.tsx
import { getPostBySlug, getAllPosts, type Post } from "@/lib/posts"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Hash,
  Info,
  LinkIcon,
  Linkedin,
  List,
  Twitter,
  Check,
  Copy,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

// Komponenty pomocnicze (Callout przeniesiony do osobnego pliku jeśli wymaga hooków)

function TableOfContents({
  headings,
}: {
  headings: { id: string; level: number; text: string }[]
}) {
  return (
    <div className="lg:sticky top-24">
      <h3 className="font-medium text-foreground mb-3">Spis treści</h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              className={`block transition-colors ${
                heading.level === 3 ? "pl-4" : ""
              } text-muted-foreground hover:text-primary`}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// MDX Components
const mdxComponents = {
  Button,
  h2: ({ children, id }: any) => (
    <h2
      id={id}
      className="text-2xl font-bold tracking-tight mt-12 mb-4 scroll-mt-24"
    >
      {children}
    </h2>
  ),
  h3: ({ children, id }: any) => (
    <h3
      id={id}
      className="text-xl font-bold tracking-tight mt-8 mb-3 scroll-mt-24"
    >
      {children}
    </h3>
  ),
  // Callout: Callout, // Dodaj import z osobnego pliku jeśli chcesz używać Callout z hookami
}

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {}
  }

  return {
    title: `${post.frontmatter.title} | Zeprzalka.com`,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: [post.frontmatter.author?.name || "Autor"],
      images: [post.frontmatter.image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [post.frontmatter.image],
    },
  }
}

export default function BlogPost({ params }: PageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="container mx-auto p-4 py-6 md:py-8 lg:py-12 xl:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-x-12">
        {/* Table of Contents */}
        <aside className="hidden lg:block lg:col-span-1">
          <TableOfContents headings={post.headings} />
        </aside>

        {/* Article Content */}
        <article className="lg:col-span-3">
          {/* Header */}
          <header className="mb-12">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" aria-current="page">
                    {post.frontmatter.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-wrap gap-2 mb-4">
              {/* Add a safety check here */}
              {(post.frontmatter.categories || [])
                .slice(0, 2)
                .map((cat: string) => (
                  <Badge key={cat} variant="outline" className="text-xs">
                    {cat}
                  </Badge>
                ))}
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tighter mb-4 leading-tight">
              {post.frontmatter.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              {post.frontmatter.description}
            </p>

            <div className="flex items-center gap-x-4 gap-y-2 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <time dateTime={post.frontmatter.date}>
                  {new Date(post.frontmatter.date).toLocaleDateString("pl-PL")}
                </time>
              </div>
              <span className="text-muted-foreground/50">/</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {post.readingTime.replace("min read", "min czytania")}
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <figure className="relative w-full aspect-[16/9] rounded-xl border overflow-hidden mb-12 shadow-md">
            {post.frontmatter.image ? (
              <Image
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                Brak obrazka
              </div>
            )}
          </figure>

          {/* MDX Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:bg-muted/40 prose-blockquote:rounded-lg prose-blockquote:font-medium prose-a:text-primary prose-a:underline prose-a:underline-offset-2 prose-a:transition-colors prose-img:rounded-lg prose-img:shadow-md prose-pre:bg-muted/50 prose-pre:rounded-lg prose-pre:p-4 prose-code:text-[15px] prose-table:border prose-table:rounded-lg prose-th:bg-muted/50 prose-th:font-semibold prose-td:p-2 prose-th:p-2">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-10 border-t space-y-12">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <Hash className="w-5 h-5 text-muted-foreground" />
              {(post.frontmatter.tags || []).map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Author */}
            <div className="flex flex-col sm:flex-row items-start gap-6 bg-muted/40 p-6 rounded-lg border">
              <Avatar className="w-20 h-20 border">
                <AvatarImage
                  src={post.frontmatter.author?.avatar || ""}
                  alt={post.frontmatter.author?.name || "Autor"}
                />
                <AvatarFallback>
                  {(post.frontmatter.author?.name || "A")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <span className="text-sm text-muted-foreground">
                  Napisane przez
                </span>
                <h4 className="font-semibold text-xl mt-1">
                  {post.frontmatter.author?.name || "Autor"}
                </h4>
                <p className="text-muted-foreground text-sm mt-1">
                  {post.frontmatter.author?.title || ""}
                </p>
                <p className="mt-2 text-foreground/80 text-base">
                  {post.frontmatter.author?.bio || ""}
                </p>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </main>
  )
}
