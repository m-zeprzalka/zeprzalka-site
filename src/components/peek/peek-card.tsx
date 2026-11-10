import type { MouseEvent } from "react"
import { XIcon } from "lucide-react"
import { LinkArrow } from "@/components/page/link-arrow"
import { Button } from "@/components/ui/button"
import type { Peek } from "@/lib/types"
import { cn } from "@/lib/utils"
import { PeekMedia } from "./peek-media"

/**
 * Treść karty podglądu — ten sam wygląd na marginesie i w popoverze. Pierwszy
 * kadr w naturalnych proporcjach (gra tylko on), kolejne jako miniatury, pod
 * nimi podpis, opis albo oś czasu i link. Z `onClose` karta ma krzyżyk w prawym
 * górnym rogu — kontrolkę kadru jak przycisk odtwarzania (`variant="media"`,
 * 12 px od krawędzi); karta bez kadru — ten sam okrągły przycisk z obwódką w barwach
 * motywu (`outline`), bo ciemna kontrolka kadru na jasnej karcie byłaby plamą.
 */
export function PeekCard({
  peek,
  play,
  inStage = false,
  onNavigate,
  close,
}: {
  peek: Peek
  play: boolean
  /** Kliknięcie linku karty (popover zamyka się, zamiast wisieć nad przewiniętą stroną). */
  onNavigate?: () => void
  /**
   * W torze (`aria-hidden`) link i krzyżyk są tylko dla myszy: poza kolejnością Tab i bez
   * fokusu po kliknięciu (fokus w warstwie `aria-hidden` ginąłby razem z nią).
   */
  inStage?: boolean
  /** Krzyżyk karty — działanie i nazwa razem (bez nazwy nie ma krzyżyka). */
  close?: { onClose: () => void; label: string }
}) {
  const [first, ...rest] = peek.media
  const mouseOnly = inStage
    ? { tabIndex: -1, onMouseDown: (event: MouseEvent) => event.preventDefault() }
    : {}
  const closeButton = close && (
    <Button
      type="button"
      variant={first ? "media" : "outline"}
      size="icon"
      onClick={close.onClose}
      aria-label={close.label}
      {...mouseOnly}
      // Pole dotyku 44 px (`after:`) przy rysunku 36 px — jak przyciski w nagłówku.
      className={cn(
        "absolute top-3 right-3 z-10 after:absolute after:-inset-1",
        !first && "text-muted-foreground hover:text-foreground"
      )}
    >
      <XIcon />
    </Button>
  )

  return (
    <div className="relative grid">
      {first && (
        <div className="grid gap-1 p-1">
          <div className="relative">
            <PeekMedia
              media={first}
              play={play}
              // W torze karta ma szerokość toru (3/8 kolumny), w popoverze — kolumny albo 24 rem.
              sizes={
                inStage
                  ? "(min-width: 105rem) 18rem, (min-width: 90rem) 16.5rem, 15rem"
                  : "(min-width: 48rem) 24rem, 100vw"
              }
              className="max-h-[min(55svh,26rem)]"
            />
            {closeButton}
          </div>
          {rest.length > 0 && (
            <div className="grid grid-cols-2 gap-1 [&>:last-child:nth-child(odd)]:col-span-2">
              {rest.map((media) => (
                <PeekMedia key={media.src} media={media} ratio="4 / 3" sizes="12rem" />
              ))}
            </div>
          )}
        </div>
      )}
      {!first && closeButton}

      <div className="grid gap-2 px-4 pt-3 pb-4">
        {/* Bez kadru krzyżyk stoi nad tytułem — tytuł kończy się przed nim. */}
        <div className={cn("grid gap-0.5", !first && close && "min-h-9 content-center pe-10")}>
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
            {...mouseOnly}
            onClick={onNavigate}
            {...(peek.link.external && { target: "_blank", rel: "noopener noreferrer" })}
            className="group/link -mx-2 mt-1 flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            {peek.link.label}
            {peek.link.newTab && <span className="sr-only">({peek.link.newTab})</span>}
            <LinkArrow className="text-muted-foreground group-hover/link:text-foreground" />
          </a>
        )}
      </div>
    </div>
  )
}
