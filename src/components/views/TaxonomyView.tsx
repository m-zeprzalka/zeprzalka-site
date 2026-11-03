import { PageHeader } from "@/components/PageHeader"
import { PostGrid } from "@/components/blog/PostCard"
import type { Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getPages } from "@/i18n/content/pages"
import { fill, plural } from "@/i18n/format"
import type { TaxonomyField, Term } from "@/lib/posts"

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

  return (
    <div className="page-shell">
      <PageHeader
        badge={isCategory ? copy.categoryBadge : copy.tagBadge}
        title={isCategory ? term.label : `#${term.label}`}
        description={fill(isCategory ? copy.inCategory : copy.withTag, { count })}
      />
      <PostGrid posts={term.posts} locale={locale} />
    </div>
  )
}
