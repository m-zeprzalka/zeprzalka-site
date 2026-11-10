import Link from "next/link"
import { CtaPanel } from "@/components/page/cta-panel"
import { INDEX_ROW } from "@/components/page/index-row"
import { PageHeader } from "@/components/page/page-header"
import { JsonLd } from "@/components/seo/json-ld"
import { PAGE_SECTION } from "@/lib/anchors"
import { breadcrumb, categoryLinks } from "@/lib/content/pages"
import { getSource } from "@/lib/content/source"
import { pageHref } from "@/lib/routes"
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
      <CtaPanel
        id={PAGE_SECTION.cooperation}
        heading={common.postCta.title}
        body={common.postCta.description}
        actions={[
          { label: common.postCta.primary, href: pageHref("contact", locale) },
          { label: common.postCta.secondary, href: pageHref("services", locale) },
        ]}
      />
    </>
  )
}
