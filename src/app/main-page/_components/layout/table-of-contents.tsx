"use client"

import { useEffect, useId, useRef, useState } from "react"
import { usePeekState } from "@/app/main-page/_components/peek/peek-context"
import { goToAnchor } from "@/app/main-page/_lib/anchors"
import { TRACKS_QUERY, useEdgeAbove, useMediaQuery } from "@/app/main-page/_lib/hooks"
import type { SectionLink } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"
import { TOC_LINK, TRACK_HIDDEN } from "./track-classes"

/**
 * Treść objęta spisem (wpis, katalog systemu) — za jej końcem spis nie ma czego wskazywać
 * i chowa się. Atrybut stawia widok wokół treści.
 */
const SCOPE = "[data-toc-scope]"

/** Linia czytania (ułamek wysokości okna): bieżący rozdział i koniec treści liczą się od niej. */
const READING_LINE = 0.45

/**
 * Spis rozdziałów wpisu w prawym torze (od 1280 px) — po stronie, po której na starcie
 * stoi karta podglądu; po lewej zostaje samo menu główne. Na wysokości menu, wszystkie
 * rozdziały pełnymi nazwami; kropka płynie do rozdziału, który właśnie czytasz.
 * Chowa się za końcem treści (wezwanie i „Czytaj dalej” mają już własną kartę podglądu
 * w tym samym torze) i na czas tej karty. Za długi spis przewija się we własnym torze.
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
  /** Przesunięcie kropki — górna krawędź bieżącej pozycji w liście (px). */
  const [dot, setDot] = useState(0)
  const nav = useRef<HTMLElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  // Koniec treści minął linię czytania (ta sama 45% okna co wybór rozdziału) — niezależnie
  // od wysokości samego spisu.
  const ended = useEdgeAbove(nav, SCOPE, "bottom", READING_LINE)
  const peek = usePeekState()
  const hidden = ended || peek.id !== null
  const labelId = useId()

  useEffect(() => {
    if (!tracks) return
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null)
    // Bieżący rozdział: ostatni, którego nagłówek minął linię czytania (także po skoku do
    // kotwicy, gdy żaden cel nie przejeżdża przez linię). Przed pierwszym — żaden.
    // Odczyt raz na klatkę, zapis do DOM tylko przy zmianie rozdziału.
    let frame = 0
    let shown = -1
    const measure = () => {
      frame = 0
      const line = window.innerHeight * READING_LINE
      let index = -1
      targets.forEach((target, i) => {
        if (target.getBoundingClientRect().top <= line) index = i
      })
      setActive(index)
      const list = scroller.current
      const row = list?.querySelectorAll("li")[index]
      if (!list || !row) return
      // Kropka zawsze za wierszem — także gdy tytuły przełamały się inaczej (szerokość toru,
      // podmiana krojów); React pomija zapis tej samej wartości.
      setDot(row.offsetTop)
      if (index === shown) return
      shown = index
      // Długi spis przewija się we własnym torze — czytany rozdział zawsze w nim widać.
      const top = row.offsetTop
      if (top < list.scrollTop || top + row.offsetHeight > list.scrollTop + list.clientHeight)
        list.scrollTo({ top: top - list.clientHeight / 2 })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    // Pierwszy odczyt w klatce po hydratacji, nie w trakcie niej. Lista, która zmieniła
    // wysokość (podmiana krojów, inne łamanie tytułów), też przesuwa kropkę.
    onScroll()
    const reflow = new ResizeObserver(onScroll)
    if (scroller.current) reflow.observe(scroller.current)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      reflow.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [sections, tracks])

  return (
    <nav
      ref={nav}
      aria-labelledby={labelId}
      className={cn(
        "fixed top-rail stage-track z-30 hidden max-h-[calc(100dvh-var(--spacing-rail)-2rem)] flex-col transition-[opacity,filter,translate] duration-300 ease-out motion-safe:animate-enter-side motion-safe:[--enter-side-from:1rem] motion-safe:[animation-delay:var(--enter-rail)] xl:flex",
        hidden && cn(TRACK_HIDDEN, "translate-x-2")
      )}
    >
      {/* Podpis na wysokości wiersza menu po lewej (`h-8`) — oba tory zaczynają się w jednej linii. */}
      <p id={labelId} className="ps-4 text-xs leading-8 text-muted-foreground">
        {label}
      </p>
      {/* Przewija się sama lista (podpis zostaje); `-m-1 p-1` — miejsce na obwódkę fokusu. */}
      <div ref={scroller} className="-m-1 min-h-0 overflow-y-auto p-1">
        <div className="relative">
          <span
            aria-hidden="true"
            style={{ translate: `0 ${dot}px` }}
            className={cn(
              "absolute top-[calc(1rem-2.5px)] left-0 size-1.25 rounded-full bg-foreground transition-[translate,opacity] duration-300 ease-in-out",
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
                  className={TOC_LINK}
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
