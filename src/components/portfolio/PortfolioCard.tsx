import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { LazyVideo } from "@/components/portfolio/LazyVideo"
import type { Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import type { PortfolioItem } from "@/lib/portfolio"
import { cn } from "@/lib/utils"

/** Zrzuty serwisów (produkty bez wideo) mają stały kadr 1200 × 750 (16:10). */
const STILL = { width: 1200, height: 750 }

/**
 * Kafel realizacji — zajawka na stronie głównej i strona `/portfolio`.
 * Komponent serwerowy: kliencki jest tylko kadr wideo (`LazyVideo`); produkt
 * bez wideo pokazuje zrzut przez `next/image`. Nakładki (kategoria, tytuł,
 * opis) są wspólne; kafel z adresem prowadzi do działającego serwisu.
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
  // `-my-6` znosi `py-6` z `Card` (z `py-0` zaokrąglenia wysokości kafli różnią się o 1 px).
  const frame = cn("relative -my-6 w-full bg-muted/30")
  const reveal = cn(
    "opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
  )

  const overlays = (
    <>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent",
          reveal
        )}
      />
      <div className="pointer-events-none absolute top-3 left-3">
        <Badge variant="secondary" className={cn("px-3 py-1", reveal)}>
          {item.category[locale]}
        </Badge>
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 translate-y-2 p-4 opacity-0 transition-[opacity,translate] duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="text-lg font-medium text-white">
          {item.url ? (
            // Link rozciągnięty na cały kafel; nazwa dostępna mówi, że otworzy nową kartę.
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {item.title[locale]}
              <span className="sr-only"> ({getCommon(locale).ui.newTab})</span>
            </a>
          ) : (
            item.title[locale]
          )}
        </h3>
        {item.description && (
          <p className="mt-1 text-sm text-white/80">{item.description[locale]}</p>
        )}
      </div>
    </>
  )

  return (
    <Card className="group relative mb-4 break-inside-avoid overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      {item.video ? (
        <LazyVideo
          src={item.video}
          poster={item.poster}
          priority={priority}
          className={cn(frame, "aspect-video")}
        >
          {overlays}
        </LazyVideo>
      ) : (
        <div className={frame}>
          <Image
            src={item.poster}
            alt=""
            {...STILL}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            preload={priority}
            className="block h-auto w-full"
          />
          {overlays}
        </div>
      )}
    </Card>
  )
}
