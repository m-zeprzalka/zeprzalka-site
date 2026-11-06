"use client"

import { useEffect, useRef, useState } from "react"
import { PauseIcon, PlayIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { createGlyphReveal } from "@/app/main-page/_lib/glyph-reveal"
import { cn } from "@/lib/utils"

const POSTER = "/hero-poster.webp"

type Phase = "print" | "reveal" | "done"

/**
 * Duże wideo startu: kadr rodzi się jako druk ze znaków i odsłania się
 * w wideo (`glyph-reveal.ts`). Do czasu startu skryptu stoi szkielet z kropek
 * w CSS — bez JS (`<noscript>`) i przy „ogranicz ruch” od razu plakat.
 * Zapętlony ruch ma przycisk pauzy (WCAG 2.2.2).
 */
export function HeroVideo({ labels }: { labels: { play: string; pause: string } }) {
  const video = useRef<HTMLVideoElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<Phase>("print")
  const [playing, setPlaying] = useState(false)
  // „Ogranicz ruch”: bez druku i bez autoodtwarzania — od razu plakat z przyciskiem.
  const reducedMotion = useReducedMotion()
  const shown: Phase = reducedMotion ? "done" : phase

  useEffect(() => {
    const surface = canvas.current
    const player = video.current
    if (!surface || !player || reducedMotion) return

    let reveal: ReturnType<typeof createGlyphReveal> = null
    let cancelled = false
    const poster = new Image()
    poster.src = POSTER
    poster
      .decode()
      .then(() => {
        if (cancelled) return
        reveal = createGlyphReveal(surface, poster)
        if (!reveal) return setPhase("done")
        setPhase("reveal")
        player.play().catch(() => {})
        reveal.play(() => setPhase("done"))
      })
      .catch(() => setPhase("done"))

    return () => {
      cancelled = true
      reveal?.stop()
    }
  }, [reducedMotion])

  const toggle = () => {
    const player = video.current
    if (!player) return
    if (player.paused) player.play().catch(() => {})
    else player.pause()
  }

  return (
    <div className="motion-safe:animate-enter relative mt-12 aspect-video overflow-hidden rounded-2xl bg-[#0b0b0b] motion-safe:[animation-delay:340ms]">
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

      {/* Szkielet do pierwszej klatki druku: siatka kropek na czerni. */}
      <div
        aria-hidden="true"
        data-hero-skeleton=""
        className={cn(
          "absolute inset-0 bg-[#0b0b0b] bg-[radial-gradient(circle,rgb(255_255_255/0.28)_1.2px,transparent_1.6px)] bg-size-[11px_11px] transition-opacity duration-300",
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
