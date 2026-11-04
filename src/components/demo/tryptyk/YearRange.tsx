"use client"

import NumberFlow, { continuous } from "@number-flow/react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { useCountReveal } from "./Count"

const NO_GROUPING = { useGrouping: false } as const

/**
 * Zakres lat, w którym rok końcowy „dojeżdża” od roku początkowego
 * (2016 → 2026, cyfry przewijają się przez kolejne lata) — tylko gdy zakres
 * wchodzi w kadr przy przewijaniu; widoczny od pierwszej klatki stoi.
 */
export function YearRange({
  from,
  to,
  className,
}: {
  from: number
  to: number
  className?: string
}) {
  const [ref, phase] = useCountReveal<HTMLSpanElement>()
  const reduced = useReducedMotion()

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{`${from}–${to}`}</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        {from}–
        <NumberFlow
          value={phase === "armed" && !reduced ? from : to}
          format={NO_GROUPING}
          plugins={[continuous]}
          animated={phase === "go" && !reduced}
          willChange
        />
      </span>
    </span>
  )
}
