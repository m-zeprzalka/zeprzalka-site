"use client"

import { useSyncExternalStore } from "react"
import NumberFlow, { continuous } from "@number-flow/react"
import { useInView, useReducedMotion } from "@/components/demo/forma/use-in-view"

const noop = () => () => {}
const NO_GROUPING = { useGrouping: false } as const

/**
 * Zakres lat, w którym rok końcowy „dojeżdża” od roku początkowego
 * (2016 → 2026, cyfry przewijają się przez kolejne lata). Serwer i hydratacja
 * pokazują od razu prawdziwy zakres; przy „ogranicz ruch” nic się nie rusza.
 * Wariant `Count` z Formy, który startuje od zera — tu start to rok `from`.
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
  const [ref, inView] = useInView<HTMLSpanElement>("0px 0px -10% 0px")
  const reduced = useReducedMotion()
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
  const shown = hydrated && !reduced && !inView ? from : to

  return (
    <span ref={ref} className={className}>
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
