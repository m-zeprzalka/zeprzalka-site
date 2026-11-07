import { getTerms } from "@/lib/posts"
import { TermLink } from "@/components/blog/TermLink"
import { JsonLd } from "@/components/JsonLd"
import { PageHeader } from "@/components/PageHeader"
import { categoryPath, type Locale } from "@/i18n/config"
import { getPages } from "@/i18n/content/pages"
import { categoryIndexSchema } from "@/lib/page-schema"

export function CategoryIndexView({ locale }: { locale: Locale }) {
  const copy = getPages(locale).blog
  // Od najliczniejszej; przy remisie zostaje kolejność pierwszego wystąpienia.
  const categories = getTerms(locale, "categories").sort((a, b) => b.posts.length - a.posts.length)

  return (
    <div className="page-shell">
      <JsonLd data={categoryIndexSchema(locale)} />
      <PageHeader
        badge={copy.categoriesBadge}
        title={copy.categoriesTitle}
        description={copy.categoriesDescription}
      />

      <ul className="flex flex-wrap gap-3">
        {categories.map(({ slug, label, posts }) => (
          <li key={slug}>
            <TermLink
              href={categoryPath(locale, slug)}
              className="gap-2 px-4 py-2 text-sm [a&]:hover:bg-primary [a&]:hover:text-primary-foreground"
            >
              {label}
              <span className="font-normal text-muted-foreground">{posts.length}</span>
            </TermLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
