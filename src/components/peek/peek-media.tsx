"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import type { Media } from "@/lib/types"
import { useReducedMotion } from "@/lib/hooks"
import { playInView } from "@/lib/video"
import { cn } from "@/lib/utils"

/**
 * Kadr w naturalnych proporcjach materiału (`aspect-ratio` z wymiarów plakatu,
 * bez mierzenia): plakat od razu, klip dopiero przy `play` — wideo nie pobiera
 * się przy samym przewijaniu, a gra tylko w kadrze. Przy „ogranicz ruch”
 * zostaje plakat.
 * `max-h` z zewnątrz przycina zbyt wysoki kadr (`object-cover`, od góry).
 */
export function PeekMedia({
  media,
  play = false,
  ratio = `${media.width} / ${media.height}`,
  sizes,
  onDemand = false,
  priority = false,
  className,
}: {
  media: Media
  play?: boolean
  /** Klip włączony przyciskiem przez użytkownika — gra także przy „ogranicz ruch”. */
  onDemand?: boolean
  /** Kadr w pierwszym ekranie (LCP): bez leniwego ładowania, z wysokim priorytetem. */
  priority?: boolean
  /** Proporcje kadru — domyślnie naturalne; miniatury w mozaice mają stałe. */
  ratio?: string
  sizes: string
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  const video = useRef<HTMLVideoElement>(null)
  const playing = play && Boolean(media.video) && (onDemand || !reducedMotion)

  useEffect(() => {
    const player = video.current
    if (!playing || !player) return
    return playInView(player)
  }, [playing])

  return (
    <div
      data-peek-media=""
      style={{ aspectRatio: ratio }}
      className={cn("relative w-full overflow-hidden rounded-xl bg-muted", className)}
    >
      <Image
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        preload={priority}
        fetchPriority={priority ? "high" : undefined}
        className="size-full object-cover object-top"
      />
      {playing && (
        <video
          ref={video}
          src={media.video}
          poster={media.src}
          muted
          loop
          playsInline
          autoPlay
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-top"
        />
      )}
    </div>
  )
}
