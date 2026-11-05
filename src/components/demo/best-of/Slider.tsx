"use client"

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { cn } from "../forma/cn"
import { useReducedMotion } from "../forma/use-in-view"
import type { DemoWork } from "../shared/content"
import { SliderEngine } from "./slider-engine"
import { useHoverVideo } from "./use-hover-video"
import { useWorks } from "./WorksProvider"

/** Tempo auto-ruchu (px/s): telefon wolniej — karta zajmuje większą część ekranu. */
const SPEED = { coarse: 26, fine: 34 }
const COPIES = 3

export interface SliderLabels {
  region: string
  previous: string
  next: string
  pause: string
  play: string
  /** Napis pigułki na karcie („Podgląd”). */
  preview: string
}

/**
 * Jeden nieskończony slider prac cyfrowych (produkty i strony) w wąskiej siatce
 * kontenera z wygaszonymi krawędziami. Karty „karta w karcie” (wzór: `talia/
 * DeckCard.tsx`), przy środku kadru pełna skala, boczne lekko cofnięte. Tor
 * przesuwa się sam; palec i mysz przeciągają go z bezwładnością, po chwili
 * auto-ruch wraca (`slider-engine.ts`). Pauza, strzałki i klawiatura (WCAG
 * 2.2.2, 2.5.7). Klik otwiera podgląd — kadr „wskakuje” do okna.
 *
 * Bez JS: jedna lista przewijana w poziomie ze snapem. Kopie domykające pętlę
 * są ukryte przed czytnikami i poza kolejnością Tab (ale klikalne — widać je).
 */
export function Slider({ works, labels }: { works: readonly DemoWork[]; labels: SliderLabels }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<SliderEngine | null>(null)
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const { covered } = useWorks()
  const scope = works.map((work) => work.slug)

  useEffect(() => {
    const root = rootRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!root || !viewport || !track) return
    root.setAttribute("data-engine", "")
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const engine = new SliderEngine(viewport, track, {
      speed: coarse ? SPEED.coarse : SPEED.fine,
      // Margines siatki: tor ma pełną szerokość, ale „ostra” jest tylko kolumna kontenera.
      inset: () => controlsRef.current?.offsetLeft ?? 0,
      onDragging: (dragging) => root.toggleAttribute("data-dragging", dragging),
    })
    engineRef.current = engine
    return () => {
      engine.destroy()
      engineRef.current = null
      root.removeAttribute("data-engine")
    }
  }, [])

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches
    engineRef.current?.setSpeed(reduced ? 0 : coarse ? SPEED.coarse : SPEED.fine)
  }, [reduced])

  useEffect(() => engineRef.current?.set("paused", paused), [paused])
  useEffect(() => engineRef.current?.set("covered", covered), [covered])

  function onFocus(event: FocusEvent<HTMLDivElement>) {
    const card = (event.target as HTMLElement).closest<HTMLElement>("[data-work-card]")
    engineRef.current?.set("focus", true)
    if (card) engineRef.current?.reveal(card)
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      engineRef.current?.set("focus", false)
    }
  }

  // Strzałki przenoszą fokus między kartami listy (kopie są poza kolejnością Tab).
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    const cards = [
      ...event.currentTarget.querySelectorAll<HTMLElement>("[data-work-card]:not([tabindex='-1'])"),
    ]
    const index = cards.indexOf(document.activeElement as HTMLElement)
    if (index < 0) return
    event.preventDefault()
    const next =
      cards[(index + (event.key === "ArrowRight" ? 1 : -1) + cards.length) % cards.length]
    next?.focus({ preventScroll: true })
  }

  const control =
    "grid size-11 fm-press place-items-center rounded-full bg-fm-surface text-fm-ink-2 shadow-fm-ring fm-focus transition-[background-color,color,scale] hover:bg-fm-fill hover:text-fm-ink"

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="karuzela"
      aria-label={labels.region}
      className="bo-slider"
      onPointerEnter={(event) =>
        event.pointerType === "mouse" && engineRef.current?.set("hover", true)
      }
      onPointerLeave={(event) =>
        event.pointerType === "mouse" && engineRef.current?.set("hover", false)
      }
    >
      <div
        ref={viewportRef}
        className="bo-slider__viewport"
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      >
        <div ref={trackRef} className="bo-slider__track">
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul key={copy} className="bo-slider__copy" aria-hidden={copy !== 1 || undefined}>
              {works.map((work, index) => (
                <Card
                  key={work.slug}
                  work={work}
                  index={index}
                  total={works.length}
                  scope={scope}
                  duplicate={copy !== 1}
                  previewLabel={labels.preview}
                />
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div
        ref={controlsRef}
        className="fm-container mt-5 flex items-center justify-end gap-2 sm:mt-6"
      >
        <button
          type="button"
          onClick={() => engineRef.current?.stepBy(-1)}
          aria-label={labels.previous}
          title={labels.previous}
          className={control}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => engineRef.current?.stepBy(1)}
          aria-label={labels.next}
          title={labels.next}
          className={control}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
          className={cn(
            control,
            "inline-flex w-auto gap-2 ps-4 pe-4.5 text-fm-small font-medium motion-reduce:hidden"
          )}
        >
          {paused ? (
            <Play aria-hidden="true" className="size-3.5 fill-current" />
          ) : (
            <Pause aria-hidden="true" className="size-3.5 fill-current" />
          )}
          {paused ? labels.play : labels.pause}
        </button>
      </div>
    </div>
  )
}

