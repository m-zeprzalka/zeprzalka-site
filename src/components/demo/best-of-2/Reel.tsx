"use client"

import { useEffect, useRef, useState } from "react"
import { preload } from "react-dom"
import { Pause, Play } from "lucide-react"
import { cn } from "../forma/cn"
import { useReducedMotion } from "../forma/use-in-view"

interface ReelVideo {
  webm: string
  mp4: string
  poster: string
  width: number
  height: number
}

/**
 * Reel z hero — zoom IN do kontenera (właściciel: „może nie powinno zaczynać
 * się od całej szerokości, tylko od mniejszej i dążyć do containera”). Kadr ma
 * w układzie wymiary docelowe (szerokość kontenera, proporcja wideo; telefon
 * 4:5), a na starcie jest pomniejszony od górnej krawędzi — wystaje spod hero.
 * Przewijanie (CSS, oś czasu widoku kadru) powiększa go do siatki, nigdy ponad
 * nią; skala rośnie szybciej, niż kadr wjeżdża, więc pod nim nie ma pustego pasa.
 * Pauza w rogu ma skalę odwrotną — zawsze 44 px.
 *
 * Ostatni krok harmonijki wejścia: kadr rodzi się z kropek. Szkielet (siatka
 * kropek jak w `GlyphMedia` przed startem silnika) stoi od pierwszego malowania,
 * a od 200 ms kropki rosną w obraz (czysty CSS, bez czekania na silnik WebGL —
 * kadr nad zgięciem nie może stać jako szkielet). Wideo dostaje źródło po
 * hydratacji, gra tylko w kadrze, z widoczną pauzą (WCAG 2.2.2); przy
 * „ogranicz ruch” — sam plakat.
 */
export function Reel({
  video,
  labels,
}: {
  video: ReelVideo
  labels: { pause: string; play: string; fallback: string; region: string }
}) {
  // Plakat to pierwszy duży obraz strony — pobierany razem z dokumentem.
  preload(video.poster, { as: "image", fetchPriority: "high" })
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [stopped, setStopped] = useState<boolean | null>(null)
  const paused = stopped ?? reduced

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setNear(true)
        nearby.disconnect()
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
    <section aria-label={labels.region} className="b2-reel fm-container">
      <div className="b2-reel__in">
        <div
          ref={frameRef}
          className="b2-reel__frame b2-dots relative overflow-hidden rounded-(--b2-r-panel) shadow-fm-ring"
        >
          <div className="b2-bloom absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- plakat z `preload` wyżej; next/image dodałby drugi adres */}
            <img
              src={video.poster}
              alt=""
              width={video.width}
              height={video.height}
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 size-full object-cover"
            />
            <video
              ref={videoRef}
              poster={video.poster}
              preload="none"
              muted
              loop
              playsInline
              aria-hidden="true"
              tabIndex={-1}
              className="absolute inset-0 size-full object-cover"
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
            title={paused ? labels.play : labels.pause}
            className={cn(
              "b2-reel__pause absolute end-(--b2-inset-ui) bottom-(--b2-inset-ui) grid size-11 fm-press place-items-center rounded-full fm-focus",
              "bg-black/50 text-white shadow-[inset_0_0_0_1px_oklch(1_0_0/0.14)] transition-[background-color] hover:bg-black/65 focus-visible:outline-white"
            )}
          >
            {paused ? (
              <Play aria-hidden="true" className="size-4 translate-x-px fill-current" />
            ) : (
              <Pause aria-hidden="true" className="size-4 fill-current" />
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
