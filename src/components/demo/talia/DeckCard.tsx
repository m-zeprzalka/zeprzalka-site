"use client"

import { ViewTransition } from "react"
import { cn } from "../forma/cn"
import { CardMedia } from "./CardMedia"
import { morphName, useTalia } from "./TaliaProvider"
import type { Origin, Project } from "./types"

/**
 * Karta talii: „karta w karcie” — powierzchnia z promieniem 24 px, w niej
 * kadr 18 px (24 − 6 px odstępu, promienie koncentryczne) i podpis.
 * Kadr jest wspólnym elementem przejścia: po kliknięciu wylatuje do dialogu,
 * a w karcie zostaje jego miękka sylwetka — talia pamięta, skąd go wyjęto.
 */
export function DeckCard({
  project,
  origin,
  active,
  sizes,
  zoom = false,
  hero = false,
  className,
}: {
  project: Project
  origin: Origin
  active: boolean
  sizes: string
  /** Przybliżenie kadru przy najechaniu (rodzic z klasą `group`). */
  zoom?: boolean
  hero?: boolean
  className?: string
}) {
  const { open } = useTalia()
  const pulled = open?.origin === origin && open.slug === project.slug

  return (
    <span
      className={cn(
        "flex aspect-[4/5] flex-col rounded-fm-3xl bg-fm-surface p-1.5 text-left shadow-fm-card",
        className
      )}
    >
      {pulled ? (
        <span className="block flex-1 rounded-[1.125rem] bg-fm-fill shadow-[inset_0_0_0_1px_var(--fm-edge)]" />
      ) : (
        <ViewTransition name={morphName(origin, project.slug)} share="talia-morph" default="none">
          <CardMedia
            poster={project.poster}
            video={project.video}
            active={active}
            sizes={sizes}
            zoom={zoom}
            hero={hero}
            className="flex-1 rounded-[1.125rem]"
          />
        </ViewTransition>
      )}
      <span className="flex flex-col gap-0.5 px-2 pt-2.5 pb-1">
        <span className="truncate text-[0.8125rem] leading-tight font-medium tracking-[-0.01em]">
          {project.title}
        </span>
        <span className="truncate text-xs leading-tight text-fm-ink-3">{project.category}</span>
      </span>
    </span>
  )
}
