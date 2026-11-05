"use client"

import { useSyncExternalStore } from "react"
import type { DemoWork } from "../shared/content"
import { GlyphMedia } from "../shared/glyph"
import { useWorks } from "./WorksProvider"

/**
 * Przycięcia kadrów (wzór: `esencja/Works.tsx`): plakaty filmów są pionowe
 * (720 × 850), więc rytm dają przycięcia na zmianę — kolumny mają różne
 * wysokości jak w prawdziwym masonry, a nie równą siatkę.
 */
const CROPS: readonly [number, number][] = [
  [4, 5],
  [1, 1],
  [3, 4],
  [4, 5],
  [3, 4],
  [1, 1],
  [4, 5],
]

const WIDE = "(min-width: 64rem)"
/** Wideo w kaflach tylko przy myszy — na dotyku (limit danych) film gra w podglądzie. */
const FINE = "(hover: hover) and (pointer: fine)"

const subscribeTo = (query: string) => (onChange: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}
const subscribeWide = subscribeTo(WIDE)
const MEDIA_SETTINGS = { fps: 8, decode: 900 } as const
const subscribeFine = subscribeTo(FINE)

/** Podpis pod kadrem i odstęp między kaflami w jednostkach szerokości kolumny. */
const CAPTION = 0.16
const GAP = 0.08
/** Granice przycięcia przy wyrównywaniu kolumn (wysokość / szerokość). */
const RATIO = { min: 0.92, max: 1.55 }

/**
 * Rozkład do kolumn: każdy kafel trafia do najkrótszej kolumny (znane proporcje,
 * więc bez mierzenia), a potem przycięcia w każdej kolumnie lekko się rozciągają
 * albo ściskają, żeby wszystkie kolumny kończyły się na tej samej linii —
 * siedem kafli w dwóch czy trzech kolumnach nie zostawia dziury na dole.
 */
function distribute<T>(items: readonly T[], count: number, ratio: (index: number) => number) {
  const columns: { item: T; ratio: number }[][] = Array.from({ length: count }, () => [])
  const heights = new Array<number>(count).fill(0)
  items.forEach((item, index) => {
    const shortest = heights.indexOf(Math.min(...heights))
    const r = ratio(index)
    columns[shortest]?.push({ item, ratio: r })
    heights[shortest] = (heights[shortest] ?? 0) + r + CAPTION + GAP
  })
  const target = heights.reduce((sum, height) => sum + height, 0) / count
  for (const column of columns) {
    const fixed = column.length * (CAPTION + GAP)
    const current = column.reduce((sum, entry) => sum + entry.ratio, 0)
    const scale = current > 0 ? (target - fixed) / current : 1
    for (const entry of column) {
      entry.ratio = Math.min(RATIO.max, Math.max(RATIO.min, entry.ratio * scale))
    }
  }
  return columns
}

/**
 * Masonry treści wizualnych (2 → 3 kolumny). Każdy kafel zaczyna całkowicie
 * jako znaki — jasne i szare glify na czerni, jak szkielet (pochwała
 * właściciela) — i przy wejściu w kadr wyłania się w kolor (wspólny silnik,
 * `GlyphMedia`). Przy myszy wideo gra w jednym kaflu naraz (najechanym albo
 * najbliżej środka ekranu), plik dochodzi dopiero wtedy; na dotyku film gra
 * w podglądzie. Podpis zawsze widoczny. Klik otwiera podgląd z morfem.
 */
export function Masonry({ works }: { works: readonly DemoWork[] }) {
  const { open, prefetch } = useWorks()
  const scope = works.map((work) => work.slug)

  // Serwer i telefon: dwie kolumny; od 1024 px trzy (przeliczenie po hydratacji, sekcja jest daleko pod zgięciem).
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => false
  )
  const fine = useSyncExternalStore(
    subscribeFine,
    () => window.matchMedia(FINE).matches,
    () => false
  )
  const columns = distribute(works, wide ? 3 : 2, (index) => {
    const [w, h] = CROPS[index % CROPS.length] ?? [4, 5]
    return h / w
  })

  return (
    // Od 1024 px kolumny jadą przy przewijaniu każda swoim tempem (pochwała galerii z Kinetyki):
    // środkowa najszybciej, skrajne wolniej — `b2-par` w CSS, oś czasu widoku całej siatki.
    <div className="b2-par grid grid-cols-2 items-start gap-(--b2-gap) lg:grid-cols-3">
      {columns.map((column, c) => (
        <ul key={c} data-b2-col={c} className="b2-par__col grid min-w-0 grid-cols-1 gap-5 sm:gap-7">
          {column.map(({ item: work, ratio }) => {
            return (
              // Bez wejścia z rozmycia: wejściem kafla jest jego dekodowanie z glifów (jedno na element).
              <li key={work.slug}>
                <button
                  type="button"
                  data-gx-host=""
                  data-work-card={work.slug}
                  onClick={(event) => open(work.slug, scope, event.currentTarget)}
                  onPointerEnter={prefetch}
                  onFocus={prefetch}
                  className="group block w-full rounded-(--b2-r-card) text-left fm-focus"
                >
                  <span data-work-media={work.slug} className="block rounded-(--b2-r-card)">
                    <GlyphMedia
                      poster={work.poster}
                      src={fine ? work.video : undefined}
                      width={720}
                      height={Math.round(720 * ratio)}
                      trigger="view"
                      // 8 kl./s i 0,9 s (w granicach wyboru właściciela): siedem kafli dekoduje się
                      // jednocześnie — o połowę mniej klatek do skopiowania z WebGL niż przy 12 / 1,1 s.
                      settings={MEDIA_SETTINGS}
                      sizes="(min-width: 1680px) 432px, (min-width: 1024px) 384px, 50vw"
                      className="rounded-(--b2-r-card)"
                    />
                  </span>
                  <span className="mt-3 flex flex-col gap-0.5 px-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                    <span className="truncate text-[0.9375rem] leading-snug font-[550] tracking-[-0.015em] decoration-fm-edge-strong underline-offset-4 group-hover:underline">
                      {work.title}
                    </span>
                    <span className="shrink-0 truncate text-fm-small text-fm-ink-3">
                      {work.category}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      ))}
    </div>
  )
}
