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
  priorityCount = 0,
  className,
}: {
  items: PortfolioItem[]
  locale: Locale
  /** Ile pierwszych kafli to kandydaci na LCP (tylko gdy siatka stoi w pierwszym ekranie). */
  priorityCount?: number
  className?: string
}) {
  return (
    <div className={cn("columns-1 gap-4 md:columns-2 lg:columns-3", className)}>
      {items.map((item, index) => (
        <PortfolioCard
          key={item.slug}
          item={item}
          locale={locale}
          priority={index < priorityCount}
        />
      ))}
    </div>
  )
}
