import { FeaturedPost } from "@/components/page/featured-post"
import { PageHeader } from "@/components/page/page-header"
import { Pager } from "@/components/page/pager"
import { PostIndex } from "@/components/page/post-index"
import { Section } from "@/components/page/section"
import { TermLinks } from "@/components/page/term-links"
import { PeekProvider } from "@/components/peek/peek-context"
import { PeekStage } from "@/components/peek/peek-stage"
import { JsonLd } from "@/components/seo/json-ld"
import { PAGE_SECTION } from "@/lib/anchors"
import { blogPage } from "@/lib/content/blog"
import { breadcrumb, categoryLinks, postDate } from "@/lib/content/pages"
import { postPeeks } from "@/lib/content/peeks"
import { getSource } from "@/lib/content/source"
import { blogPageHref, pageHref } from "@/lib/routes"
import type { Locale } from "@/i18n/config"
import { fill } from "@/i18n/format"
import { blogIndexSchema } from "@/lib/page-schema"

/**
 * Blog i kolejne strony archiwum: kategorie pod nagłówkiem, na pierwszej
 * stronie dwa wyróżnione wpisy z okładkami, potem indeks wpisów (okładka na
 * marginesie przy najechaniu) i strony archiwum.
 */
export function BlogPage({ locale, page = 1 }: { locale: Locale; page?: number }) {
  const { copy: strings, pages } = getSource(locale)
  const copy = pages.blog
  const { current, total, visible, featured, posts } = blogPage(locale, page)
  const title = current === 1 ? copy.title : fill(copy.pageTitle, { current })
  const trail =
    current === 1 ? [] : [{ label: copy.breadcrumbBlog, href: pageHref("blog", locale) }]

  return (
    <PeekProvider peeks={postPeeks(posts)} closeLabel={strings.ui.closeCard}>
      <JsonLd data={blogIndexSchema(locale, current, visible)} />
      <PageHeader
        breadcrumb={breadcrumb(locale, current === 1 ? copy.breadcrumbBlog : title, trail)}
        title={title}
        lead={copy.description}
      >
        <TermLinks terms={categoryLinks(locale)} label={copy.categoriesTitle} />
      </PageHeader>

      {featured.length > 0 && (
        <Section id={PAGE_SECTION.featured} title={copy.featuredHeading}>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 sm:gap-6">
            {featured.map(({ card, description }, index) => (
              <FeaturedPost
                key={card.slug}
                post={card}
                description={description}
                date={postDate(locale, card.iso)}
                priority={index === 0}
              />
            ))}
          </div>
        </Section>
      )}

      <Section
        id={PAGE_SECTION.posts}
        title={copy.allHeading}
        lead={total > 1 ? fill(copy.pageOf, { current, total }) : undefined}
      >
        <PostIndex posts={posts} newLabel={strings.ui.newPost} />
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
