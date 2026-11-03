import type { ComponentProps, HTMLAttributes } from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { CalendarDays, Clock, Hash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ActiveTOC } from "@/components/blog/ActiveTOC"
import { CodeBlock } from "@/components/blog/CodeBlock"
import { YouTubeEmbed } from "@/components/blog/YouTubeEmbed"
import { PostCta } from "@/components/blog/PostCta"
import { Separator } from "@/components/ui/separator"
import { JsonLd } from "@/components/JsonLd"
import { PostGrid } from "@/components/blog/PostCard"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import remarkGfm from "remark-gfm"
import remarkEmoji from "remark-emoji"
import "@/components/blog/highlight.css"
import { AUTHOR } from "@/lib/site"
import { getRelatedPosts, type Post } from "@/lib/posts"
import { blogPostingSchema, breadcrumbSchema, graph } from "@/lib/schema"
import { slugify } from "@/lib/slug"
import { cn } from "@/lib/utils"
import { ROUTES, categoryPath, postPath, tagPath, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getPages } from "@/i18n/content/pages"
import { formatDate, formatReadingTime } from "@/i18n/format"

/**
 * Komponenty MDX. Zależą od języka wyłącznie przez etykietę przycisku
 * kopiowania kodu, dlatego mapa powstaje na żądanie, a nie raz na moduł.
 */
function mdxComponents(locale: Locale) {
  const copyLabel = getCommon(locale).ui.copyCode

  return {
    YouTubeEmbed: (props: ComponentProps<typeof YouTubeEmbed>) => (
      <YouTubeEmbed playLabel={getCommon(locale).ui.youtubePlay} {...props} />
    ),
    Image: ({ src, alt, width, height, className, ...props }: ComponentProps<typeof Image>) => (
      // Domyślne 1280×720 to proporcje wszystkich obrazów `<Image>` w treści.
      <Image
        src={src}
        alt={alt ?? ""}
        width={width ?? 1280}
        height={height ?? 720}
        sizes="(min-width: 1280px) 60vw, 100vw"
        className={cn("my-6 h-auto w-full rounded-lg shadow-md", className)}
        {...props}
      />
    ),
    h2: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        {...props}
        className={cn("mt-12 mb-4 scroll-mt-24 text-2xl font-bold tracking-tight", className)}
      />
    ),
    h3: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        {...props}
        className={cn("mt-8 mb-3 scroll-mt-24 text-xl font-bold tracking-tight", className)}
      />
    ),
    h4: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        {...props}
        className={cn("mt-6 mb-2 scroll-mt-24 text-lg font-semibold tracking-tight", className)}
      />
    ),
    ul: ({ className, ...props }: HTMLAttributes<HTMLUListElement>) => (
      <ul
        {...props}
        className={cn(
          "my-4 [margin-inline-start:0] list-outside list-disc space-y-2 [padding-inline-start:1.5rem]",
          className
        )}
      />
    ),
    ol: ({ className, ...props }: HTMLAttributes<HTMLOListElement>) => (
      <ol
        {...props}
        className={cn(
          "my-4 [margin-inline-start:0] list-outside list-decimal space-y-2 [padding-inline-start:1.5rem]",
          className
        )}
      />
    ),
    code: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
      <code
        {...props}
        className={cn(
          "rounded border bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground",
          className
        )}
      />
    ),
    pre: (props: HTMLAttributes<HTMLPreElement>) => <CodeBlock copyLabel={copyLabel} {...props} />,
    blockquote: ({ className, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        {...props}
        className={cn(
          "my-6 rounded-r-lg border-l-4 border-primary bg-muted/30 px-6 py-4 text-foreground/90 italic",
          className
        )}
      />
    ),
    // Obrazy z markdownu mają nieznane wymiary — świadomie zwykły <img>, leniwy.
    img: ({ alt, className, ...props }: ComponentProps<"img">) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        className={cn("my-6 rounded-lg shadow-md", className)}
      />
    ),
    // Szerokie tabele przewijają się we własnym kontenerze; tabela zostaje tabelą.
    table: (props: ComponentProps<"table">) => (
      <div className="overflow-x-auto">
        <table {...props} />
      </div>
    ),
    // Linki wewnętrzne przez next/link (prefetch, bez przeładowania dokumentu),
    // zewnętrzne w nowej karcie.
    a: ({ href = "", className, ...props }: ComponentProps<"a">) => {
      const classes = cn(
        "text-primary underline underline-offset-2 transition-colors hover:text-primary/80",
        className
      )
      if (href.startsWith("/")) return <Link href={href} className={classes} {...props} />
      const external = href.startsWith("http")
      return (
        <a
          href={href}
          className={classes}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          {...props}
        />
      )
    },
  }
}

