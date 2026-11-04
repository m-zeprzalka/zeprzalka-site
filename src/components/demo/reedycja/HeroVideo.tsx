"use client"

import { useEffect, useRef, useState } from "react"
import { preload } from "react-dom"
import { Pause, Play } from "lucide-react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { cn } from "@/components/demo/forma/cn"
import { useVisible } from "./hooks"

/** Margines kadru po rozrośnięciu — od krawędzi okna, nie kontenera. */
const BLEED = 20

/**
 * Reel z obecnego hero w dopracowanym kadrze: pierścień zamiast twardej
 * krawędzi i przycisk pauzy. W spoczynku kadr ma dokładnie szerokość
 * kontenera (krawędzie w linii z tekstem); przewijanie rozciąga go ponad
 * kontener, do szerokości okna minus 20 px (CSS `scroll()`, `.re-reel`).
 * Skalę docelową i zapas miejsca pod kadrem liczy ten komponent przy zmianie
 * rozmiaru okna — CSS nie umie podzielić długości przez długość.
 *
 * Przycisk pauzy — zapętlony ruch dłuższy niż 5 s musi dać się zatrzymać
 * (WCAG 2.2.2, dług nr 1). Poza kadrem wideo stoi; przy „ogranicz ruch”
 * nie rusza samo — zostaje plakat i przycisk „Odtwórz”.
 */
export function HeroVideo({
  video,
  fallback,
}: {
  video: DemoHomeContent["hero"]["video"]
  fallback: string
}) {
  preload(video.poster, { as: "image", fetchPriority: "high" })
  const frameRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLVideoElement>(null)
  const visible = useVisible(frameRef)
  const reduced = useReducedMotion()
  // `null` — użytkownik jeszcze nie zdecydował; wtedy decyduje „ogranicz ruch”.
  const [choice, setChoice] = useState<"play" | "pause" | null>(null)
  const wantsPlay = choice ? choice === "play" : !reduced
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    function measure() {
      if (!frame) return
      // offsetWidth/offsetHeight to wymiary z układu — skala z animacji ich nie zmienia.
      const width = frame.offsetWidth
      const grow = Math.max(1, (document.documentElement.clientWidth - 2 * BLEED) / width)
      frame.style.setProperty("--re-grow", grow.toFixed(4))
      frame.style.setProperty("--re-grow-space", `${Math.round((grow - 1) * frame.offsetHeight)}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (visible && wantsPlay) node.play().catch(() => {})
    else node.pause()
  }, [visible, wantsPlay])

  const label = playing ? "Wstrzymaj wideo" : "Odtwórz wideo"

  return (
    <div
      ref={frameRef}
      className="re-reel relative aspect-video origin-top overflow-hidden rounded-fm-2xl bg-fm-fill shadow-fm-card sm:rounded-fm-3xl lg:rounded-fm-4xl"
    >
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        poster={video.poster}
        width={video.width}
        height={video.height}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 size-full object-cover"
      >
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
        {fallback}
      </video>
      {/* Opakowanie przejmuje przeciwną skalę kadru — przycisk zachowuje 40 px i swój nacisk. */}
      <div className="re-reel__control absolute right-3 bottom-3 sm:right-5 sm:bottom-5">
        <button
          type="button"
          onClick={() => setChoice(playing ? "pause" : "play")}
          aria-label={label}
          title={label}
          className={cn(
            "grid size-10 fm-press place-items-center rounded-full",
            "bg-black/45 text-white ring-1 ring-white/15 fm-focus backdrop-blur-md transition-[background-color,scale] hover:bg-black/60",
            "focus-visible:outline-white"
          )}
        >
          {playing ? (
            <Pause aria-hidden="true" className="size-4 fill-current" />
          ) : (
            <Play aria-hidden="true" className="size-4 translate-x-px fill-current" />
          )}
        </button>
      </div>
    </div>
  )
}
