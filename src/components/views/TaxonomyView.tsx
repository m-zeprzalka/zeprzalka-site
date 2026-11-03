import { JsonLd } from "@/components/JsonLd"
import { PageHeader } from "@/components/PageHeader"
import { PostGrid } from "@/components/blog/PostCard"
import { ROUTES, categoryPath, tagPath, type Locale } from "@/i18n/config"
import { getMeta } from "@/i18n/content/meta"
import { getCommon } from "@/i18n/content/common"
import { getPages } from "@/i18n/content/pages"
import { fill, plural } from "@/i18n/format"
import type { TaxonomyField, Term } from "@/lib/posts"
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema"

/** Strona kategorii albo tagu — ta sama lista, inna odznaka i opis. */
export function TaxonomyView({
  locale,
  field,
  term,
}: {
  locale: Locale
  field: TaxonomyField
  term: Term
}) {
  const copy = getPages(locale).blog
  const isCategory = field === "categories"
  const count = plural(term.posts.length, locale, getCommon(locale).plurals.articles)
  const meta = getMeta(locale)[isCategory ? "category" : "tag"]
  const path = isCategory ? categoryPath(locale, term.slug) : tagPath(locale, term.slug)
  const name = fill(meta.title, { name: term.label })
  const jsonLd = graph(
    webPageSchema("CollectionPage", locale, {
      name,
      description: fill(meta.description, { name: term.label }),
      path,
    }),
    breadcrumbSchema(locale, [
      { name: copy.breadcrumbBlog, path: ROUTES.blog[locale] },
      ...(isCategory
        ? [{ name: getMeta(locale).categories.title, path: ROUTES.categories[locale] }]
        : []),
      { name, path },
    ])
  )

  return (
    <div className="page-shell">
      <JsonLd data={jsonLd} />
      <PageHeader
        badge={isCategory ? copy.categoryBadge : copy.tagBadge}
        title={isCategory ? term.label : `#${term.label}`}
        description={fill(isCategory ? copy.inCategory : copy.withTag, { count })}
      />
      <PostGrid posts={term.posts} locale={locale} />
    </div>
  )
}
