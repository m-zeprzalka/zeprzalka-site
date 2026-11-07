"use client"

import { useState } from "react"
import { ArrowUpRightIcon, PauseIcon, PlayIcon } from "lucide-react"
import { PeekMedia } from "@/app/main-page/_components/peek/peek-media"
import { Button } from "@/app/main-page/_components/ui/button"
import { workAnchor } from "@/app/main-page/_lib/anchors"
import { useReducedMotion } from "@/app/main-page/_lib/hooks"
import { HALF_COLUMN_SIZES } from "@/app/main-page/_lib/media"
import { noOrphans } from "@/app/main-page/_lib/text"
import type { Work } from "@/app/main-page/_lib/types"

/**
 * Kafel galerii portfolio: kadr w naturalnych proporcjach, pod nim nazwa,
 * kategoria i opis; strona realizacji — jako link z nazwy. Klip gra tylko na
 * żądanie (WCAG 2.2.2): najechanie myszą to podgląd na czas najechania, przycisk
 * (dotyk, klawiatura) włącza i wyłącza odtwarzanie. Plik pobiera się dopiero
 * wtedy, a poza kadrem klip stoi (`PeekMedia`). Kotwica `#realizacja-…` —
 * z wiersza startu prowadzi wprost do kafla.
 */
export function GalleryTile({
  work,
  labels,
  priority = false,
}: {
  work: Work
  labels: { newTab: string; play: string; pause: string }
  /** Pierwszy kafel w pierwszym ekranie — kandydat na LCP. */
  priority?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  /** Zatrzymane przyciskiem w trakcie najechania — podgląd nie wraca, dopóki kursor nie zjedzie. */
  const [stopped, setStopped] = useState(false)
  const [playing, setPlaying] = useState(false)
  const reducedMotion = useReducedMotion()
  const video = Boolean(work.media.video)
  // Podgląd po najechaniu to ruch sam z siebie — przy „ogranicz ruch” zostaje tylko przycisk.
  const live = playing || (hovered && !stopped && !reducedMotion)

  return (
    <figure id={workAnchor(work.slug)} className="mb-8 break-inside-avoid">
      <div
        className="relative"
        onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={() => {
          setHovered(false)
          setStopped(false)
        }}
      >
        <PeekMedia
          media={work.media}
          play={video && live}
          onDemand={playing}
          priority={priority}
          sizes={HALF_COLUMN_SIZES}
        />
        {video && (
          <Button
            variant="media"
            size="icon"
            onClick={() => {
              setStopped(live)
              setPlaying(!live)
            }}
            // Nazwa z tytułem — piętnaście przycisków nie brzmi jednakowo.
            aria-label={`${live ? labels.pause : labels.play}: ${work.title}`}
            className="absolute right-2.5 bottom-2.5"
          >
            {live ? <PauseIcon /> : <PlayIcon />}
          </Button>
        )}
      </div>
      <figcaption className="mt-3 grid gap-0.5 text-sm">
        {work.url ? (
          <a
            href={work.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-1 font-medium underline-offset-4 hover:underline"
          >
            {work.title}
            <ArrowUpRightIcon className="size-3.5 text-muted-foreground" />
            <span className="sr-only">({labels.newTab})</span>
          </a>
        ) : (
          <span className="font-medium">{work.title}</span>
        )}
        <span className="text-muted-foreground">{work.category}</span>
        {work.description && (
          <span className="mt-1 text-pretty text-muted-foreground">
            {noOrphans(work.description)}
          </span>
        )}
      </figcaption>
    </figure>
  )
}
