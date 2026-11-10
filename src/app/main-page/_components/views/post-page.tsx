import Image from "next/image"
import { ChevronDownIcon } from "lucide-react"
import "@/app/main-page/_components/blog/article.css"
import { renderArticle } from "@/app/main-page/_components/blog/render-article"
import { TableOfContents } from "@/app/main-page/_components/layout/table-of-contents"
import { CtaPanel } from "@/app/main-page/_components/page/cta-panel"
import { PageHeader } from "@/app/main-page/_components/page/page-header"
import { PostIndex } from "@/app/main-page/_components/page/post-index"
import { Section } from "@/app/main-page/_components/page/section"
import { TermLinks } from "@/app/main-page/_components/page/term-links"
import { PeekProvider } from "@/app/main-page/_components/peek/peek-context"
import { PeekStage } from "@/app/main-page/_components/peek/peek-stage"
import { JsonLd } from "@/app/main-page/_components/seo/json-ld"
import { PAGE_SECTION } from "@/app/main-page/_lib/anchors"
import { breadcrumb, cardsOf, postDate, termLinks } from "@/app/main-page/_lib/content/pages"
import { postPeeks } from "@/app/main-page/_lib/content/peeks"
import { getSource } from "@/app/main-page/_lib/content/source"
import { COLUMN_SIZES, COVER } from "@/app/main-page/_lib/media"
import { pageHref } from "@/app/main-page/_lib/routes"
import type { Locale } from "@/i18n/config"
import { postPageSchema } from "@/lib/page-schema"
import { formatReadingTime, getRelatedPosts, type Post } from "@/lib/posts"
import { AUTHOR } from "@/lib/site"

/**
 * Wpis: okruszki, tytuł z opisem (jak każda podstrona), data, czas lektury
 * i kategorie, okładka, treść w kolumnie (`article.css`), spis rozdziałów
 * w prawym torze (po lewej zostaje menu główne), tagi i autor, wezwanie do
 * rozmowy i „Czytaj dalej”. Zdjęcia autora świadomie nie ma.
 */
export async function PostPage({ post, locale }: { post: Post; locale: Locale }) {
  const { common, copy: mainPage, pages } = getSource(locale)
  const copy = pages.blog
  const { frontmatter } = post
  const { content, headings } = await renderArticle(post.content, locale)
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
    <PeekProvider peeks={postPeeks(related)} closeLabel={mainPage.ui.closeCard}>
      <JsonLd data={postPageSchema(locale, post)} />
      <article>
        <PageHeader
          breadcrumb={breadcrumb(locale, frontmatter.title, [
            { label: copy.breadcrumbBlog, href: pageHref("blog", locale) },
          ])}
          title={frontmatter.title}
          lead={frontmatter.description}
          variant="article"
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
        {/* Ostatnia w „harmonijce”: zasłona odsłania okładkę, a kadr osiada (`uncover`) —
            obraz maluje się od razu, więc LCP wpisu liczy się od pierwszej klatki. */}
        <Cover className="column mt-10">
          <div className="uncover overflow-hidden rounded-2xl [--uncover-delay:var(--enter-media)]">
            <Image
              src={frontmatter.image}
              alt=""
              width={COVER.width}
              height={COVER.height}
              sizes={COLUMN_SIZES}
              preload
              fetchPriority="high"
              className="aspect-video w-full bg-muted object-cover motion-safe:animate-settle motion-safe:[animation-delay:var(--enter-media)]"
            />
          </div>
          {frontmatter.imageCaption && (
            <figcaption className="mt-2.5 text-sm text-muted-foreground motion-safe:animate-enter motion-safe:[animation-delay:calc(var(--enter-media)+300ms)]">
              {frontmatter.imageCaption}
            </figcaption>
          )}
        </Cover>

        {/* Spis rozdziałów poniżej 1280 px (w torze go nie ma): natywne `details` — działa bez JS,
            zwinięty nie zabiera miejsca nad treścią. Od 1280 px ten sam spis stoi w prawym torze. */}
        {chapters.length > 2 && (
          <details className="group/toc column mt-10 xl:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border px-4 text-sm font-medium outline-none hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              {common.ui.tableOfContents}
              <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-open/toc:rotate-180" />
            </summary>
            <ol className="mt-2 grid gap-0.5 px-1">
              {chapters.map((chapter) => (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    className="flex min-h-11 items-center rounded-lg px-3 text-sm text-muted-foreground outline-none hover:bg-accent/50 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring"
                  >
                    {chapter.label}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        )}

        {/* Spis w prawym torze: w DOM po nagłówku i okładce — Tab idzie od tytułu, nie przez
            cały spis. W torze nic nie zabiera, więc stoi od pierwszego rozdziału; nad treścią
            (telefon, `details` wyżej) — od trzech, krótszy nie jest wart rozwijania. */}
        {chapters.length > 0 && (
          <TableOfContents label={common.ui.tableOfContents} sections={chapters} />
        )}
        {/* Treść objęta spisem (`data-toc-scope`) — za jej końcem spis w torze się chowa. */}
        <div data-toc-scope="" className="column mt-12">
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
