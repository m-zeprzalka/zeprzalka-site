"use client"

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react"
import Image from "next/image"
import { Pause, Play } from "lucide-react"
import { useReducedMotion } from "../forma/use-in-view"
import type { DemoWork } from "../shared/content"
import { useHoverVideo } from "./use-hover-video"
import { useWorks } from "./WorksProvider"

export interface MarqueeRow {
  /** Nazwa grupy nad rzędem i liczba realizacji w niej. */
  label: string
  count: number
  works: readonly DemoWork[]
  /** Suma proporcji kart (szerokość / wysokość) z odstępami — czas pętli liczy CSS. */
  units: number
  /** Liczba torów w rzędzie (pierwszy + kopie domykające pętlę). */
  copies: number
  reverse?: boolean
}

/** Przytrzymanie dłuższe niż to nie otwiera podglądu — palec chciał tylko zatrzymać pokaz. */
const HOLD_MS = 350

/**
 * Nieskończony pokaz realizacji: dwa rzędy w przeciwnych kierunkach (strony
 * i produkty · wideo). Ruch to CSS (`translate`, poza wątkiem głównym);
 * przewijanie strony chwilowo go przyspiesza (WAAPI `playbackRate`, wygaszane
 * w kolejnych klatkach). Pauza: przycisk (WCAG 2.2.2), najechanie myszą,
 * przytrzymanie palcem. Klik otwiera podgląd. Pokaz to prace cyfrowe
 * (produkty i strony); same plakaty, wideo tylko pod kursorem. Przy
 * „ogranicz ruch” rzędy to zwykłe przewijane listy.
 */
export function Marquee({
  rows,
  labels,
}: {
  rows: readonly MarqueeRow[]
  labels: { region: string; pause: string; play: string }
}) {
  const rootRef = useRef<HTMLElement>(null)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    let animations: Animation[] = []
    let visible = false
    let lastY = window.scrollY
    let lastT = performance.now()
    let rate = 1
    let target = 1
    let frame = 0
    let idle: ReturnType<typeof setTimeout> | undefined

    const tick = () => {
      rate += (target - rate) * 0.08
      if (Math.abs(target - rate) < 0.005) rate = target
      for (const animation of animations) animation.playbackRate = rate
      frame = rate === target && target === 1 ? 0 : requestAnimationFrame(tick)
    }
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const onScroll = () => {
      const now = performance.now()
      const speed = Math.abs(window.scrollY - lastY) / Math.max(8, now - lastT)
      lastY = window.scrollY
      lastT = now
      if (!visible) return
      if (!animations.length) {
        animations = [...root.querySelectorAll(".es-track")].flatMap((track) =>
          track.getAnimations()
        )
      }
      target = 1 + Math.min(speed * 2.4, 3.5)
      clearTimeout(idle)
      idle = setTimeout(() => {
        target = 1
        kick()
      }, 140)
      kick()
    }
    const observer = new IntersectionObserver(([entry]) => (visible = !!entry?.isIntersecting))
    observer.observe(root)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
      clearTimeout(idle)
    }
  }, [reduced])

  // Strzałki w podglądzie przechodzą po realizacjach pokazu.
  const scope = rows.flatMap((row) => row.works.map((work) => work.slug))

  return (
    <section
      ref={rootRef}
      aria-labelledby="es-marquee-title"
      data-paused={paused || undefined}
      className="es-marquee pt-14 sm:pt-20"
    >
      <h2 id="es-marquee-title" className="sr-only">
        {labels.region}
      </h2>
      {rows.map((row, index) => (
        <div key={row.label} className={index > 0 ? "mt-6 sm:mt-8" : undefined}>
          <div className="fm-container mb-3 flex min-h-11 items-center justify-between gap-4 sm:mb-4">
            <h3 className="flex items-baseline gap-2 text-fm-small font-medium text-fm-ink">
              {row.label}
              <span className="text-fm-ink-3 tabular-nums">{row.count}</span>
            </h3>
            {index === 0 && (
              <button
                type="button"
                onClick={() => setPaused(!paused)}
                className="group -me-3 inline-flex h-11 fm-press items-center gap-2 rounded-full ps-3.5 pe-4 text-fm-small font-medium text-fm-ink-2 fm-focus transition-[background-color,color,scale] hover:bg-fm-fill hover:text-fm-ink motion-reduce:hidden"
              >
                {paused ? (
                  <Play className="size-3.5 fill-current" />
                ) : (
                  <Pause className="size-3.5 fill-current" />
                )}
                {paused ? labels.play : labels.pause}
              </button>
            )}
          </div>
          <Row row={row} scope={scope} />
        </div>
      ))}
    </section>
  )
}

