"use client"

import { useEffect, useRef, useState } from "react"
import { preload } from "react-dom"
import { Pause, Play } from "lucide-react"
import { useReducedMotion } from "../forma/use-in-view"
import { cn } from "../forma/cn"

interface ReelVideo {
  webm: string
  mp4: string
  poster: string
  width: number
  height: number
}

/** Margines boczny `fm-container` (clamp z theme.css) przeliczony na piksele. */
function gutter(viewport: number) {
  return Math.min(32, Math.max(16, 8 + viewport * 0.025))
}

/**
 * Kadr z reelem pod hero. Element ma pełną szerokość okna (minus 12 px),
 * a na starcie jest zeskalowany do szerokości kontenera treści; przewijanie
 * (CSS, oś czasu strony) rozpręża go do pełnej szerokości. Skala to jedyna
 * animowana własność — chodzi na kompozytorze. Proporcję startową liczymy
 * tu raz na zmianę rozmiaru okna i oddajemy CSS-owi przez zmienną.
 *
 * Wideo: plakat od razu, plik dopiero blisko kadru, gra tylko w kadrze,
 * widoczna pauza (WCAG 2.2.2). Przy „ogranicz ruch” stoi na plakacie.
 */
export function Reel({
  video,
  labels,
}: {
  video: ReelVideo
  labels: { pause: string; play: string; fallback: string }
}) {
  // Plakat to pierwszy duży obraz strony — pobierany razem z dokumentem.
  preload(video.poster, { as: "image", fetchPriority: "high" })
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [stopped, setStopped] = useState<boolean | null>(null)
  // Bez decyzji użytkownika: gra, chyba że system prosi o ograniczenie ruchu.
  const paused = stopped ?? reduced

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const measure = () => {
      const viewport = document.documentElement.clientWidth
      const container = Math.min(viewport - 2 * gutter(viewport), 1200)
      const from = Math.min(1, container / frame.offsetWidth)
      frame.style.setProperty("--es-reel-from", from.toFixed(4))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true)
          nearby.disconnect()
        }
      },
      { rootMargin: "300px 0px" }
    )
    const inView = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting))
    nearby.observe(frame)
    inView.observe(frame)
    return () => {
      nearby.disconnect()
      inView.disconnect()
    }
  }, [])

  // `play()` dopiero po zatwierdzeniu źródła (wzór z LazyVideo).
  useEffect(() => {
    const element = videoRef.current
    if (!element || !near) return
    if (visible && !paused) element.play().catch(() => {})
    else element.pause()
  }, [near, visible, paused])

  return (
    <div ref={frameRef} className="es-reel relative">
      <div
        className="relative overflow-hidden rounded-[1.75rem] bg-fm-fill shadow-fm-ring max-sm:rounded-fm-3xl"
        style={{ aspectRatio: `${video.width} / ${video.height}` }}
      >
        <video
          ref={videoRef}
          poster={video.poster}
          preload="none"
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          {near && <source src={video.webm} type="video/webm" />}
          {near && <source src={video.mp4} type="video/mp4" />}
          {labels.fallback}
        </video>
      </div>
      <button
        type="button"
        onClick={() => setStopped(!paused)}
        aria-label={paused ? labels.play : labels.pause}
        className={cn(
          "absolute right-3 bottom-3 grid size-11 fm-press place-items-center rounded-full fm-focus sm:right-5 sm:bottom-5",
          "bg-black/45 text-white shadow-[inset_0_0_0_1px_oklch(1_0_0/0.14)] backdrop-blur-md transition-[background-color,scale] hover:bg-black/60"
        )}
      >
        {paused ? (
          <Play className="size-4 fill-current" />
        ) : (
          <Pause className="size-4 fill-current" />
        )}
      </button>
    </div>
  )
}
