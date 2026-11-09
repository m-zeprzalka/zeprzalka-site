"use client"

import { useEffect, useId, useRef, useState } from "react"
import { goToAnchor } from "@/app/main-page/_lib/anchors"
import { useMediaQuery } from "@/app/main-page/_lib/hooks"
import type { SectionLink } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"
import { RAIL_LINK, useFooterOverlap } from "./rail-nav"

/** Lewy tor jest od 1280 px (`xl:block`) — poniżej spis nie nasłuchuje niczego. */
const TRACKS_QUERY = "(min-width: 80rem)"

/**
 * Spis rozdziałów wpisu w lewym torze, pod menu głównym (od 1280 px): wszystkie
 * pozycje widoczne, kropka płynie do rozdziału, który właśnie czytasz. Szerokość
 * toru (`rail`, `--container-track`) — długi tytuł rozdziału jest przycięty, pełny w `title`.
 * Stoi pod menu (`top-rail-toc` w globals.css).
 */
export function TableOfContents({
  label,
  sections,
}: {
  label: string
  sections: readonly SectionLink[]
}) {
  const tracks = useMediaQuery(TRACKS_QUERY)
  const [active, setActive] = useState(-1)
  const nav = useRef<HTMLElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const hidden = useFooterOverlap(nav)
  const labelId = useId()

  useEffect(() => {
    if (!tracks) return
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null)
    // Bieżący rozdział: ostatni, którego nagłówek minął linię 45% okna (także po skoku do
    // kotwicy, gdy żaden cel nie przejeżdża przez linię). Przed pierwszym — żaden.
    // Odczyt raz na klatkę, bez zapisów do DOM.
    let frame = 0
    let shown = -1
    const measure = () => {
      frame = 0
      const line = window.innerHeight * 0.45
      let index = -1
      targets.forEach((target, i) => {
        if (target.getBoundingClientRect().top <= line) index = i
      })
      setActive(index)
      // Długi spis przewija się we własnym torze — czytany rozdział zawsze w nim widać.
      const list = scroller.current
      const row = list?.querySelectorAll("li")[index]
      if (index !== shown && list && row) {
        shown = index
        const top = row.offsetTop
        if (top < list.scrollTop || top + row.offsetHeight > list.scrollTop + list.clientHeight)
          list.scrollTo({ top: top - list.clientHeight / 2 })
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    // Pierwszy odczyt w klatce po hydratacji, nie w trakcie niej.
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [sections, tracks])

  return (
    <nav
      ref={nav}
      aria-labelledby={labelId}
      className={cn(
        "fixed top-rail-toc rail z-30 hidden max-h-[calc(100dvh-var(--spacing-rail-toc)-2rem)] flex-col transition-[opacity,filter,translate] duration-300 ease-out motion-safe:animate-enter-side motion-safe:[animation-delay:calc(var(--enter-rail)+120ms)] xl:flex",
        hidden &&
          "pointer-events-none -translate-x-2 opacity-0 blur-sm focus-within:pointer-events-auto focus-within:translate-x-0 focus-within:opacity-100 focus-within:blur-none"
      )}
    >
      <p id={labelId} className="ps-4 pb-2 text-xs text-muted-foreground">
        {label}
      </p>
      {/* Przewija się sama lista (podpis zostaje); `-m-1 p-1` — miejsce na obwódkę fokusu.
          Kropka przesuwa się o `--active` wierszy po h-8 (wysokość pozycji toru). */}
      <div ref={scroller} className="-m-1 min-h-0 overflow-y-auto p-1">
        <div className="relative" style={{ "--active": Math.max(active, 0) }}>
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-[calc(1rem-2.5px)] left-0 size-1.25 translate-y-[calc(var(--active)*(--spacing(8)))] rounded-full bg-foreground transition-[translate,opacity] duration-300 ease-in-out",
              active < 0 && "opacity-0"
            )}
          />
          <ol>
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  // Skok: hash, przewinięcie i fokus na celu (jak każda kotwica w treści).
                  onClick={(event) => {
                    event.preventDefault()
                    goToAnchor(section.id)
                  }}
                  aria-current={index === active ? "location" : undefined}
                  title={section.label}
                  className={RAIL_LINK}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  )
}
