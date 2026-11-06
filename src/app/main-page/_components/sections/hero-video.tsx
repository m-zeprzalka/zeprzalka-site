"use client"

import { useEffect, useRef, useState } from "react"
import { preload } from "react-dom"
import { PauseIcon, PlayIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"
import { createGlyphReveal } from "@/app/main-page/_lib/glyph-reveal"
import { playInView } from "@/app/main-page/_lib/video"
import { useReducedMotion } from "@/app/main-page/_lib/hooks"
import { cn } from "@/lib/utils"

const POSTER = "/hero-poster.webp"

type Phase = "print" | "reveal" | "done"

/**
 * Duże wideo startu — ostatnie w „harmonijce”: kadr wchodzi z rozmycia, rodzi
 * się jako druk ze znaków i odsłania się w wideo (`glyph-reveal.ts`). Do startu
 * skryptu stoi szkielet z kropek w CSS; bez JS (`<noscript>`) i przy „ogranicz
 * ruch” od razu plakat. Zapętlony ruch ma przycisk pauzy (WCAG 2.2.2) i gra
 * tylko w kadrze. Plakat to LCP strony — pobiera się z wyprzedzeniem (`preload`).
 */
export function HeroVideo({ labels }: { labels: { play: string; pause: string } }) {
  const frame = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<Phase>("print")
  const [playing, setPlaying] = useState(false)
  /** Pauza z przycisku — powrót w kadr nie wznawia wtedy klipu. */
  const pausedByUser = useRef(false)
  const reducedMotion = useReducedMotion()
  const shown: Phase = reducedMotion ? "done" : phase

  preload(POSTER, { as: "image", fetchPriority: "high" })

  useEffect(() => {
    const box = frame.current
    const surface = canvas.current
    const player = video.current
    if (!box || !surface || !player || reducedMotion) return

    let reveal: ReturnType<typeof createGlyphReveal> = null
    let cancelled = false
    let stopWatching = () => {}
    const poster = new Image()
    poster.src = POSTER
    // Front rusza dopiero, gdy kadr skończy wejście — inaczej część odsłaniania dzieje się w niewidocznym kadrze.
    const entered = Promise.all(box.getAnimations().map((animation) => animation.finished))

    poster
      .decode()
      .then(() => {
        if (cancelled) return
        reveal = createGlyphReveal(surface, poster)
        if (!reveal) return setPhase("done")
        setPhase("reveal")
        return entered.then(() => {
          if (cancelled || !reveal) return
          player.play().catch(() => {})
          stopWatching = playInView(player, () => pausedByUser.current)
          reveal.play(() => setPhase("done"))
        })
      })
      .catch(() => setPhase("done"))

    return () => {
      cancelled = true
      reveal?.stop()
      stopWatching()
    }
  }, [reducedMotion])

  const toggle = () => {
    const player = video.current
    if (!player) return
    pausedByUser.current = !player.paused
    if (player.paused) player.play().catch(() => {})
    else player.pause()
  }

  return (
    <div
      ref={frame}
      className="@container relative mt-12 aspect-video overflow-hidden rounded-2xl bg-print motion-safe:animate-enter motion-safe:[animation-delay:480ms]"
    >
      <video
        ref={video}
        poster={POSTER}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="size-full object-cover"
      >
        <source src="/hero_web.webm" type="video/webm" />
        <source src="/hero_web.mp4" type="video/mp4" />
      </video>

      {/* Szkielet do pierwszej klatki druku: siatka kropek na czerni, w oczku komórki druku (`cellFor`). */}
      <div
        aria-hidden="true"
        data-hero-skeleton=""
        className={cn(
          "absolute inset-0 bg-print bg-[radial-gradient(circle,rgb(255_255_255/0.28)_1.2px,transparent_1.6px)] bg-size-[11px_11px] transition-opacity duration-300 @max-[30rem]:bg-size-[8px_8px]",
          shown !== "print" && "opacity-0"
        )}
      />
      <noscript>
        <style>{"[data-hero-skeleton]{display:none}"}</style>
      </noscript>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={cn("absolute inset-0 size-full", shown === "done" && "hidden")}
      />

      <Button
        variant="secondary"
        size="icon"
        onClick={toggle}
        // Przed odsłonięciem przycisk jest niewidoczny — i poza kolejnością Tab.
        inert={shown !== "done"}
        aria-label={playing ? labels.pause : labels.play}
        className={cn(
          "absolute right-3 bottom-3 bg-background/70 transition-opacity",
          shown !== "done" && "pointer-events-none opacity-0"
        )}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </Button>
    </div>
  )
}
