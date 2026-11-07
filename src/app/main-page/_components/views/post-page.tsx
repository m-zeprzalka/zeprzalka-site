import Image from "next/image"
import { mdxComponents } from "@/app/main-page/_components/blog/mdx-components"
import "@/app/main-page/_components/blog/article.css"
import { SectionNav } from "@/app/main-page/_components/layout/section-nav"
import { CtaPanel } from "@/app/main-page/_components/page/cta-panel"
import { PageHeader } from "@/app/main-page/_components/page/page-header"
import { PostIndex } from "@/app/main-page/_components/page/post-index"
import { Section } from "@/app/main-page/_components/page/section"
import { TermLinks } from "@/app/main-page/_components/page/term-links"
import { PeekProvider } from "@/app/main-page/_components/peek/peek-context"
import { PeekStage } from "@/app/main-page/_components/peek/peek-stage"
import { JsonLd } from "@/app/main-page/_components/seo/json-ld"
import { PAGE_SECTION, SECTION } from "@/app/main-page/_lib/anchors"
import { breadcrumb, cardsOf, postDate, termLinks } from "@/app/main-page/_lib/content/pages"
import { postPeeks } from "@/app/main-page/_lib/content/peeks"
import { getSource } from "@/app/main-page/_lib/content/source"
import { COLUMN_SIZES, COVER } from "@/app/main-page/_lib/media"
import { pageHref } from "@/app/main-page/_lib/routes"
import type { Locale } from "@/i18n/config"
import { renderMdx } from "@/lib/mdx"
import { postPageSchema } from "@/lib/page-schema"
import { formatReadingTime, getRelatedPosts, type Post } from "@/lib/posts"
import { AUTHOR } from "@/lib/site"

/**
 * Wpis: okruszki, tytuł z opisem (jak każda podstrona), data, czas lektury
 * i kategorie, okładka, treść w kolumnie (`article.css`), spis rozdziałów
 * w lewym torze (ten sam co sekcje startu), tagi i autor, wezwanie do
 * rozmowy i „Czytaj dalej”. Zdjęcia autora świadomie nie ma.
 */
export async function PostPage({ post, locale }: { post: Post; locale: Locale }) {
  const { common, copy: mainPage, pages } = getSource(locale)
  const copy = pages.blog
  const { frontmatter } = post
  const { content, headings } = await renderMdx(post.content, mdxComponents(locale))
  const related = cardsOf(locale, getRelatedPosts(post))
  const chapters = headings
    .filter((heading) => heading.level === 2)
    // Emoji z początku nagłówka („🎬 Dwie perspektywy”) nie trafia do spisu.
    .map((heading) => ({
      id: heading.id,
      label: heading.text.replace(/^\p{Extended_Pictographic}\uFE0F?\s*/u, ""),
    }))
  const Cover = frontmatter.imageCaption ? "figure" : "div"

  return (
    <PeekProvider peeks={postPeeks(related)}>
      <JsonLd data={postPageSchema(locale, post)} />
      {chapters.length > 0 && (
        <SectionNav
          label={common.ui.tableOfContents}
          sections={[{ id: SECTION.start, label: mainPage.ui.start }, ...chapters]}
        />
      )}
      <article>
        <PageHeader
          breadcrumb={breadcrumb(locale, frontmatter.title, [
            { label: copy.breadcrumbBlog, href: pageHref("blog", locale) },
          ])}
          title={frontmatter.title}
          lead={frontmatter.description}
          compactLead
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3 text-sm text-muted-foreground">
            <time dateTime={frontmatter.date} className="tabular-nums">
              {postDate(locale, frontmatter.date)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{formatReadingTime(post.readingMinutes, locale)}</span>
            <span aria-hidden="true" className="me-1">
              ·
            </span>
            <TermLinks terms={termLinks(locale, "categories", frontmatter.categories)} />
          </div>
        </PageHeader>

        {/* alt pusty: okładka ilustruje tytuł, który stoi tuż nad nią. */}
        <Cover className="column mt-10 motion-safe:animate-sharpen motion-safe:[animation-delay:300ms]">
          <Image
            src={frontmatter.image}
            alt=""
            width={COVER.width}
            height={COVER.height}
            sizes={COLUMN_SIZES}
            preload
            fetchPriority="high"
            className="aspect-video w-full rounded-2xl bg-muted object-cover"
          />
          {frontmatter.imageCaption && (
            <figcaption className="mt-2.5 text-sm text-muted-foreground">
              {frontmatter.imageCaption}
            </figcaption>
          )}
        </Cover>

        <div className="column mt-12">
          <div className="article">{content}</div>
        </div>

        {/* Kreska na szerokość treści, nie kolumny z marginesem strony. */}
        <footer className="column mt-16">
          <div className="grid gap-8 border-t pt-8">
            {frontmatter.tags.length > 0 && (
              <TermLinks terms={termLinks(locale, "tags", frontmatter.tags)} variant="outline" />
            )}
            <div className="grid gap-1">
              <p className="font-medium">{AUTHOR.name}</p>
              <p className="text-sm text-muted-foreground">{AUTHOR.jobTitle[locale]}</p>
              <p className="mt-2 max-w-[60ch] text-pretty text-muted-foreground">
                {AUTHOR.bio[locale]}
              </p>
            </div>
          </div>
        </footer>
      </article>

      <CtaPanel
        id={PAGE_SECTION.cooperation}
        as="aside"
        heading={common.postCta.title}
        body={common.postCta.description}
        actions={[
          { label: common.postCta.primary, href: pageHref("contact", locale) },
          { label: common.postCta.secondary, href: pageHref("services", locale) },
        ]}
      />
      {related.length > 0 && (
        <Section id={PAGE_SECTION.related} title={copy.relatedHeading}>
          <PostIndex posts={related} newLabel={mainPage.ui.newPost} />
        </Section>
      )}
      <PeekStage />
    </PeekProvider>
  )
}
