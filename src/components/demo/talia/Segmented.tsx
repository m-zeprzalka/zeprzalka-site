"use client"

import { useRef, type KeyboardEvent } from "react"
import { LayoutGroup } from "motion/react"
import * as m from "motion/react-m"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { cn } from "../forma/cn"

export interface SegmentOption<T extends string> {
  id: T
  label: string
  count: number
}

const PILL = { type: "spring", visualDuration: 0.3, bounce: 0.15 } as const

/**
 * Przełącznik segmentowy z przesuwaną pigułką (Motion `layoutId`). To
 * filtr, nie zakładki, więc semantyka grupy przycisków radiowych: jedna
 * pozycja w kolejności Tab, strzałki zmieniają wybór. Wysokość 36 px +
 * 4 px ramy daje 44 px pola dotyku.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  labelledBy,
  className,
}: {
  options: readonly SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  labelledBy: string
  className?: string
}) {
  const refs = useRef(new Map<T, HTMLButtonElement>())
  const reduced = useReducedMotion()

  function onKeyDown(event: KeyboardEvent) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const index = options.findIndex((option) => option.id === value)
    const next = options[(index + step + options.length) % options.length]
    if (!next) return
    choose(next.id)
    refs.current.get(next.id)?.focus()
  }

  // Na wąskim ekranie przełącznik przewija się w poziomie — wybrana pozycja
  // zawsze dojeżdża do kadru.
  function choose(id: T) {
    onChange(id)
    refs.current.get(id)?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reduced ? "auto" : "smooth",
    })
  }

  return (
    <LayoutGroup id="talia-segmented">
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        onKeyDown={onKeyDown}
        className={cn("inline-flex shrink-0 gap-0.5 rounded-full bg-fm-fill p-1", className)}
      >
        {options.map((option) => {
          const selected = option.id === value
          return (
            <button
              key={option.id}
              ref={(node) => {
                if (node) refs.current.set(option.id, node)
                else refs.current.delete(option.id)
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(option.id)}
              className={cn(
                "relative flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium whitespace-nowrap fm-focus transition-colors duration-200",
                selected ? "text-fm-ink" : "text-fm-ink-3 hover:text-fm-ink-2"
              )}
            >
              {selected && (
                <m.span
                  layoutId="pill"
                  transition={PILL}
                  style={{ borderRadius: 999 }}
                  className="absolute inset-0 bg-fm-surface shadow-fm-card"
                />
              )}
              <span className="relative">{option.label}</span>
              <span className="relative text-xs text-fm-ink-3 tabular-nums">{option.count}</span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
