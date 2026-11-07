import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react"
import type { Peek } from "@/app/main-page/_lib/types"
import { PeekMedia } from "./peek-media"

/**
 * Treść karty podglądu — ten sam wygląd na marginesie i w popoverze. Pierwszy
 * kadr w naturalnych proporcjach (gra tylko on), kolejne jako miniatury, pod
 * nimi podpis, opis albo oś czasu i link.
 */
export function PeekCard({
  peek,
  play,
  inStage = false,
  onNavigate,
}: {
  peek: Peek
  play: boolean
  /** Kliknięcie linku karty (popover zamyka się, zamiast wisieć nad przewiniętą stroną). */
  onNavigate?: () => void
  /** W torze (`aria-hidden`) link jest tylko dla myszy — poza kolejnością Tab. */
  inStage?: boolean
}) {
  const [first, ...rest] = peek.media

  return (
    <div className="grid">
      {first && (
        <div className="grid gap-1 p-1">
          <PeekMedia
            media={first}
            play={play}
            sizes="(min-width: 80rem) 24rem, 100vw"
            className="max-h-[min(55svh,26rem)]"
          />
          {rest.length > 0 && (
            <div className="grid grid-cols-2 gap-1 [&>:last-child:nth-child(odd)]:col-span-2">
              {rest.map((media) => (
                <PeekMedia key={media.src} media={media} ratio="4 / 3" sizes="12rem" />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-2 px-4 pt-3 pb-4">
        <div className="grid gap-0.5">
          <p className="font-medium text-pretty">{peek.title}</p>
          {peek.meta && <p className="text-sm text-muted-foreground tabular-nums">{peek.meta}</p>}
        </div>

        {peek.body && <p className="text-sm text-pretty text-muted-foreground">{peek.body}</p>}

        {peek.timeline && (
          <dl className="grid gap-3 pt-1 text-sm">
            {peek.timeline.map((entry) => (
              <div key={entry.role} className="grid gap-0.5">
                <dt className="text-xs text-muted-foreground tabular-nums">{entry.period}</dt>
                <dd>
                  <p className="text-pretty">{entry.role}</p>
                  <p className="text-muted-foreground">{entry.company}</p>
                </dd>
              </div>
            ))}
          </dl>
        )}

        {peek.link && (
          <a
            href={peek.link.href}
            tabIndex={inStage ? -1 : undefined}
            onClick={onNavigate}
            {...(peek.link.external && { target: "_blank", rel: "noopener noreferrer" })}
            className="-mx-2 mt-1 flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            {peek.link.label}
            {peek.link.newTab && <span className="sr-only">({peek.link.newTab})</span>}
            {/* ↗ tylko dla linku zewnętrznego (nowa karta), jak w stopce; wewnętrzny — →. */}
            {peek.link.external ? (
              <ArrowUpRightIcon className="size-4 text-muted-foreground" />
            ) : (
              <ArrowRightIcon className="size-4 text-muted-foreground" />
            )}
          </a>
        )}
      </div>
    </div>
  )
}
