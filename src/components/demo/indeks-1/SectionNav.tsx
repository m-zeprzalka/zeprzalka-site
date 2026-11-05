"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { ChevronUp, Search } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { SECTION } from "./anchors"
import { useActiveSection, useMedia } from "./hooks"
import type { SectionLink } from "./types"

/** Wysokość pozycji spisu — kropka przesuwa się o wielokrotność tej wartości. */
const ROW = 32

/**
 * Faza strony: w starcie spis milczy (start ma scenę dla siebie), za nim się
 * pojawia, przy stopce znika (znak „Zeprzałka” zajmuje całą szerokość).
 */
function usePhase() {
  const [phase, setPhase] = useState<"hero" | "page" | "footer">("hero")
  useEffect(() => {
    const start = document.getElementById(SECTION.start)
    const footer = document.querySelector("[data-i1-footer]")
    let inHero = true
    let inFooter = false
    const update = () => setPhase(inFooter ? "footer" : inHero ? "hero" : "page")
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        inHero = !!entry?.isIntersecting
        update()
      },
      { rootMargin: "0px 0px -45% 0px" }
    )
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        inFooter = !!entry?.isIntersecting
        update()
      },
      { rootMargin: "0px 0px -8% 0px" }
    )
    if (start) heroObserver.observe(start)
    if (footer) footerObserver.observe(footer)
    return () => {
      heroObserver.disconnect()
      footerObserver.disconnect()
    }
  }, [])
  return phase
}

/**
 * Spis sekcji, który pojawia się dopiero wtedy, gdy jest potrzebny.
 * Od 1280 px: w lewym marginesie — w spoczynku tylko bieżąca sekcja z kropką;
 * gdy kursor zbliży się do lewej strony (albo fokus wejdzie do spisu),
 * pozostałe pozycje wyostrzają się z rozmycia, kolejno od bieżącej.
 * Węziej: pigułka u dołu ekranu, która rozwija się w kartę z sekcjami;
 * przewijanie w dół ją chowa, w górę przywołuje (nie zasłania czytanej treści).
 */
export function SectionNav({
  label,
  items,
  searchLabel,
}: {
  label: string
  items: readonly SectionLink[]
  searchLabel: string
}) {
  const wide = useMedia("(min-width: 80rem)")
  const ids = items.map((item) => item.id)
  const [idsMemo] = useState(ids)
  const active = useActiveSection(idsMemo)
  const phase = usePhase()
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === active)
  )

  return wide ? (
    <SideIndex label={label} items={items} activeIndex={activeIndex} phase={phase} />
  ) : (
    <SectionPill
      label={label}
      items={items}
      activeIndex={activeIndex}
      phase={phase}
      searchLabel={searchLabel}
    />
  )
}

function SideIndex({
  label,
  items,
  activeIndex,
  phase,
}: {
  label: string
  items: readonly SectionLink[]
  activeIndex: number
  phase: "hero" | "page" | "footer"
}) {
  const navRef = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)

  // Kursor przy lewej krawędzi kolumny — spis rozwija się sam, zanim w niego trafisz.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      const column = document.querySelector<HTMLElement>("main .i1-col")?.getBoundingClientRect()
      const edge = column ? column.left - 24 : window.innerWidth * 0.25
      setNear(event.clientX < edge)
    }
    const onLeave = () => setNear(false)
    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  const shown = (phase === "page" || near) && phase !== "footer"

  return (
    // Lewy tor siatki (lustro karty w prawym): spis kończy się odstęp przed kolumną.
    <div className="i1-tracks pointer-events-none fixed inset-x-0 top-1/2 z-20 -translate-y-1/2">
      <nav
        ref={navRef}
        aria-label={label}
        data-shown={shown || undefined}
        data-open={near || undefined}
        className="i1-side col-start-1 justify-self-end"
      >
        <ol className="relative">
          <span
            aria-hidden="true"
            style={{ "--y": `${activeIndex * ROW}px` } as CSSProperties}
            className="i1-side__dot absolute top-[calc(1rem-2.5px)] left-0 size-[5px] rounded-full bg-fm-ink"
          />
          {items.map((item, index) => (
            <li key={item.id} style={{ "--k": Math.abs(index - activeIndex) } as CSSProperties}>
              <a
                href={`#${item.id}`}
                aria-current={index === activeIndex ? "location" : undefined}
                className="i1-side__link flex h-8 items-center gap-2 rounded-fm-xs ps-4 text-fm-small whitespace-nowrap text-fm-ink-3 fm-focus hover:text-fm-ink aria-[current]:text-fm-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}

function SectionPill({
  label,
  items,
  activeIndex,
  phase,
  searchLabel,
}: {
  label: string
  items: readonly SectionLink[]
  activeIndex: number
  phase: "hero" | "page" | "footer"
  searchLabel: string
}) {
  const [open, setOpen] = useState(false)
  /** Przewijanie w dół chowa pigułkę (nie zasłania treści), w górę — przywołuje ją. */
  const [away, setAway] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const current = items[activeIndex]
  const shown = (phase === "page" && !away) || open

  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const sample = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - last
      if (Math.abs(delta) < 8) return
      last = y
      setAway(delta > 0 && y > 240)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sample)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  // Zamknięta karta oddaje fokus pigułce (Esc i wybór sekcji z klawiatury).
  const pillRef = useRef<HTMLButtonElement>(null)

  return (
    <div
      ref={rootRef}
      data-shown={shown || undefined}
      data-open={open || undefined}
      className="i1-pill pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-4"
    >
      <nav
        aria-label={label}
        id="i1-pill-panel"
        inert={!open}
        className="i1-pill__panel absolute bottom-0 w-[min(20rem,calc(100%-2rem))] rounded-3xl bg-fm-surface shadow-(--i1-shadow-pop)"
      >
        <ol className="p-1.5">
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                aria-current={index === activeIndex ? "location" : undefined}
                className="flex h-11 items-center gap-3 rounded-fm-lg px-3 text-[0.9375rem] text-fm-ink-2 fm-focus transition-colors duration-150 hover:bg-fm-fill aria-[current]:text-fm-ink"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-[5px] rounded-full",
                    index === activeIndex ? "bg-fm-ink" : "bg-transparent"
                  )}
                />
                <span className="flex-1">{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="border-t border-fm-edge p-1.5">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              document.querySelector<HTMLElement>("[data-i1-header] [aria-keyshortcuts]")?.click()
            }}
            className="flex h-11 w-full items-center gap-3 rounded-fm-lg px-3 text-[0.9375rem] text-fm-ink-2 fm-focus transition-colors duration-150 hover:bg-fm-fill"
          >
            <Search aria-hidden="true" className="size-4 text-fm-ink-3" />
            {searchLabel}
          </button>
        </div>
      </nav>
      <button
        ref={pillRef}
        type="button"
        aria-expanded={open}
        aria-controls="i1-pill-panel"
        onClick={() => setOpen((value) => !value)}
        className="i1-pill__button pointer-events-auto inline-flex h-11 fm-press items-center gap-2.5 rounded-full bg-fm-surface ps-4 pe-3 text-[0.9375rem] font-medium text-fm-ink shadow-(--i1-shadow-pop) fm-focus"
      >
        <span aria-hidden="true" className="size-[5px] rounded-full bg-fm-ink" />
        <span className="sr-only">{label}: </span>
        <span key={current?.id} className="i1-pill__label">
          {current?.label}
        </span>
        <ChevronUp
          aria-hidden="true"
          className="size-4 text-fm-ink-3 transition-transform duration-300 ease-fm-snap group-aria-expanded:rotate-180"
        />
      </button>
    </div>
  )
}
