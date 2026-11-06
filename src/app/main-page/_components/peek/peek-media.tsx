"use client"

import Image from "next/image"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import type { Media } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"

/**
 * Kadr karty: plakat od razu, a klip (jeśli jest i `play`) dopiero wtedy,
 * gdy karta jest widoczna — wideo nie pobiera się przy samym przewijaniu.
 * Przy „ogranicz ruch” zostaje plakat.
 */
export function PeekMedia({
  media,
  play = false,
  sizes,
  className,
}: {
  media: Media
  play?: boolean
  sizes: string
  className?: string
}) {
  const reducedMotion = useReducedMotion()

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-muted", className)}>
      <Image
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        className="size-full object-cover"
      />
      {play && media.video && !reducedMotion && (
        <video
          src={media.video}
          poster={media.src}
          muted
          loop
          playsInline
          autoPlay
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </div>
  )
}
