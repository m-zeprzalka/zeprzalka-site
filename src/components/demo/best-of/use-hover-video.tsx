"use client"

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react"
import { useReducedMotion } from "../forma/use-in-view"
import { cn } from "../forma/cn"

interface HoverVideo {
  handlers: {
    onPointerEnter?: (event: PointerEvent) => void
    onPointerLeave?: () => void
  }
  element: ReactNode
}

/**
 * Wideo karty (wzór: `esencja/use-hover-video.tsx`): plik ładuje się dopiero
 * przy pierwszym najechaniu myszą. Klatka wideo zastępuje plakat dopiero, gdy
 * naprawdę gra (bez czarnego mignięcia), po zjechaniu wraca plakat. Na dotyku
 * i przy „ogranicz ruch” — nic (sam plakat; wideo gra w podglądzie).
 */
export function useHoverVideo(src: string | undefined): HoverVideo {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [armed, setArmed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (hovered) video.play().catch(() => {})
    else video.pause()
  }, [hovered, armed])

  if (!src || reduced) return { handlers: {}, element: null }

  const handlers = {
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      setArmed(true)
      setHovered(true)
    },
    onPointerLeave: () => {
      setHovered(false)
      setPlaying(false)
    },
  }

  const element = armed ? (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      className={cn(
        "absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-[300ms,700ms] ease-fm-snap group-hover:scale-[1.035]",
        playing && hovered ? "opacity-100" : "opacity-0"
      )}
    />
  ) : null

  return { handlers, element }
}
