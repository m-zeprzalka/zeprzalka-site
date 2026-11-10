import { CtaPanel } from "@/app/main-page/_components/page/cta-panel"
import { PageHeader } from "@/app/main-page/_components/page/page-header"
import { PostIndex } from "@/app/main-page/_components/page/post-index"
import { TermLinks } from "@/app/main-page/_components/page/term-links"
import { PeekProvider } from "@/app/main-page/_components/peek/peek-context"
import { PeekStage } from "@/app/main-page/_components/peek/peek-stage"
import { JsonLd } from "@/app/main-page/_components/seo/json-ld"
import { PAGE_SECTION } from "@/app/main-page/_lib/anchors"
import { breadcrumb, cardsOf, categoryLinks } from "@/app/main-page/_lib/content/pages"
import { postPeeks } from "@/app/main-page/_lib/content/peeks"
import { getSource } from "@/app/main-page/_lib/content/source"
import { categoryHref, pageHref } from "@/app/main-page/_lib/routes"
import type { Locale } from "@/i18n/config"
import { fill, plural } from "@/i18n/format"
import { taxonomySchema } from "@/lib/page-schema"
import type { TaxonomyField, Term } from "@/lib/posts"

/** Kategoria albo tag: ta sama lista wpisów, inne okruszki i opis. */
export function TaxonomyPage({
  locale,
  field,
  term,
}: {
  locale: Locale
  field: TaxonomyField
  term: Term
}) {
  const { common, copy: mainPage, pages } = getSource(locale)
  const copy = pages.blog
  const isCategory = field === "categories"
  const posts = cardsOf(locale, term.posts)
  const count = plural(term.posts.length, locale, common.plurals.articles)
  const title = isCategory ? term.label : `#${term.label}`

  return (
    <PeekProvider peeks={postPeeks(posts)} closeLabel={mainPage.ui.closeCard}>
      <JsonLd data={taxonomySchema(locale, field, term)} />
      <PageHeader
        breadcrumb={breadcrumb(locale, title, [
          { label: copy.breadcrumbBlog, href: pageHref("blog", locale) },
          ...(isCategory
            ? [{ label: copy.categoriesTitle, href: pageHref("categories", locale) }]
            : []),
        ])}
        title={title}
        lead={fill(isCategory ? copy.inCategory : copy.withTag, { count })}
      >
        {/* Rodzeństwo kategorii z wyróżnioną bieżącą — strona nie jest ślepą uliczką. */}
        {isCategory && (
          <TermLinks
            terms={categoryLinks(locale)}
            label={copy.categoriesTitle}
            current={categoryHref(locale, term.slug)}
          />
        )}
      </PageHeader>
      <div className="column mt-10">
        <PostIndex posts={posts} newLabel={mainPage.ui.newPost} />
      </div>
      <CtaPanel
        id={PAGE_SECTION.cooperation}
        heading={common.postCta.title}
        body={common.postCta.description}
        actions={[
          { label: common.postCta.primary, href: pageHref("contact", locale) },
          { label: common.postCta.secondary, href: pageHref("services", locale) },
        ]}
      />
      <PeekStage />
    </PeekProvider>
  )
}
