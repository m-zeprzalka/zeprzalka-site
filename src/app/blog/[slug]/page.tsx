// src/app/blog/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from "@/lib/posts"
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
import { CalendarDays, Clock, Hash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { ActiveTOC } from "@/components/blog/ActiveTOC"
import { CodeBlock } from "@/components/blog/CodeBlock"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import remarkGfm from "remark-gfm"
import remarkEmoji from "remark-emoji"
import "./highlight.css"

// MDX Components
const mdxComponents = {
  Button,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className={
        "text-2xl font-bold tracking-tight mt-12 mb-4 scroll-mt-24 " +
        (props.className || "")
      }
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className={
        "text-xl font-bold tracking-tight mt-8 mb-3 scroll-mt-24 " +
        (props.className || "")
      }
    />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      {...props}
      className={
        "text-lg font-semibold tracking-tight mt-6 mb-2 scroll-mt-24 " +
        (props.className || "")
      }
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      className={
        "list-disc list-outside space-y-2 my-4 [margin-inline-start:0] [padding-inline-start:1.5rem] " +
        (props.className || "")
      }
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      {...props}
      className={
        "list-decimal list-outside space-y-2 my-4 [margin-inline-start:0] [padding-inline-start:1.5rem] " +
        (props.className || "")
      }
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      {...props}
      className={
        "bg-muted px-1.5 py-0.5 rounded text-sm font-mono border " +
        (props.className || "")
      }
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className={
        "border-l-4 border-primary bg-muted/30 py-4 px-6 my-6 rounded-r-lg italic text-foreground/90 " +
        (props.className || "")
      }
    />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return (
      <img
        {...props}
        className={"rounded-lg shadow-md my-6 " + (props.className || "")}
      />
    )
  },
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      className={
        "text-primary underline underline-offset-2 hover:text-primary/80 transition-colors " +
        (props.className || "")
      }
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
    />
  ),
}

interface PageProps {
  params: Promise<{ slug: string }>
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
  const { slug } = await params
  const post = getPostBySlug(slug)

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

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // JSON-LD Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    image: post.frontmatter.image,
    datePublished: post.frontmatter.date,
    author: {
      "@type": "Person",
      name: post.frontmatter.author?.name || "Autor",
    },
    publisher: {
      "@type": "Organization",
      name: "Zeprzalka.com",
      logo: {
        "@type": "ImageObject",
        url: "https://zeprzalka.com/logo.png",
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container mx-auto p-4 py-6 md:py-8 lg:py-12 xl:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
          {/* Table of Contents */}
          <aside className="hidden lg:block lg:col-span-2">
            <ActiveTOC headings={post.headings} />
          </aside>

          {/* Article Content */}
          <article className="lg:col-span-7">
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

              <div className="flex flex-wrap gap-2 mb-4 lg:col-span-3">
                {(post.frontmatter.categories || [])
                  .slice(0, 3)
                  .map((cat: string) => (
                    <Badge key={cat} variant="outline" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                {(post.frontmatter.categories || []).length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground"
                  >
                    +{(post.frontmatter.categories || []).length - 3} więcej
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tighter mb-4 leading-tight">
                {post.frontmatter.title}
              </h1>

              <p className="text-xl xl:text-2xl text-muted-foreground mb-8">
                {post.frontmatter.description}
              </p>

              <div className="flex items-center gap-x-4 gap-y-2 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <time dateTime={post.frontmatter.date}>
                    {new Date(post.frontmatter.date).toLocaleDateString(
                      "pl-PL"
                    )}
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
                <>
                  <Image
                    src={post.frontmatter.image}
                    alt={post.frontmatter.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    priority
                  />
                  {post.frontmatter.imageCaption && (
                    <figcaption className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm px-4 py-2 backdrop-blur-sm">
                      {post.frontmatter.imageCaption}
                    </figcaption>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                  Brak obrazka
                </div>
              )}
            </figure>

            {/* MDX Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight prose-headings:no-underline prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:transition-colors prose-img:rounded-lg prose-img:shadow-md prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:border prose-code:before:content-none prose-code:after:content-none prose-table:w-full prose-table:border-collapse prose-table:my-6 prose-th:bg-muted/50 prose-th:font-semibold prose-th:text-left prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-3 prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-3 prose-blockquote:not-italic prose-blockquote:font-normal [&_ul]:[margin-inline-start:0] [&_ul]:[padding-inline-start:1.5rem] [&_ol]:[margin-inline-start:0] [&_ol]:[padding-inline-start:1.5rem] [&_li]:[margin-inline-start:0] [&_th:first-child]:pl-4 [&_td:first-child]:pl-4">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm, remarkEmoji],
                    rehypePlugins: [
                      rehypeSlug,
                      [
                        rehypeAutolinkHeadings,
                        {
                          behavior: "append",
                          properties: {
                            className: ["anchor-link"],
                            ariaHidden: true,
                            tabIndex: -1,
                          },
                          content: {
                            type: "text",
                            value: "",
                          },
                        },
                      ],
                      rehypeHighlight,
                    ],
                  },
                }}
              />
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-10 border-t space-y-12">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <Hash className="w-5 h-5 text-muted-foreground" />
                {(post.frontmatter.tags || []).map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Badge
                      variant="secondary"
                      className="hover:bg-secondary/80 cursor-pointer transition-colors"
                    >
                      {tag}
                    </Badge>
                  </Link>
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
    </>
  )
}
