"use client"

import { useRef } from "react"
import { useReveal } from "@/lib/hooks"

/** Pociągnięcie: czeka niewidoczne, potem rysuje się (`animate-draw`, globals.css). */
const STROKE =
  "[stroke-dasharray:1] group-data-[state=armed]/new:[stroke-dashoffset:1] group-data-[state=playing]/new:animate-draw"

/**
 * „Nowy” obwiedziony odręczną elipsą z dwóch pociągnięć — rysuje się raz,
 * gdy wiersz wjedzie w kadr, jak notatka na marginesie. Bez JS, przy „ogranicz
 * ruch” i gdy znak jest w kadrze od razu — elipsa stoi narysowana.
 */
export function NewMark({ label }: { label: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const state = useReveal(ref, { rootMargin: "0px 0px -20% 0px" })

  return (
    <span
      ref={ref}
      data-state={state}
      className="group/new relative ms-3 inline-block px-1.5 align-[0.1em] text-xs font-medium whitespace-nowrap"
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
        className="pointer-events-none absolute -top-1.5 -left-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+0.75rem)] overflow-visible"
      >
        <path
          pathLength={1}
          className={STROKE}
          d="M40 3.5C24 1.5 6 4.5 3 12.5c-2.5 7 12 11.5 30 11 17-.5 29-5 28.5-11.5C61 6 47 2.5 33 2.8"
        />
        <path
          pathLength={1}
          className={`${STROKE} [animation-delay:600ms] [animation-duration:300ms]`}
          d="M33 2.8c-6 .2-11 1-14.5 2.4"
        />
      </svg>
    </span>
  )
}
