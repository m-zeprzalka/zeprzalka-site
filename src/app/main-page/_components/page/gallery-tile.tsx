"use client"

import { useState } from "react"
import { ArrowUpRightIcon, PauseIcon, PlayIcon } from "lucide-react"
import { PeekMedia } from "@/app/main-page/_components/peek/peek-media"
import { Button } from "@/app/main-page/_components/ui/button"
import { workAnchor } from "@/app/main-page/_lib/anchors"
import { useReducedMotion } from "@/app/main-page/_lib/hooks"
import { HALF_COLUMN_SIZES } from "@/app/main-page/_lib/media"
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
}: {
  work: Work
  labels: { newTab: string; play: string; pause: string }
}) {
  const [hovered, setHovered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const reducedMotion = useReducedMotion()
  const video = Boolean(work.media.video) && !reducedMotion

  return (
    <figure id={workAnchor(work.slug)} className="mb-8 break-inside-avoid">
      <div
        className="relative"
        onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <PeekMedia
          media={work.media}
          play={video && (playing || hovered)}
          sizes={HALF_COLUMN_SIZES}
        />
        {video && (
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? labels.pause : labels.play}
            aria-pressed={playing}
            className="absolute right-2.5 bottom-2.5 bg-background/70"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
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
          <span className="mt-1 text-pretty text-muted-foreground">{work.description}</span>
        )}
      </figcaption>
    </figure>
  )
}
