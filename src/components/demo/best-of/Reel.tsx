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

/** Zapas skali startowej — narożniki kadru są na pewno poza ekranem. */
const COVER_MARGIN = 1.04
/** Odstęp treści następnej sekcji od lecącego kadru (px). */
const CLEARANCE = 16
/** Krzywa zoomu — ta sama co `--bo-ease-scroll` w CSS. */
const EASE = [0.6, 0, 0.3, 1] as const

/** Wartość krzywej Béziera (x → y) — bisekcja po parametrze. */
function bezier(x: number, [x1, y1, x2, y2]: readonly [number, number, number, number]) {
  const at = (t: number, a: number, b: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3
  let lo = 0
  let hi = 1
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (at(mid, x1, x2) < x) lo = mid
    else hi = mid
  }
  return at((lo + hi) / 2, y1, y2)
}

/**
 * Najkrótsze „przytrzymanie” po zoomie, przy którym treść następnej sekcji
 * (wjeżdżająca od dołu, z własnym odstępem `pad`) nigdy nie najedzie na kadr,
 * który jeszcze maleje. Zwykle wychodzi 0 — przypięcie kończy się dokładnie
 * wtedy, gdy kadr dojdzie do siatki.
 */
function holdFor(half: number, scale: number, shrink: number, pad: number) {
  let hold = 0
  for (let step = 0; step <= 40; step++) {
    const u = step / 40
    const overshoot = half * (scale - 1) * (1 - bezier(u, EASE))
    hold = Math.max(hold, overshoot - shrink * (1 - u) - pad + CLEARANCE)
  }
  return Math.ceil(hold)
}

/**
 * Reel z hero — zoom OUT. Scena jest przypięta (sticky) na czas przewinięcia:
 * kadr ma wymiary docelowe (szerokość kontenera, proporcja wideo), a na starcie
 * jest powiększony tak, że wypełnia cały ekran. Przewijanie (CSS, nazwana oś
 * czasu widoku sekcji) zmniejsza go do kadru w siatce (telefon: 4:5 pod
 * nagłówkiem). Skala to jedyna animowana własność — chodzi na kompozytorze.
 * Tutaj liczymy raz na zmianę rozmiaru: skalę startową (`--bo-s`), ewentualne
 * „przytrzymanie” po zoomie (`--bo-hold`, zwykle 0 — przypięcie kończy się,
 * gdy kadr dojdzie do siatki) i to, ile następna sekcja ma wjechać pod kadr
 * (`--bo-dock`) — jej nagłówek nadjeżdża od dołu jeszcze w trakcie zoomu. Bez wsparcia osi czasu i przy „ogranicz ruch”
 * kadr po prostu stoi w siatce.
 *
 * Wideo: plakat od razu, plik dopiero blisko kadru, gra tylko w kadrze,
 * widoczna pauza (WCAG 2.2.2). Przy „ogranicz ruch” stoi na plakacie.
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
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [stopped, setStopped] = useState<boolean | null>(null)
  const paused = stopped ?? reduced

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const frame = frameRef.current
    if (!section || !stage || !frame) return
    section.setAttribute("data-ready", "")
    const dock = section.nextElementSibling as HTMLElement | null
    const measure = () => {
      const width = stage.clientWidth
      const height = stage.clientHeight
      const fw = frame.offsetWidth
      const fh = frame.offsetHeight
      if (!fw || !fh) return
      // Kadr docelowy: na desktopie na środku sceny, na telefonie pod pigułką nagłówka.
      const center = frame.offsetTop + fh / 2
      const scale =
        Math.max(width / fw, (2 * Math.max(center, height - center)) / fh) * COVER_MARGIN
      const below = Math.max(0, height - (frame.offsetTop + fh))
      const shrink =
        (parseFloat(getComputedStyle(section).getPropertyValue("--bo-shrink")) * height) / 100
      const pad = dock ? parseFloat(getComputedStyle(dock).paddingTop) : 0
      section.style.setProperty("--bo-s", scale.toFixed(4))
      // Pauza stoi w rogu ekranu, póki kadr go wypełnia, i zjeżdża razem z kadrem do jego rogu.
      section.style.setProperty("--bo-dx", `${((width - fw) / 2).toFixed(1)}px`)
      section.style.setProperty("--bo-dy", `${below.toFixed(1)}px`)
      section.style.setProperty("--bo-hold", `${holdFor(fh / 2, scale, shrink || 0, pad)}px`)
      // Następna sekcja wjeżdża pod kadr jeszcze w trakcie przypięcia — po odpięciu stoi tuż pod nim.
      dock?.style.setProperty("--bo-dock", `${Math.round(below)}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
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
    nearby.observe(stage)
    inView.observe(stage)
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
    <section ref={sectionRef} aria-label={labels.region} className="bo-reel">
      <div ref={stageRef} className="bo-reel__stage">
        <div
          ref={frameRef}
          className="bo-reel__frame relative overflow-hidden bg-fm-fill shadow-fm-ring"
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
        <div className="bo-reel__overlay">
          <button
            type="button"
            onClick={() => setStopped(!paused)}
            aria-label={paused ? labels.play : labels.pause}
            title={paused ? labels.play : labels.pause}
            className={cn(
              "bo-reel__pause pointer-events-auto absolute right-3 bottom-3 grid size-11 fm-press place-items-center rounded-full fm-focus sm:right-4 sm:bottom-4",
              "bg-black/45 text-white shadow-[inset_0_0_0_1px_oklch(1_0_0/0.14)] backdrop-blur-md transition-[background-color,scale] hover:bg-black/60 focus-visible:outline-white"
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
