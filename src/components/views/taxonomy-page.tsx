import { CtaPanel } from "@/components/page/cta-panel"
import { PageHeader } from "@/components/page/page-header"
import { PostIndex } from "@/components/page/post-index"
import { TermLinks } from "@/components/page/term-links"
import { PeekProvider } from "@/components/peek/peek-context"
import { PeekStage } from "@/components/peek/peek-stage"
import { JsonLd } from "@/components/seo/json-ld"
import { PAGE_SECTION } from "@/lib/anchors"
import { breadcrumb, cardsOf, categoryLinks } from "@/lib/content/pages"
import { postPeeks } from "@/lib/content/peeks"
import { getSource } from "@/lib/content/source"
import { categoryHref, pageHref } from "@/lib/routes"
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
  const { common, copy: strings, pages } = getSource(locale)
  const copy = pages.blog
  const isCategory = field === "categories"
  const posts = cardsOf(locale, term.posts)
  const count = plural(term.posts.length, locale, common.plurals.articles)
  const title = isCategory ? term.label : `#${term.label}`

  return (
    <PeekProvider peeks={postPeeks(posts)} closeLabel={strings.ui.closeCard}>
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
        <PostIndex posts={posts} newLabel={strings.ui.newPost} />
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
