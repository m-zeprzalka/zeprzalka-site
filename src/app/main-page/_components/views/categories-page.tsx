import Link from "next/link"
import { INDEX_ROW } from "@/app/main-page/_components/page/index-row"
import { PageHeader } from "@/app/main-page/_components/page/page-header"
import { JsonLd } from "@/app/main-page/_components/seo/json-ld"
import { breadcrumb, categoryLinks } from "@/app/main-page/_lib/content/pages"
import { getSource } from "@/app/main-page/_lib/content/source"
import { pageHref } from "@/app/main-page/_lib/routes"
import type { Locale } from "@/i18n/config"
import { plural } from "@/i18n/format"
import { categoryIndexSchema } from "@/lib/page-schema"

/** Kategorie bloga jako indeks: nazwa i liczba wpisów, od najliczniejszej. */
export function CategoriesPage({ locale }: { locale: Locale }) {
  const { common, pages } = getSource(locale)
  const copy = pages.blog

  return (
    <>
      <JsonLd data={categoryIndexSchema(locale)} />
      <PageHeader
        breadcrumb={breadcrumb(locale, copy.categoriesTitle, [
          { label: copy.breadcrumbBlog, href: pageHref("blog", locale) },
        ])}
        title={copy.categoriesTitle}
        lead={copy.categoriesDescription}
      />
      <ul className="column mt-14 grid">
        {categoryLinks(locale).map((category) => (
          <li key={category.href}>
            <Link href={category.href} className={INDEX_ROW}>
              {category.label}
              <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                {plural(category.count, locale, common.plurals.articles)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
