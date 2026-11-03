"use client"

import { useEffect, useState, type CSSProperties } from "react"

/** Wysokość pozycji spisu — kropka przesuwa się o wielokrotność tej wartości. */
const ROW = 32

/**
 * Cichy spis sekcji w lewym marginesie (od 1280 px). Pojawia się dopiero po
 * pierwszym ekranie (CSS `animation-timeline: scroll()`), a aktywną sekcję
 * wskazuje kropka, która przesuwa się w pionie (300 ms, krzywa move).
 * Aktywna jest sekcja przecinająca pas na ~40% wysokości ekranu.
 */
export function SectionIndex({
  label,
  items,
}: {
  label: string
  items: readonly { id: string; label: string }[]
}) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = items.findIndex((item) => item.id === entry.target.id)
          if (index >= 0) setActive(index)
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    for (const item of items) {
      const section = document.getElementById(item.id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [items])

  return (
    <nav aria-label={label} className="ix-index fixed top-1/2 hidden -translate-y-1/2 xl:block">
      <ol className="relative">
        <span
          aria-hidden="true"
          style={{ "--y": `${active * ROW}px` } as CSSProperties}
          className="ix-index__dot bg-fm-ink absolute top-[calc(1rem-2.5px)] left-0 size-[5px] rounded-full"
        />
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={index === active ? "location" : undefined}
              className="fm-focus text-fm-small text-fm-ink-3 hover:text-fm-ink aria-[current]:text-fm-ink rounded-fm-xs flex h-8 items-center ps-4 transition-colors duration-150"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
