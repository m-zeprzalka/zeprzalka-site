"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Plus } from "lucide-react"
import type { DemoWork } from "@/components/demo/shared/content"
import { useVisible } from "./hooks"

/**
 * Kafel realizacji. Podpis (tytuł i kategoria) stoi zawsze pod kadrem —
 * dziś jest tylko na hover, więc na telefonie nie ma go wcale (dług nr 5).
 *
 * Wideo gra wyłącznie myszą: pod kursorem albo z fokusem klawiatury, plik
 * dostaje dopiero kafel 300 px przed ekranem, a `play()` woła efekt po
 * zatwierdzeniu `src` (wzór z `LazyVideo`). Na dotyku siatka to plakaty
 * z małym znakiem „wideo” — film gra duży w podglądzie po dotknięciu.
 * Dzięki temu nic nie rusza się samo (WCAG 2.2.2 bez osobnego przycisku
 * pauzy) i telefon nie pobiera kilkunastu klipów przy przewijaniu.
 */
export function WorkTile({
  work,
  fine,
  paused,
  reduced,
  onOpen,
  onIntent,
}: {
  work: DemoWork
  fine: boolean
  /** Otwarty podgląd — kafel pod spodem nie gra. */
  paused: boolean
  reduced: boolean
  onOpen: (trigger: HTMLButtonElement) => void
  /** Pierwsze zbliżenie kursora albo fokus — czas na pobranie dialogu. */
  onIntent: () => void
}) {
  const mediaRef = useRef<HTMLSpanElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const near = useVisible(mediaRef, { rootMargin: "300px 0px" })
  const [hovered, setHovered] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const shouldPlay = fine && hovered && !paused && !reduced

  // Raz pobrany plik zostaje — kafel nie gubi wideo po wyjechaniu z kadru.
  if (fine && work.video && (near || hovered) && !loaded) setLoaded(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !loaded) return
    if (shouldPlay) video.play().catch(() => {})
    else video.pause()
  }, [loaded, shouldPlay])

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      data-work={work.slug}
      onClick={(event) => onOpen(event.currentTarget)}
      onPointerEnter={(event) => {
        onIntent()
        if (event.pointerType === "mouse") setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => {
        onIntent()
        if (event.currentTarget.matches(":focus-visible")) setHovered(true)
      }}
      onBlur={() => setHovered(false)}
      className="re-tile group block w-full rounded-fm-xl text-left fm-focus sm:rounded-fm-2xl"
    >
      <span
        ref={mediaRef}
        data-work-media={work.slug}
        className="re-tile__media block"
        style={{ aspectRatio: `${work.width} / ${work.height}` }}
      >
        {work.video ? (
          <video
            ref={videoRef}
            src={loaded ? work.video : undefined}
            poster={work.poster}
            preload={loaded ? "metadata" : "none"}
            width={work.width}
            height={work.height}
            aria-hidden="true"
            muted
            loop
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- plakat w kadrze o znanych wymiarach; next/image nie daje tu nic poza dodatkowym węzłem
          <img
            src={work.poster}
            alt=""
            width={work.width}
            height={work.height}
            loading="lazy"
            decoding="async"
          />
        )}
        {work.video && (
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-2 hidden size-6 place-items-center rounded-full bg-black/45 text-white ring-1 ring-white/15 backdrop-blur-md pointer-coarse:grid"
          >
            <Play className="size-2.5 translate-x-px fill-current" />
          </span>
        )}
      </span>
      <span className="mt-2.5 flex items-start justify-between gap-3 px-0.5 sm:mt-3.5 sm:gap-4 sm:px-1">
        <span className="min-w-0">
          <span className="block text-sm leading-snug font-medium tracking-[-0.01em] text-pretty sm:text-base">
            {work.title}
          </span>
          <span className="mt-0.5 block text-xs text-fm-ink-3 sm:text-sm">{work.category}</span>
        </span>
        <span
          aria-hidden="true"
          className="re-tile__arrow mt-0.5 hidden size-7 shrink-0 place-items-center rounded-full text-fm-ink-2 shadow-fm-ring sm:grid"
        >
          <Plus className="size-3.5" />
        </span>
      </span>
    </button>
  )
}
