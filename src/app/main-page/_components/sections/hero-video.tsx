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

/**
 * Plakat (pierwsza klatka klipu) — LCP strony; `next/image` podaje go w rozmiarze kadru
 * (AVIF/WebP). Dokładnie 16:9 jak kadr: przy innych proporcjach `object-cover` przycina go
 * o ułamek piksela, a wtedy pierwsza klatka wideo (pełny kadr) wypierała plakat jako LCP
 * o 0,6 s później. Plik osobny — `hero-poster.webp` (1080×606) należy do starej strony.
 */
const POSTER = { src: "/hero-poster-16x9.webp", width: 1072, height: 603 } as const

/**
 * `cover` — plakat pod zasłoną (do startu frontu; canvas wjeżdża i składa znaki nad nią),
 * `front` — front odsłania wideo spod druku, `done` — kadr odsłonięty.
 */
type Phase = "cover" | "front" | "done"

/**
 * Duże wideo startu — ostatnie w „harmonijce”: czarny druk wjeżdża z dołu, składa
 * się ze znaków sygnetu, stoi chwilę i odsłania się frontem w wideo (`glyph-reveal.ts`).
 *
 * Ruch niesie sam canvas, a plakat stoi nieruchomo pod zasłoną w kolorze tła
 * (`data-hero-cover`) od pierwszego malowania: przeglądarka liczy LCP od tej chwili
 * (zasłanianie się nie liczy), a pierwsza klatka wideo ma ten sam rozmiar, więc nie
 * wypiera plakatu. Kadr z `opacity` w animacji wejścia dawał LCP ok. 2,5 s zamiast 0,2 s.
 * Bez JS (`<noscript>`) i przy „ogranicz ruch” od razu plakat. Zapętlony ruch ma
 * przycisk pauzy (WCAG 2.2.2) i gra tylko w kadrze. Plakat to obraz pod wideo
 * (`next/image` z `preload` i wysokim priorytetem, w rozmiarze kadru), bo atrybut
 * `poster` nie zna `srcset`.
 */
export function HeroVideo({ labels }: { labels: { play: string; pause: string } }) {
  const video = useRef<HTMLVideoElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const still = useRef<HTMLImageElement>(null)
  const [phase, setPhase] = useState<Phase>("cover")
  const [playing, setPlaying] = useState(false)
  /** Pauza z przycisku — powrót w kadr nie wznawia wtedy klipu. */
  const pausedByUser = useRef(false)
  const reducedMotion = useReducedMotion()
  const shown: Phase = reducedMotion ? "done" : phase

  useEffect(() => {
    const surface = canvas.current
    const player = video.current
    const poster = still.current
    if (!surface || !player || !poster || reducedMotion) return

    let reveal: Awaited<ReturnType<typeof createGlyphReveal>> = null
    let cancelled = false
    let stopWatching = () => {}
    // Składanie rusza przy ok. 30% wjazdu druku — znaki pojawiają się, gdy czarny kadr
    // jest już widoczny, a nie w pustym miejscu przed nim.
    const entered = new Promise<void>((resolve) => {
      const [enter] = surface.getAnimations()
      const timing = enter?.effect?.getComputedTiming()
      if (!enter || !timing) return resolve()
      const at = Number(timing.delay ?? 0) + Number(timing.duration ?? 0) * 0.3
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
        await entered
        if (cancelled || !reveal) return
        reveal.play({
          // Wideo rusza pod drukiem razem z frontem — odsłania się już w ruchu.
          // Druk jest już w całości kryjący — zasłona schodzi, a front odsłania wideo spod znaków.
          onFront: () => {
            setPhase("front")
            player.play().catch(() => {})
            stopWatching = playInView(player, () => pausedByUser.current)
          },
          onDone: () => setPhase("done"),
        })
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
    <div className="relative mt-12 aspect-video overflow-hidden rounded-2xl">
      <Image
        ref={still}
        src={POSTER.src}
        alt=""
        width={POSTER.width}
        height={POSTER.height}
        sizes={COLUMN_SIZES}
        preload
        fetchPriority="high"
        // Narożniki o 2 px obszerniejsze niż kadr: antyaliasowany łuk kadru przykrywa wtedy
        // sama zasłona, a plakat nie prześwituje cienkim łukiem przed wejściem druku.
        className="absolute inset-0 size-full rounded-[calc(var(--radius-2xl)+2px)] object-cover"
      />
      {/* Zasłona w kolorze tła: kadr jest „niczym”, dopóki nie wjedzie druk — plakat pod nią
          maluje się od razu (LCP). Tuż nad plakatem, pod wideo i canvasem (warstwami
          kompozytora): plakat i zasłona przycina wtedy ta sama zaokrąglona krawędź, więc plakat
          nie prześwituje obrysem kadru. „Ogranicz ruch” — plakat od pierwszego malowania, bez JS. */}
      <div
        aria-hidden="true"
        data-hero-cover=""
        className={cn(
          "absolute inset-0 bg-background motion-reduce:hidden",
          shown !== "cover" && "hidden"
        )}
      />
      {/* Bez `poster`: pod spodem stoi obraz w rozmiarze kadru; pierwsza klatka klipu go zakrywa. */}
      <video
        ref={video}
        data-hero-video=""
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        // `scale-[0.999]` (0,35 px na krawędź, niewidoczne): bez tego pierwsza klatka wideo
        // bywała dla przeglądarki większym kandydatem LCP niż plakat i przesuwała LCP na ok. 3 s.
        className="relative size-full scale-[0.999] object-cover"
      >
        <source src="/hero_web.webm" type="video/webm" />
        <source src="/hero_web.mp4" type="video/mp4" />
      </video>

      <noscript>
        {/* Bez JS: sam plakat — Chrome pokazałby nad nim pusty odtwarzacz z kontrolkami. */}
        <style>{"[data-hero-cover],[data-hero-video]{display:none}"}</style>
      </noscript>
      {/* Czarny druk wjeżdża z dołu i rośnie do pełnego kadru — ostatni w „harmonijce”. */}
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={cn(
          "absolute inset-0 size-full motion-safe:animate-enter-media motion-safe:[animation-delay:var(--enter-media)]",
          shown === "done" && "hidden"
        )}
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
