"use client"

import { useSyncExternalStore } from "react"
import NumberFlow from "@number-flow/react"
import { useInView, useReducedMotion } from "@/components/demo/forma/use-in-view"

const noop = () => () => {}

/**
 * Liczba z „O mnie”, która dojeżdża do wartości, gdy wejdzie w kadr — ale od
 * ~80% wartości, nie od zera (żadnego „0+ klientów” w trakcie). HTML z serwera
 * ma od razu prawdziwą wartość; przy „ogranicz ruch” nic się nie rusza.
 */
export function Stat({ value, suffix }: { value: number; suffix?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>("0px 0px -10% 0px")
  const reduced = useReducedMotion()
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
  const start = Math.max(1, Math.round(value * 0.8))
  const shown = hydrated && !reduced && !inView ? start : value

  return (
    <span ref={ref}>
      <NumberFlow value={shown} suffix={suffix} locales="pl-PL" animated={!reduced} willChange />
    </span>
  )
}
