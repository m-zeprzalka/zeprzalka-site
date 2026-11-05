"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { SECTION } from "./anchors"
import { cardHandlers } from "./card-store"
import { GlyphMedia } from "./glyph"
import { FINE, useMedia } from "./hooks"
import { COL } from "./grid"
import { SectionHead } from "./SectionHead"
import type { Indeks2Content } from "./content"
import type { Work } from "./types"

/**
 * Rozkład do kolumn „do najkrótszej” z proporcji plakatów — bez mierzenia,
 * więc serwer i klient liczą to samo (brak skoku przy hydratacji).
 */
function distribute(works: readonly Work[], columns: number): Work[][] {
  const lanes: Work[][] = Array.from({ length: columns }, () => [])
  const heights = Array.from({ length: columns }, () => 0)
  for (const work of works) {
    const lane = heights.indexOf(Math.min(...heights))
    lanes[lane]?.push(work)
    // Podpis pod kaflem ≈ 0,18 szerokości kolumny.
    heights[lane] = (heights[lane] ?? 0) + work.poster.height / work.poster.width + 0.18
  }
  return lanes
}

/**
 * Realizacje jako masonry (najlepsze dla wizualiów) z filtrami-chipami
 * kategorii. Od 1024 px kolumny dryfują przy przewijaniu każda w swoim tempie
 * (oś czasu widoku w CSS — świadomy wyjątek z reguły ruchu, jak w Kinetyce).
 * Kafel zaczyna jako szkielet ze znaków i przy wejściu w kadr odkodowuje się
 * w plakat (fala po kolumnach); wskazany myszą gra swój film w miejscu. Na dotyku kafel otwiera kartę
 * u dołu (film + opis + link). Bez liczników — na końcu „Wszystkie realizacje”.
 */
export function Works({
  portfolio,
  labels,
}: {
  portfolio: Indeks2Content["portfolio"]
  labels: { filter: string; allWorks: string }
}) {
  const [filter, setFilter] = useState("selected")
  const visible = useMemo(
    () =>
      filter === "selected"
        ? portfolio.selected.flatMap((slug) => portfolio.works.filter((work) => work.slug === slug))
        : portfolio.works.filter((work) => work.group === filter),
    [portfolio.works, portfolio.selected, filter]
  )

  return (
    <section
      id={SECTION.works}
      aria-labelledby={`${SECTION.works}-title`}
      className="pt-(--i2-section)"
    >
      <div className="i2-grid">
        <div className={COL.text}>
          <SectionHead
            id={`${SECTION.works}-title`}
            title={portfolio.title}
            lead={portfolio.lead}
          />
        </div>
        <div className={cn(COL.wide, "mt-8 sm:mt-10")}>
          <div role="radiogroup" aria-label={labels.filter} className="flex flex-wrap gap-1.5">
            {portfolio.filters.map((entry) => (
              <button
                key={entry.id}
                type="button"
                role="radio"
                aria-checked={filter === entry.id}
                onClick={() => setFilter(entry.id)}
                className={cn(
                  "inline-flex h-9 shrink-0 fm-press items-center rounded-full px-4 text-fm-small whitespace-nowrap fm-focus transition-[background-color,color,scale] duration-150",
                  filter === entry.id
                    ? "bg-fm-ink text-fm-inverse"
                    : "bg-fm-fill text-fm-ink-2 hover:bg-fm-fill-strong hover:text-fm-ink"
                )}
              >
                {entry.label}
              </button>
            ))}
          </div>

          {/* Dwa rozkłady (2 i 3 kolumny) przełącza CSS — bez skoku układu po hydratacji. */}
          <Masonry key={`2-${filter}`} works={visible} columns={2} className="grid lg:hidden" />
          <Masonry key={`3-${filter}`} works={visible} columns={3} className="hidden lg:grid" />

          <a
            href={portfolio.link.href}
            className="group mt-10 inline-flex h-11 items-center gap-2 rounded-full text-fm-small font-medium text-fm-ink fm-focus"
          >
            {labels.allWorks}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-fm-ink-3 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  )
}

function Masonry({
  works,
  columns,
  className,
}: {
  works: readonly Work[]
  columns: number
  className: string
}) {
  const lanes = distribute(works, columns)
  return (
    <div
      data-cols={columns}
      className={cn(
        "mt-6 gap-(--i2-gap)",
        columns === 3 ? "grid-cols-3" : "grid-cols-2",
        className
      )}
    >
      {lanes.map((lane, laneIndex) => (
        <ul
          key={laneIndex}
          className="i2-lane flex flex-col gap-(--i2-gap)"
          style={{ "--lane": laneIndex } as CSSProperties}
        >
          {lane.map((work, index) => (
            <li key={work.slug}>
              <Tile work={work} lane={laneIndex} order={laneIndex + index * lanes.length} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

/** Fala po rzędzie: kolumny wchodzą jedna po drugiej (0 / 110 / 220 ms). */
const LANE_STAGGER = 110

function Tile({ work, lane, order }: { work: Work; lane: number; order: number }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [decoded, setDecoded] = useState(false)
  const [hover, setHover] = useState(false)
  const fine = useMedia(FINE)
  const handlers = cardHandlers(`work:${work.slug}`)

  // Szkielet ze znaków tylko do wejścia w kadr — potem plakat (fala po kolumnach).
  useEffect(() => {
    const node = ref.current
    if (!node) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        timer = setTimeout(() => setDecoded(true), lane * LANE_STAGGER)
      },
      { threshold: 0.35 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [lane])

  return (
    <button
      ref={ref}
      type="button"
      onClick={handlers.onClick}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHover(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHover(false)}
      onFocus={(event) => event.currentTarget.matches(":focus-visible") && setHover(true)}
      onBlur={() => setHover(false)}
      className="i2-in group block w-full rounded-fm-2xl text-start fm-focus"
      style={{ "--d": `${Math.min(order, 8) * 40}ms` } as CSSProperties}
    >
      {/* Myszą film dostaje źródło dopiero przy wskazaniu; na dotyku gra jeden — najbliżej środka. */}
      <GlyphMedia
        poster={work.poster.src}
        src={fine ? (hover ? work.video : undefined) : work.video}
        width={work.poster.width}
        height={work.poster.height}
        sizes="(min-width: 1024px) 26vw, 50vw"
        trigger="manual"
        decoded={decoded}
        className="i2-media-ring rounded-fm-2xl"
      />
      <span className="mt-3 flex flex-col gap-0.5 px-1">
        <span className="text-fm-small leading-snug font-medium text-pretty text-fm-ink">
          {work.title}
        </span>
        <span className="text-fm-micro text-fm-ink-3">{work.category}</span>
      </span>
    </button>
  )
}
