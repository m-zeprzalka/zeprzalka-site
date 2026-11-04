"use client"

import type { CSSProperties } from "react"
import { cn } from "../forma/cn"
import { GLYPH } from "./anchors"
import { useStage } from "./store"
import type { NavItem } from "./types"

/**
 * Spis sekcji: glif (ten sam, który pokazuje logo), nazwa i cicha liczba
 * pozycji. Aktywną sekcję wskazuje miękkie tło, które przesuwa się w pionie
 * (300 ms, krzywa move) — jedno tło zamiast pięciu stanów hover.
 * `onNavigate` zamyka arkusz menu na telefonie.
 */
export function SectionNav({
  label,
  items,
  onNavigate,
  row = 36,
  className,
}: {
  label: string
  items: readonly NavItem[]
  onNavigate?: () => void
  /** Wysokość pozycji (px) — tło aktywnej przesuwa się o jej wielokrotność. 44 na dotyku. */
  row?: number
  className?: string
}) {
  const section = useStage((s) => s.section)
  const active = Math.max(
    0,
    items.findIndex((item) => item.id === section)
  )

  return (
    <nav aria-label={label} className={className}>
      <ol className="relative">
        <span
          aria-hidden="true"
          style={{ "--y": `${active * row}px`, height: row } as CSSProperties}
          className="tk-nav__pill absolute inset-x-0 top-0 rounded-fm-md bg-fm-fill"
        />
        {items.map((item, index) => {
          const current = index === active
          return (
            <li key={item.id} className="relative">
              <a
                href={`#${item.id}`}
                onClick={onNavigate}
                aria-current={current ? "location" : undefined}
                style={{ height: row }}
                className={cn(
                  "group flex items-center gap-3 rounded-fm-md px-3 fm-focus transition-colors duration-150",
                  row > 40 ? "text-[0.9375rem]" : "text-fm-small",
                  current ? "text-fm-ink" : "text-fm-ink-3 hover:text-fm-ink"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "tk-nav__glyph w-3 text-center font-mono text-[0.8125rem]",
                    current ? "text-fm-ink" : "text-fm-ink-3/70 group-hover:text-fm-ink-3"
                  )}
                >
                  {GLYPH[item.id]}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.count !== undefined && (
                  <span className="text-[0.8125rem] text-fm-ink-3 tabular-nums">{item.count}</span>
                )}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