function Row({ row, scope }: { row: MarqueeRow; scope: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const held = useRef(0)

  function hold(event: PointerEvent) {
    if (event.pointerType === "mouse") return
    held.current = performance.now()
    ref.current?.setAttribute("data-hold", "")
  }
  function release() {
    ref.current?.removeAttribute("data-hold")
  }
  function guard(event: MouseEvent) {
    if (held.current && performance.now() - held.current > HOLD_MS) {
      event.preventDefault()
      event.stopPropagation()
    }
    held.current = 0
  }

  const style = { "--es-units": row.units.toFixed(2) } as CSSProperties
  return (
    <div
      ref={ref}
      style={style}
      data-reverse={row.reverse || undefined}
      onPointerDown={hold}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      onClickCapture={guard}
      className="es-row"
    >
      <Track works={row.works} scope={scope} />
      {Array.from({ length: row.copies - 1 }, (_, copy) => (
        <Track key={copy} works={row.works} scope={scope} duplicate />
      ))}
    </div>
  )
}

/**
 * Tor pokazu. Pierwszy tor jest zwykłą listą kart (klawiatura, czytnik);
 * kopia, która domyka pętlę, jest ukryta przed czytnikami, poza kolejnością
 * Tab i bez wideo — same plakaty.
 */
function Track({
  works,
  scope,
  duplicate = false,
}: {
  works: readonly DemoWork[]
  scope: readonly string[]
  duplicate?: boolean
}) {
  return (
    <ul className="es-track" aria-hidden={duplicate || undefined}>
      {works.map((work, index) => (
        <Card key={`${work.slug}-${index}`} work={work} scope={scope} duplicate={duplicate} />
      ))}
    </ul>
  )
}

function Card({
  work,
  scope,
  duplicate,
}: {
  work: DemoWork
  scope: readonly string[]
  duplicate: boolean
}) {
  const { open } = useWorks()
  // Wideo tylko pod kursorem i tylko w pierwszym torze; na dotyku nigdy (plakat).
  const video = useHoverVideo(duplicate ? undefined : work.video, {
    className: "group-hover:scale-[1.04]",
  })

  return (
    <li className="shrink-0">
      <button
        type="button"
        tabIndex={duplicate ? -1 : undefined}
        onClick={() => open(work.slug, scope)}
        {...video.handlers}
        className="group block rounded-fm-2xl text-left fm-focus"
      >
        <span
          className="es-mcard relative block overflow-hidden rounded-fm-2xl bg-fm-fill shadow-fm-ring"
          style={{ aspectRatio: `${work.width} / ${work.height}` }}
        >
          <Image
            src={work.poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 500px, (min-width: 640px) 420px, 320px"
            className="object-cover transition-[scale] duration-700 ease-fm-snap group-hover:scale-[1.04]"
          />
          {video.element}
        </span>
        {/* `w-0 min-w-full`: podpis nie poszerza karty — przycina się do szerokości kadru. */}
        <span className="mt-2.5 block w-0 min-w-full truncate text-fm-small font-medium text-fm-ink-2 transition-colors duration-150 group-hover:text-fm-ink">
          {work.title}
        </span>
      </button>
    </li>
  )
}
