"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { preload } from "react-dom"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

/**
 * Zapętlony kadr realizacji.
 *
 * - Poster jest w HTML z serwera (`preload="none"`) — kafel ma obraz od razu,
 *   bez czekania na JavaScript; na `/portfolio` to element LCP.
 * - Plik wideo dostaje dopiero kafel 200 px przed kadrem, a gra tylko ten,
 *   który jest widoczny — poza kadrem pauza (mniej dekodowania i baterii).
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

  const ref = useRef<HTMLVideoElement>(null)
  const [requested, setRequested] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting) setRequested(true)
        const visible = entry.intersectionRatio > 0
        if (visible && !reducedMotion) video.play().catch(() => {})
        else video.pause()
      },
      { rootMargin: "200px 0px", threshold: [0, 0.01] }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <div className={className}>
      <video
        ref={ref}
        src={requested ? src : undefined}
        poster={poster}
        // Dopóki kafel jest daleko — nic. Blisko kadru — metadane (wymiary
        // filmu ustalają wysokość kafla także wtedy, gdy wideo nie gra).
        preload={requested ? "metadata" : "none"}
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