export function PostView({ post, locale }: { post: Post; locale: Locale }) {
  const ui = getCommon(locale).ui
  const copy = getPages(locale).blog

  const related = getRelatedPosts(post)

  // Wpis, okruszki (Start → Blog → wpis) i odwołanie do autora przez @id.
  const jsonLd = graph(
    blogPostingSchema(post),
    breadcrumbSchema(locale, [
      { name: copy.breadcrumbBlog, path: ROUTES.blog[locale] },
      { name: post.frontmatter.title, path: postPath(locale, post.slug) },
    ])
  )

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="container mx-auto p-4 py-6 md:py-8 lg:py-12 xl:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
          {/* Table of Contents */}
          <aside className="hidden lg:col-span-4 lg:block xl:col-span-3" data-print-hide>
            <nav
              aria-label={ui.tableOfContents}
              className="sticky top-24 flex h-auto w-full flex-col bg-transparent text-foreground"
            >
              <div className="flex flex-col gap-2 p-2">
                <p className="flex h-7 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-xs font-semibold">
                  {ui.tableOfContents}
                </p>
              </div>
              <div className="flex max-h-[calc(100vh-10rem)] min-h-0 flex-1 flex-col gap-2 overflow-auto">
                <div className="relative flex w-full min-w-0 flex-col p-2">
                  <div className="w-full text-sm">
                    <ActiveTOC headings={post.headings} />
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          {/* Article Content */}
          <article className="lg:col-span-6 xl:col-span-7">
            {/* Header */}
            <header className="mb-12">
              <Breadcrumb className="mb-6" aria-label={copy.breadcrumbAria}>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={ROUTES.blog[locale]}>
                      {copy.breadcrumbBlog}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{post.frontmatter.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="mb-4 flex flex-wrap gap-2">
                {post.frontmatter.categories.map((cat) => (
                  <Link key={cat} href={categoryPath(locale, slugify(cat))}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer text-xs transition-colors hover:bg-secondary/80"
                    >
                      {cat}
                    </Badge>
                  </Link>
                ))}
              </div>

              <h1 className="mb-4 text-4xl leading-tight font-bold tracking-tighter md:text-5xl xl:text-6xl">
                {post.frontmatter.title}
              </h1>

              <p className="mb-8 text-xl text-muted-foreground xl:text-2xl">
                {post.frontmatter.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <time dateTime={post.frontmatter.date}>
                    {formatDate(post.frontmatter.date, locale)}
                  </time>
                </div>
                <span className="text-muted-foreground/50" aria-hidden="true">
                  /
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatReadingTime(post.readingMinutes, locale)}</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <figure className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-xl border shadow-md">
              <Image
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                fill
                sizes="(min-width: 1280px) 60vw, 100vw"
                className="object-cover"
                preload
              />
              {post.frontmatter.imageCaption && (
                <figcaption className="absolute right-0 bottom-0 left-0 bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-sm">
                  {post.frontmatter.imageCaption}
                </figcaption>
              )}
            </figure>

            {/* MDX Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-headings:no-underline prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground prose-a:text-primary prose-a:no-underline prose-a:transition-colors hover:prose-a:underline prose-blockquote:font-normal prose-blockquote:not-italic prose-strong:text-foreground prose-code:rounded prose-code:border prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0 prose-table:my-6 prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-border prose-th:bg-muted/50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-3 prose-img:rounded-lg prose-img:shadow-md [&_li]:[margin-inline-start:0] [&_ol]:[margin-inline-start:0] [&_ol]:[padding-inline-start:1.5rem] [&_td:first-child]:pl-4 [&_th:first-child]:pl-4 [&_ul]:[margin-inline-start:0] [&_ul]:[padding-inline-start:1.5rem]">
              <MDXRemote
                source={post.content}
                components={mdxComponents(locale)}
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
            <footer className="mt-16 space-y-12 border-t pt-10">
              {/* Tags — wpis spoza istniejących tagów nie dostaje samotnej ikony */}
              {post.frontmatter.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  {post.frontmatter.tags.map((tag) => (
                    <Link key={tag} href={tagPath(locale, slugify(tag))}>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer transition-colors hover:bg-secondary/80"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              <PostCta locale={locale} />

              {/* Author */}
              <div className="flex flex-col items-start gap-6 rounded-lg border bg-muted/40 p-6 sm:flex-row">
                {/* alt pusty: imię i nazwisko stoją tuż obok jako tekst. */}
                <Image
                  src={AUTHOR.avatarSmall}
                  alt=""
                  width={80}
                  height={80}
                  className="size-20 shrink-0 rounded-full border object-cover"
                />
                <div className="flex-1">
                  <p className="mt-1 text-xl font-semibold">{AUTHOR.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{AUTHOR.jobTitle}</p>
                  <p className="mt-2 text-base text-foreground/80">{AUTHOR.bio[locale]}</p>
                </div>
              </div>
            </footer>
          </article>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-20" data-print-hide>
            <Separator className="mb-12" />
            <h2 id="related-heading" className="mb-8 text-2xl font-semibold tracking-tight">
              {copy.relatedHeading}
            </h2>
            <PostGrid posts={related} locale={locale} headingLevel="h3" />
          </section>
        )}
      </div>
    </>
  )
}
