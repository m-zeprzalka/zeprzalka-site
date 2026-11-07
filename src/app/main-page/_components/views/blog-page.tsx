import { FeaturedPost } from "@/app/main-page/_components/page/featured-post"
import { PageHeader } from "@/app/main-page/_components/page/page-header"
import { Pager } from "@/app/main-page/_components/page/pager"
import { PostIndex } from "@/app/main-page/_components/page/post-index"
import { Section } from "@/app/main-page/_components/page/section"
import { TermLinks } from "@/app/main-page/_components/page/term-links"
import { PeekProvider } from "@/app/main-page/_components/peek/peek-context"
import { PeekStage } from "@/app/main-page/_components/peek/peek-stage"
import { JsonLd } from "@/app/main-page/_components/seo/json-ld"
import { blogPage } from "@/app/main-page/_lib/content/blog"
import { breadcrumb, categoryLinks } from "@/app/main-page/_lib/content/pages"
import { postPeeks } from "@/app/main-page/_lib/content/peeks"
import { getSource } from "@/app/main-page/_lib/content/source"
import { blogPageHref, pageHref } from "@/app/main-page/_lib/routes"
import type { Locale } from "@/i18n/config"
import { fill, formatDate } from "@/i18n/format"
import { blogIndexSchema } from "@/lib/page-schema"

/**
 * Blog i kolejne strony archiwum: kategorie pod nagłówkiem, na pierwszej
 * stronie dwa wyróżnione wpisy z okładkami, potem indeks wpisów (okładka na
 * marginesie przy najechaniu) i strony archiwum.
 */
export function BlogPage({ locale, page = 1 }: { locale: Locale; page?: number }) {
  const { copy: mainPage, pages } = getSource(locale)
  const copy = pages.blog
  const { current, total, visible, featured, posts } = blogPage(locale, page)
  const title = current === 1 ? copy.title : fill(copy.pageTitle, { current })
  const trail =
    current === 1 ? [] : [{ label: copy.breadcrumbBlog, href: pageHref("blog", locale) }]

  return (
    <PeekProvider peeks={postPeeks(posts)}>
      <JsonLd data={blogIndexSchema(locale, current, visible)} />
      <PageHeader
        breadcrumb={breadcrumb(locale, current === 1 ? copy.breadcrumbBlog : title, trail)}
        title={title}
        lead={copy.description}
      >
        <TermLinks terms={categoryLinks(locale)} label={copy.categoriesTitle} />
      </PageHeader>

      {featured.length > 0 && (
        <Section id="wyroznione" title={copy.featuredHeading}>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 sm:gap-6">
            {featured.map(({ card, description }, index) => (
              <FeaturedPost
                key={card.slug}
                post={card}
                description={description}
                date={formatDate(card.iso, locale)}
                priority={index === 0}
              />
            ))}
          </div>
        </Section>
      )}

      <Section
        id="wpisy"
        title={copy.allHeading}
        lead={total > 1 ? fill(copy.pageOf, { current, total }) : undefined}
      >
        <PostIndex posts={posts} newLabel={mainPage.ui.newPost} />
      </Section>
      <Pager
        current={current}
        total={total}
        href={(n) => blogPageHref(locale, n)}
        labels={{ aria: copy.paginationAria, previous: copy.previousPage, next: copy.nextPage }}
      />
      <PeekStage />
    </PeekProvider>
  )
}
