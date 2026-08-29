import { PortfolioCard } from "./PortfolioCard"
import type { PortfolioItem } from "@/lib/portfolio"
import { cn } from "@/lib/utils"
import type { Locale } from "@/i18n/config"

/**
 * Siatka masonry — te same klasy kolumn, które miała zajawka na stronie
 * głównej. Używają jej obie strony i obie wersje językowe.
 */
export function PortfolioGrid({
  items,
  locale,
  className,
}: {
  items: PortfolioItem[]
  locale: Locale
  className?: string
}) {
  return (
    <div className={cn("columns-1 md:columns-2 lg:columns-3 gap-4", className)}>
      {items.map((item) => (
        <PortfolioCard key={item.slug} item={item} locale={locale} />
      ))}
    </div>
  )
}
