"use client"

import { useState, useSyncExternalStore } from "react"
import { Popover } from "radix-ui"
import NumberFlow, { continuous } from "@number-flow/react"
import { Count } from "@/components/demo/forma/Count"
import { useInView, useReducedMotion } from "@/components/demo/forma/use-in-view"
import { portalRoot } from "./hooks"
import { PeekBody } from "./PeekBody"
import { mutePeek } from "./peek-store"
import { peekHandlers } from "./peek-trigger"
import type { Fact as FactData, Peek } from "./types"

const NUMBER =
  "text-fm-ink text-[1.5rem] leading-none font-medium tracking-[-0.03em] tabular-nums sm:text-[1.75rem]"
const PERCENT = { style: "percent", maximumFractionDigits: 2, minimumFractionDigits: 2 } as const

/**
 * Fakt: liczba w atramencie, podpis w szarości. Myszą — szczegół na marginesie
 * (wyostrza się z rozmycia), kliknięciem i palcem — w karcie pod liczbą.
 * Liczby dojeżdżają do wartości raz, po wejściu w kadr (Number Flow).
 */
export function Fact({ fact, peek }: { fact: FactData; peek: Peek }) {
  const [open, setOpen] = useState(false)
  const key = `peek:${fact.peek}`

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        mutePeek(next ? key : null)
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          {...peekHandlers(key)}
          className="ixn-fact group -m-3 flex flex-col items-start gap-2 rounded-fm-xl p-3 text-left fm-focus"
        >
          <Value fact={fact} />
          <span className="text-fm-small text-pretty text-fm-ink-3 transition-colors duration-150 group-hover:text-fm-ink-2">
            {fact.label}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal container={portalRoot()}>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="ixn-popover z-50 w-[min(20rem,calc(100vw-2rem))] rounded-fm-xl bg-fm-surface p-4 text-fm-small shadow-fm-pop outline-none"
        >
          <PeekBody peek={peek} onNavigate={() => setOpen(false)} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

function Value({ fact }: { fact: FactData }) {
  if (typeof fact.value === "number") {
    return (
      <Count
        value={fact.value}
        suffix={fact.suffix}
        format={fact.percent ? PERCENT : undefined}
        className={NUMBER}
      />
    )
  }
  const range = fact.value.match(/^(\d{4})\D+(\d{4})$/)
  if (range) return <YearRange from={Number(range[1])} to={Number(range[2])} />
  return <span className={NUMBER}>{fact.value}</span>
}

const noop = () => () => {}
const NO_GROUPING = { useGrouping: false } as const

/** Rok końcowy dojeżdża od początkowego (2016 → 2026); serwer i hydratacja pokazują pełny zakres. */
function YearRange({ from, to }: { from: number; to: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>("0px 0px -10% 0px")
  const reduced = useReducedMotion()
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
  const shown = hydrated && !reduced && !inView ? from : to
  return (
    <span ref={ref} className={NUMBER}>
      <span className="sr-only">{`${from}–${to}`}</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        {from}–
        <NumberFlow
          value={shown}
          format={NO_GROUPING}
          plugins={[continuous]}
          animated={!reduced}
          willChange
        />
      </span>
    </span>
  )
}
