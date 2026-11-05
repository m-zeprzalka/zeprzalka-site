"use client"

import { useSyncExternalStore } from "react"
import { useInView, useReducedMotion } from "@/components/demo/forma/use-in-view"

const noop = () => () => {}

/**
 * „Nowy” obwiedziony odręczną elipsą z dwóch pociągnięć — rysuje się raz
 * (440 + 300 ms), gdy wiersz wejdzie w kadr, jak notatka na marginesie.
 * Serwer i „ogranicz ruch” pokazują elipsę od razu, narysowaną.
 */
export function NewMark({ label }: { label: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>("0px 0px -20% 0px")
  const reduced = useReducedMotion()
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
  const armed = hydrated && !reduced

  return (
    <span
      ref={ref}
      data-armed={armed || undefined}
      data-drawn={inView || undefined}
      className="i1-new relative ms-3 inline-block px-1.5 align-[0.12em] text-fm-micro font-medium whitespace-nowrap text-fm-ink"
    >
      {label}
      <svg
        aria-hidden="true"
        viewBox="0 0 64 28"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        className="pointer-events-none absolute -top-[0.4rem] -left-[0.35rem] h-[calc(100%+0.8rem)] w-[calc(100%+0.7rem)] overflow-visible"
      >
        <path
          pathLength={1}
          d="M40 3.5C24 1.5 6 4.5 3 12.5c-2.5 7 12 11.5 30 11 17-.5 29-5 28.5-11.5C61 6 47 2.5 33 2.8"
        />
        <path pathLength={1} d="M33 2.8c-6 .2-11 1-14.5 2.4" />
      </svg>
    </span>
  )
}
