import { getTerms } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PageHeader } from "@/components/PageHeader"
import { categoryPath, type Locale } from "@/i18n/config"
import { getPages } from "@/i18n/content/pages"

export function CategoryIndexView({ locale }: { locale: Locale }) {
  const copy = getPages(locale).blog
  // Od najliczniejszej; przy remisie zostaje kolejność pierwszego wystąpienia.
  const categories = getTerms(locale, "categories").sort((a, b) => b.posts.length - a.posts.length)

  return (
    <div className="page-shell">
      <PageHeader
        badge={copy.categoriesBadge}
        title={copy.categoriesTitle}
        description={copy.categoriesDescription}
      />

      <div className="flex flex-wrap gap-3">
        {categories.map(({ slug, label, posts }) => (
          <Link key={slug} href={categoryPath(locale, slug)}>
            <Badge
              variant="outline"
              className="cursor-pointer gap-2 px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {label}
              <span className="font-normal text-muted-foreground">{posts.length}</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}
