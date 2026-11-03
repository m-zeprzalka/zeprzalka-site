"use client"

import { useSyncExternalStore } from "react"
import NumberFlow, { type Format } from "@number-flow/react"
import { useInView, useReducedMotion } from "./use-in-view"

/**
 * Liczba, która „dojeżdża” do wartości cyfra po cyfrze, gdy wejdzie w kadr
 * (Number Flow, formatowanie przez Intl — po polsku „99,28%”). HTML z serwera
 * ma od razu prawdziwą wartość; przy „ogranicz ruch” nic się nie animuje.
 */
const noop = () => () => {}

export function Count({
  value,
  format,
  prefix,
  suffix,
  locale = "pl-PL",
  className,
}: {
  value: number
  format?: Format
  prefix?: string
  suffix?: string
  locale?: string
  className?: string
}) {
  const [ref, inView] = useInView<HTMLSpanElement>("0px 0px -10% 0px")
  const reduced = useReducedMotion()
  // Serwer i hydratacja renderują wartość docelową; zaraz potem (klient) liczba
  // cofa się do zera i rusza, gdy element wejdzie w kadr.
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
  const shown = hydrated && !reduced && !inView ? 0 : value

  return (
    <span ref={ref} className={className}>
      <NumberFlow
        value={shown}
        format={format}
        locales={locale}
        prefix={prefix}
        suffix={suffix}
        animated={!reduced}
        willChange
      />
    </span>
  )
}
