import { getCategoryCounts } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PageHeader } from "@/components/PageHeader"
import { categoryPath, type Locale } from "@/i18n/config"
import { getPages } from "@/i18n/content/pages"

export function CategoryIndexView({ locale }: { locale: Locale }) {
  const copy = getPages(locale).blog
  const categories = getCategoryCounts(locale)

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <PageHeader
        badge={copy.categoriesBadge}
        title={copy.categoriesTitle}
        description={copy.categoriesDescription}
      />

      <div className="flex flex-wrap gap-3">
        {categories.map(({ slug, label, count }) => (
          <Link key={slug} href={categoryPath(locale, slug)}>
            <Badge
              variant="outline"
              className="text-sm px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer gap-2"
            >
              {label}
              <span className="text-muted-foreground font-normal">{count}</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}
