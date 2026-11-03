import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { LazyVideo } from "@/components/portfolio/LazyVideo"
import type { Locale } from "@/i18n/config"
import type { PortfolioItem } from "@/lib/portfolio"

/**
 * Kafel realizacji — zajawka na stronie głównej i strona `/portfolio`.
 * Komponent serwerowy: kliencki jest tylko kadr wideo (`LazyVideo`),
 * a nakładki z tytułem i kategorią przychodzą z serwera jako jego dzieci.
 */
export function PortfolioCard({
  item,
  locale,
  priority = false,
}: {
  item: PortfolioItem
  locale: Locale
  /** Kafel w pierwszym ekranie strony — poster jako kandydat na LCP. */
  priority?: boolean
}) {
  return (
    <Card className="group relative mb-4 break-inside-avoid overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <LazyVideo
        src={item.video}
        poster={item.poster}
        priority={priority}
        // `-my-6` znosi `py-6` z `Card` (z `py-0` zaokrąglenia wysokości kafli różnią się o 1 px).
        className="relative -my-6 aspect-video w-full bg-muted/30"
      >
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="px-3 py-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            {item.category[locale]}
          </Badge>
        </div>
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 translate-y-2 p-4 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="text-lg font-medium text-white">{item.title[locale]}</h3>
        </div>
      </LazyVideo>
    </Card>
  )
}