/** „1” → „01” — numer karty w torze (pozycja w sekwencji, nie ozdoba). */
const pad = (value: number) => String(value).padStart(2, "0")

/**
 * Karta katalogowa: numer w torze i grupa nad kadrem, tytuł i kategoria pod
 * nim, a po prawej strzałka, która przy najechaniu (mysz) albo gdy karta jest
 * na środku toru (dotyk) rozwija się w pigułkę „Podgląd”. Wszystko w czerni
 * i bieli — glify zostają dla obrazu i kodu.
 */
function Card({
  work,
  index,
  total,
  scope,
  duplicate,
  previewLabel,
}: {
  work: DemoWork
  index: number
  total: number
  scope: readonly string[]
  duplicate: boolean
  previewLabel: string
}) {
  const { open, prefetch } = useWorks()
  // Wideo tylko pod kursorem myszy (na dotyku nigdy — limit danych na telefonie).
  const video = useHoverVideo(work.video)

  return (
    <li data-slide="" className="bo-slide">
      <button
        type="button"
        data-work-card={work.slug}
        tabIndex={duplicate ? -1 : undefined}
        onClick={(event) => open(work.slug, scope, event.currentTarget)}
        onFocus={prefetch}
        {...video.handlers}
        onPointerEnter={(event) => {
          prefetch()
          video.handlers.onPointerEnter?.(event)
        }}
        className="bo-card group block w-full rounded-[1.5rem] bg-fm-surface p-1.5 text-left shadow-fm-card fm-focus transition-shadow duration-300 ease-fm-snap hover:shadow-fm-pop"
      >
        <span className="flex h-9 items-center justify-between gap-3 ps-3 pe-3 text-fm-micro tabular-nums">
          <span aria-hidden="true" className="font-medium text-fm-ink-3">
            <span className="bo-card__num">{pad(index + 1)}</span> / {pad(total)}
          </span>
          <span className="truncate text-fm-ink-3">{work.groupLabel}</span>
        </span>
        <span
          data-work-media={work.slug}
          className="relative block aspect-[4/3] overflow-hidden rounded-[1.125rem] bg-fm-fill"
        >
          <Image
            src={work.poster}
            alt=""
            fill
            draggable={false}
            sizes="(min-width: 1680px) 416px, (min-width: 1024px) 384px, (min-width: 640px) 336px, 74vw"
            className="object-cover transition-[scale] duration-700 ease-fm-snap group-hover:scale-[1.035]"
          />
          {video.element}
        </span>
        <span className="flex items-end justify-between gap-3 ps-3 pe-2 pt-3.5 pb-2">
          <span className="min-w-0 pb-0.5">
            <span className="block truncate text-[1rem] leading-snug font-[550] tracking-[-0.02em]">
              {work.title}
            </span>
            <span className="block truncate text-fm-small text-fm-ink-3">{work.category}</span>
          </span>
          <span aria-hidden="true" className="bo-cta">
            <span className="min-w-0 overflow-hidden">
              <span className="block ps-4 pe-0.5 text-fm-small font-medium whitespace-nowrap">
                {previewLabel}
              </span>
            </span>
            <span className="grid size-9 place-items-center">
              <ArrowRight className="bo-cta__arrow size-4" />
            </span>
          </span>
        </span>
      </button>
    </li>
  )
}
