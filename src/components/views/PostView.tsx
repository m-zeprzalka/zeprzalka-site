import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, Hash } from "lucide-react"
import { ActiveTOC } from "@/components/blog/ActiveTOC"
import { ARTICLE_IMAGE_SIZES, mdxComponents } from "@/components/blog/mdx-components"
import { PostCta } from "@/components/blog/PostCta"
import { PostGrid } from "@/components/blog/PostCard"
import { TermLink } from "@/components/blog/TermLink"
import "@/components/blog/highlight.css"
import { JsonLd } from "@/components/JsonLd"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ROUTES, categoryPath, postPath, tagPath, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getPages } from "@/i18n/content/pages"
import { formatDate } from "@/i18n/format"
import { renderMdx } from "@/lib/mdx"
import { formatReadingTime, getRelatedPosts, type Post } from "@/lib/posts"
import { blogPostingSchema, breadcrumbSchema, graph } from "@/lib/schema"
import { AUTHOR } from "@/lib/site"
import { slugify } from "@/lib/slug"

/**
 * Wygląd treści wpisu — jedno źródło: klasa `prose` z modyfikatorami.
 * Komponenty MDX (`mdx-components.tsx`) zmieniają tylko semantykę.
 * Kod w linii to `:not(pre) > code` — bloki kodu koloruje `highlight.css`.
 */
const PROSE = [
  "prose prose-lg max-w-none dark:prose-invert",
  "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
  "prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl",
  "prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-lg",
  "prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground prose-strong:text-foreground",
  "prose-a:text-primary prose-a:no-underline prose-a:underline-offset-2 prose-a:transition-colors prose-a:hover:text-primary/80 prose-a:hover:underline",
  "prose-blockquote:rounded-r-lg prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:font-normal prose-blockquote:text-foreground/90 prose-blockquote:not-italic",
  "[&_:not(pre)>code]:rounded [&_:not(pre)>code]:border [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:text-foreground prose-code:before:content-none prose-code:after:content-none",
  "prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0",
  "prose-ol:list-decimal prose-ul:list-disc [&_li]:[margin-inline-start:0] [&_ol]:[margin-inline-start:0] [&_ol]:[padding-inline-start:1.5rem] [&_ul]:[margin-inline-start:0] [&_ul]:[padding-inline-start:1.5rem]",
  "prose-img:rounded-lg prose-img:shadow-md",
  "prose-table:my-6 prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-border prose-th:bg-muted/50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-3 [&_td:first-child]:pl-4 [&_th:first-child]:pl-4",
].join(" ")

export async function PostView({ post, locale }: { post: Post; locale: Locale }) {
  const common = getCommon(locale)
  const copy = getPages(locale).blog
  const { content, headings } = await renderMdx(post.content, mdxComponents(locale))
  const related = getRelatedPosts(post)
  const Cover = post.frontmatter.imageCaption ? "figure" : "div"

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
          <aside className="hidden lg:col-span-4 lg:block xl:col-span-3" data-print-hide>
            <nav aria-label={common.ui.tableOfContents} className="sticky top-24 flex flex-col">
              {/* Nazwę regionu podaje aria-label — widoczny napis nie jest czytany drugi raz. */}
              <p aria-hidden="true" className="m-2 flex h-7 items-center p-2 text-xs font-semibold">
                {common.ui.tableOfContents}
              </p>
              <div className="max-h-[calc(100vh-10rem)] overflow-auto p-2 text-sm">
                <ActiveTOC headings={headings} />
              </div>
            </nav>
          </aside>

          <article className="lg:col-span-6 xl:col-span-7">
            <header className="mb-12">
              <Breadcrumb className="mb-6" aria-label={copy.breadcrumbAria}>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={ROUTES.home[locale]}>{common.nav.home}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={ROUTES.blog[locale]}>{copy.breadcrumbBlog}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{post.frontmatter.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <ul className="mb-4 flex flex-wrap gap-2">
                {post.frontmatter.categories.map((category) => (
                  <li key={category}>
                    <TermLink href={categoryPath(locale, slugify(category))}>{category}</TermLink>
                  </li>
                ))}
              </ul>

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

            {/* alt pusty: okładka ilustruje tytuł, który stoi tuż nad nią. */}
            <Cover className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-xl border shadow-md">
              <Image
                src={post.frontmatter.image}
                alt=""
                fill
                sizes={ARTICLE_IMAGE_SIZES}
                className="object-cover"
                preload
              />
              {post.frontmatter.imageCaption && (
                <figcaption className="absolute right-0 bottom-0 left-0 bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-sm">
                  {post.frontmatter.imageCaption}
                </figcaption>
              )}
            </Cover>

            <div className={PROSE}>{content}</div>

            <footer className="mt-16 space-y-12 border-t pt-10">
              {/* Tags — wpis spoza istniejących tagów nie dostaje samotnej ikony */}
              {post.frontmatter.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <ul className="flex flex-wrap items-center gap-2">
                    {post.frontmatter.tags.map((tag) => (
                      <li key={tag}>
                        <TermLink href={tagPath(locale, slugify(tag))} variant="secondary">
                          {tag}
                        </TermLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <PostCta locale={locale} />

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
                  <p className="mt-1 text-sm text-muted-foreground">{AUTHOR.jobTitle[locale]}</p>
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
