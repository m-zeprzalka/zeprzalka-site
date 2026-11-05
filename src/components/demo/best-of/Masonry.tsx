"use client"

import { useSyncExternalStore } from "react"
import type { DemoWork } from "../shared/content"
import { CodedMedia } from "./glyphs/CodedMedia"
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

function subscribeWide(onChange: () => void) {
  const media = window.matchMedia(WIDE)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

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
 * Masonry treści wizualnych (2 → 3 kolumny) z kadrami zakodowanymi w glifach:
 * kafel dekoduje się w kolor przy wejściu w kadr, pod kursorem przebiega glifami
 * i odtwarza wideo (jedno naraz). Podpis zawsze widoczny. Klik otwiera podgląd
 * z morfem; strzałki w oknie przechodzą po realizacjach tej sekcji.
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
  const columns = distribute(works, wide ? 3 : 2, (index) => {
    const [w, h] = CROPS[index % CROPS.length] ?? [4, 5]
    return h / w
  })

  return (
    <div className="grid grid-cols-2 items-start gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
      {columns.map((column, c) => (
        <ul key={c} className="grid min-w-0 grid-cols-1 gap-5 sm:gap-7">
          {column.map(({ item: work, ratio }) => {
            return (
              // Bez wejścia z rozmycia: wejściem kafla jest jego dekodowanie z glifów (jedno na element).
              <li key={work.slug}>
                <button
                  type="button"
                  data-bo-host=""
                  data-work-card={work.slug}
                  onClick={(event) => open(work.slug, scope, event.currentTarget)}
                  onPointerEnter={prefetch}
                  onFocus={prefetch}
                  className="group block w-full rounded-[1.25rem] text-left fm-focus"
                >
                  <span data-work-media={work.slug} className="block rounded-[1.25rem]">
                    <CodedMedia
                      src={work.poster}
                      width={720}
                      height={Math.round(720 * ratio)}
                      sizes="(min-width: 1024px) 400px, 50vw"
                      video={work.video}
                      className="rounded-[1.25rem]"
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
