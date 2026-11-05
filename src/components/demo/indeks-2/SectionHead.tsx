"use client"

import { useRef } from "react"
import { cn } from "@/components/demo/forma/cn"
import { GlyphText } from "./glyph"
import { triggerFor, useArmed } from "./use-armed"

/**
 * Nagłówek sekcji w jednej linii: tytuł atramentem, pauza i dalszy ciąg
 * małą literą w szarości („Kompetencje — umiejętności, które…”). Tytuł
 * dekoduje się ze znaków tylko wtedy, gdy wchodzi w okno z dołu; widoczny
 * przy załadowaniu zostaje czytelny. Szerokość tytułu trzyma niewidoczna
 * kopia (z kerningiem) — dekodowanie nie przesuwa dopisku po pauzie.
 */
export function SectionHead({
  id,
  title,
  lead,
  className,
}: {
  id: string
  title: string
  lead?: string
  className?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const armed = useArmed(ref)
  return (
    <h2
      ref={ref}
      id={id}
      tabIndex={-1}
      data-anchor-focus=""
      className={cn("text-fm-body leading-snug font-medium text-pretty outline-none", className)}
    >
      <span className="relative inline-block whitespace-nowrap">
        <span aria-hidden="true" className="invisible">
          {title}
        </span>
        <GlyphText
          text={title}
          trigger={triggerFor(armed)}
          className="absolute inset-y-0 start-0 text-fm-ink"
        />
      </span>
      {lead && <span className="text-fm-ink-3"> — {lead}</span>}
    </h2>
  )
}
