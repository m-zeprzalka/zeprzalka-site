"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import { useReducedMotion } from "../forma/use-in-view"
import { cn } from "../forma/cn"

/**
 * Wideo karty: plik ładuje się dopiero przy pierwszym najechaniu myszą
 * (albo gdy rodzic uzna kartę za aktywną — na dotyku gra ta najbliżej środka
 * ekranu). Klatka wideo zastępuje plakat dopiero, gdy naprawdę gra (bez
 * czarnego mignięcia), po zjechaniu wraca plakat. „Ogranicz ruch”: nic.
 */
export function useHoverVideo(
  src: string | undefined,
  { className, active = false }: { className?: string; active?: boolean } = {}
) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [armed, setArmed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const on = hovered || active
  // Aktywna karta (dotyk) ładuje plik od razu — bez czekania na najechanie.
  const loaded = armed || active

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (on) video.play().catch(() => {})
    else video.pause()
  }, [on, loaded])

  if (!src || reduced) return { handlers: {}, element: null }

  const handlers = {
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      setArmed(true)
      setHovered(true)
    },
    onPointerLeave: () => {
      setHovered(false)
      if (!active) setPlaying(false)
    },
  }

  const element = loaded ? (
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
        "absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-[300ms,700ms] ease-fm-snap",
        playing && on ? "opacity-100" : "opacity-0",
        className
      )}
    />
  ) : null

  return { handlers, element }
}
