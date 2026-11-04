"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { preload } from "react-dom"
import { useInViewOnce } from "@/hooks/use-in-view"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

/**
 * Zapętlony kadr realizacji.
 *
 * - Poster jest w HTML z serwera (`preload="none"`) — kafel ma obraz od razu,
 *   bez czekania na JavaScript; na `/portfolio` to element LCP.
 * - Plik wideo dostaje dopiero kafel 200 px przed kadrem, a gra tylko ten,
 *   który naprawdę jest w kadrze — poza nim pauza (mniej dekodowania i baterii).
 * - `play()` woła efekt po zatwierdzeniu `src` — wcześniej przeglądarka
 *   przerywała odtwarzanie nowym ładowaniem i kafle w pierwszym ekranie stały.
 * - Przy „ogranicz ruch” wideo w ogóle nie rusza.
 * - Wideo jest dekoracyjne — tytuł i kategorię niosą nakładki (`children`).
 */
export function LazyVideo({
  src,
  poster,
  priority = false,
  className,
  children,
}: {
  src: string
  poster: string
  /** Pierwsze kafle `/portfolio`: poster pobierany z wysokim priorytetem. */
  priority?: boolean
  className?: string
  children?: ReactNode
}) {
  if (priority) preload(poster, { as: "image", fetchPriority: "high" })

  const [frameRef, near] = useInViewOnce<HTMLDivElement>("200px 0px")
  const ref = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting))
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = ref.current
    if (!video || !near) return
    if (visible && !reducedMotion) video.play().catch(() => {})
    else video.pause()
  }, [near, visible, reducedMotion])

  return (
    <div ref={frameRef} className={className}>
      <video
        ref={ref}
        src={near ? src : undefined}
        poster={poster}
        // Dopóki kafel jest daleko — nic. Blisko kadru — metadane (wymiary
        // filmu ustalają wysokość kafla także wtedy, gdy wideo nie gra).
        preload={near ? "metadata" : "none"}
        aria-hidden="true"
        className="block h-full w-full object-cover"
        loop
        muted
        playsInline
      />
      {children}
    </div>
  )
}
