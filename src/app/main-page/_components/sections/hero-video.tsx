"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { PauseIcon, PlayIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"
import { createGlyphReveal } from "@/app/main-page/_lib/glyph-reveal"
import { COLUMN_SIZES } from "@/app/main-page/_lib/media"
import { playInView } from "@/app/main-page/_lib/video"
import { useReducedMotion } from "@/app/main-page/_lib/hooks"
import { cn } from "@/lib/utils"

/** Plakat (pierwsza klatka klipu) — LCP strony; `next/image` podaje go w rozmiarze kadru (AVIF/WebP). */
const POSTER = { src: "/hero-poster.webp", width: 1080, height: 606 } as const

type Phase = "print" | "reveal" | "done"

/**
 * Duże wideo startu — ostatnie w „harmonijce”: kadr wyostrza się z rozmycia (bez
 * `opacity` — to kadr LCP, liczony od pierwszego malowania), rodzi
 * się jako druk ze znaków i odsłania się w wideo (`glyph-reveal.ts`). Do startu
 * skryptu stoi szkielet z kropek w CSS; bez JS (`<noscript>`) i przy „ogranicz
 * ruch” od razu plakat. Zapętlony ruch ma przycisk pauzy (WCAG 2.2.2) i gra
 * tylko w kadrze. Plakat to LCP strony: obraz pod wideo (`next/image` z `preload` i wysokim
 * priorytetem, w rozmiarze kadru), bo atrybut `poster` nie zna `srcset`.
 */
export function HeroVideo({ labels }: { labels: { play: string; pause: string } }) {
  const frame = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const still = useRef<HTMLImageElement>(null)
  const [phase, setPhase] = useState<Phase>("print")
  const [playing, setPlaying] = useState(false)
  /** Pauza z przycisku — powrót w kadr nie wznawia wtedy klipu. */
  const pausedByUser = useRef(false)
  const reducedMotion = useReducedMotion()
  const shown: Phase = reducedMotion ? "done" : phase

  useEffect(() => {
    const box = frame.current
    const surface = canvas.current
    const player = video.current
    const poster = still.current
    if (!box || !surface || !player || !poster || reducedMotion) return

    let reveal: Awaited<ReturnType<typeof createGlyphReveal>> = null
    let cancelled = false
    let stopWatching = () => {}
    // Front rusza przy ok. 60% wejścia kadru — druk nie stoi martwo, a odsłanianie nie
    // dzieje się jeszcze w rozmytym kadrze.
    const entered = new Promise<void>((resolve) => {
      const [enter] = box.getAnimations()
      const timing = enter?.effect?.getComputedTiming()
      if (!enter || !timing) return resolve()
      const at = Number(timing.delay ?? 0) + Number(timing.duration ?? 0) * 0.6
      setTimeout(resolve, Math.max(0, at - Number(enter.currentTime ?? 0)))
    })
    // Rozmiar kadru z `ResizeObserver` — bez wymuszonego układu tuż po hydratacji.
    const size = new Promise<DOMRectReadOnly>((resolve) => {
      const observer = new ResizeObserver(([entry]) => {
        observer.disconnect()
        if (entry) resolve(entry.contentRect)
      })
      observer.observe(surface)
    })

    Promise.all([poster.decode(), size])
      .then(async ([, rect]) => {
        if (cancelled) return
        reveal = await createGlyphReveal(surface, poster, rect.width, rect.height)
        if (cancelled) return
        if (!reveal) return setPhase("done")
        setPhase("reveal")
        await entered
        if (cancelled || !reveal) return
        player.play().catch(() => {})
        stopWatching = playInView(player, () => pausedByUser.current)
        reveal.play(() => setPhase("done"))
      })
      .catch(() => setPhase("done"))

    return () => {
      cancelled = true
      reveal?.stop()
      stopWatching()
      // Włączone „ogranicz ruch” w trakcie wizyty: od razu plakat, bez pętli.
      player.pause()
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
      className="@container relative mt-12 aspect-video overflow-hidden rounded-2xl bg-print motion-safe:animate-sharpen motion-safe:[animation-delay:480ms]"
    >
      <Image
        ref={still}
        src={POSTER.src}
        alt=""
        width={POSTER.width}
        height={POSTER.height}
        sizes={COLUMN_SIZES}
        preload
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
      />
      {/* Bez `poster`: pod spodem stoi obraz w rozmiarze kadru; pierwsza klatka klipu go zakrywa. */}
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="relative size-full object-cover"
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
        variant="media"
        size="icon"
        onClick={toggle}
        // Przed odsłonięciem przycisk jest niewidoczny — i poza kolejnością Tab.
        inert={shown !== "done"}
        aria-label={playing ? labels.pause : labels.play}
        className={cn(
          "absolute right-3 bottom-3 transition-opacity",
          shown !== "done" && "pointer-events-none opacity-0"
        )}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </Button>
    </div>
  )
}
