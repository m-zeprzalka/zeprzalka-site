"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { AnimatePresence, LazyMotion, MotionConfig, domMax, m } from "motion/react"
import { cn } from "../forma/cn"

export interface Work {
  slug: string
  title: string
  category: string
  group: string
  video: string
  poster: string
  /** Proporcje plakatu (szerokość / wysokość) — kafel ma wymiar, zanim wczyta się obraz. */
  ratio: number
}

const FINE_POINTER = "(hover: hover) and (pointer: fine)"
const subscribePointer = (onChange: () => void) => {
  const media = window.matchMedia(FINE_POINTER)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

/** Sprężyna bez odbicia — ruch kart przy filtrowaniu „osiada”, nie podskakuje. */
const SPRING = { type: "spring", visualDuration: 0.4, bounce: 0 } as const

/**
 * Realizacje: filtr (przesuwana pigułka) i siatka kart, które przy zmianie
 * filtra płynnie zmieniają miejsca (animacja układu Motion). Wideo gra
 * po najechaniu (mysz) albo gdy karta jest w większości widoczna (dotyk) —
 * zawsze najwyżej to, na które ktoś patrzy.
 */
export function Works({
  works,
  filters,
}: {
  works: Work[]
  filters: { id: string; label: string }[]
}) {
  const [filter, setFilter] = useState(filters[0]?.id ?? "all")
  const visible = works.filter((work) => filter === "all" || work.group === filter)

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <Segmented options={filters} value={filter} onChange={setFilter} />
        <m.ul layout className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3" transition={SPRING}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((work) => (
              <m.li
                key={work.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={SPRING}
                className="mb-4 break-inside-avoid"
              >
                <WorkCard work={work} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      </MotionConfig>
    </LazyMotion>
  )
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[]
  value: string
  onChange: (id: string) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null)

  // Pozycję pigułki mierzymy po każdym wyborze i zmianie szerokości (fonty, obrót telefonu).
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const active = list.querySelector<HTMLElement>("[aria-checked=true]")
      if (active) setPill({ x: active.offsetLeft, w: active.offsetWidth })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [value])

  return (
    <div
      ref={listRef}
      role="radiogroup"
      className="relative inline-flex max-w-full [scrollbar-width:none] overflow-x-auto rounded-full bg-fm-fill p-1"
    >
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-0 rounded-full bg-fm-surface shadow-fm-card transition-[translate,width] duration-300 ease-fm-snap"
        style={{ translate: `${pill?.x ?? 4}px 0`, width: pill?.w ?? 0 }}
      />
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={option.id === value}
          onClick={() => onChange(option.id)}
          className={cn(
            "relative h-10 rounded-full px-3.5 text-[0.8125rem] font-medium whitespace-nowrap fm-focus transition-colors duration-150 sm:px-4 sm:text-sm",
            option.id === value ? "text-fm-ink" : "text-fm-ink-3 hover:text-fm-ink"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function WorkCard({ work }: { work: Work }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [src, setSrc] = useState<string>()
  const finePointer = useSyncExternalStore(
    subscribePointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => true
  )

  // Dotyk: gra karta widoczna w ≥ 60%, reszta stoi. Mysz: gra karta pod kursorem.
  useEffect(() => {
    const video = ref.current
    if (!video || finePointer) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.intersectionRatio >= 0.6) {
          setSrc(work.video)
          video.play().catch(() => {})
        } else video.pause()
      },
      { threshold: [0, 0.6] }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [finePointer, work.video])

  const play = () => {
    if (!finePointer) return
    setSrc(work.video)
    ref.current?.play().catch(() => {})
  }
  const stop = () => {
    if (finePointer) ref.current?.pause()
  }

  return (
    <article
      onPointerEnter={play}
      onPointerLeave={stop}
      className="group rounded-fm-3xl bg-fm-surface p-1.5 shadow-fm-card transition-shadow duration-300 hover:shadow-fm-pop"
    >
      <div
        className="relative overflow-hidden rounded-[18px] bg-fm-fill"
        style={{ aspectRatio: work.ratio }}
      >
        <video
          ref={ref}
          src={src}
          poster={work.poster}
          preload="none"
          muted
          loop
          playsInline
          aria-hidden="true"
          className="h-full w-full object-cover transition-[scale] duration-700 ease-fm-snap group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-baseline justify-between gap-3 px-3 pt-3 pb-2">
        <h3 className="truncate text-[0.9375rem] font-medium tracking-tight">{work.title}</h3>
        <span className="shrink-0 text-fm-micro text-fm-ink-3">{work.category}</span>
      </div>
    </article>
  )
}
