"use client"

import { useSyncExternalStore } from "react"
import NumberFlow, { type Format } from "@number-flow/react"
import { useInView, useReducedMotion } from "@/components/demo/forma/use-in-view"

const noop = () => () => {}

/**
 * `Count` z Formy z jedną różnicą: liczba może startować z dowolnej wartości.
 * Dzięki temu okres „2016–2026” nie liczy od zera, tylko przewija dekadę
 * (2016 → 2026). HTML z serwera i hydratacja mają od razu wartość docelową;
 * przy „ogranicz ruch” nic się nie rusza.
 */
export function Tally({
  value,
  from = 0,
  format,
  prefix,
  suffix,
  className,
}: {
  value: number
  from?: number
  format?: Format
  prefix?: string
  suffix?: string
  className?: string
}) {
  const [ref, inView] = useInView<HTMLSpanElement>("0px 0px -12% 0px")
  const reduced = useReducedMotion()
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
  const shown = hydrated && !reduced && !inView ? from : value

  return (
    <span ref={ref} className={className}>
      <NumberFlow
        value={shown}
        format={format}
        locales="pl-PL"
        prefix={prefix}
        suffix={suffix}
        animated={!reduced}
        willChange
      />
    </span>
  )
}
