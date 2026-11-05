"use client"

import { useId, useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"

/**
 * Zwinięta lista z miękkim wygaszeniem u dołu i przyciskiem „Pokaż wszystkie”.
 * Ukryta część jest `inert` (żadnego fokusu w niewidocznych linkach), a jej
 * wysokość rozwija się przez siatkę 0fr → 1fr — bez mierzenia w JS.
 */
export function Expander({
  head,
  rest,
  labels,
  aside,
}: {
  head: ReactNode
  rest: ReactNode
  labels: { more: string; less: string }
  /** Element po prawej stronie przycisku (np. link do archiwum). */
  aside?: ReactNode
}) {
  const [expanded, setExpanded] = useState(false)
  const restId = useId()

  return (
    // Jedna grupa wygaszania (`i1-dim`) dla wierszy widocznych i rozwiniętych.
    <div className="i1-dim">
      <div
        data-collapsed={!expanded || undefined}
        className="relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-28 after:bg-linear-to-b after:from-transparent after:to-fm-canvas after:to-92% after:opacity-0 after:transition-opacity after:duration-300 after:ease-fm-snap after:content-[''] data-collapsed:after:opacity-100"
      >
        {head}
      </div>
      <div
        id={restId}
        data-open={expanded || undefined}
        inert={!expanded}
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[320ms] ease-fm-snap *:min-h-0 *:overflow-hidden data-instant:transition-none data-open:grid-rows-[1fr]"
      >
        <div>{rest}</div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-4 whitespace-nowrap sm:ps-(--i1-lane)">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={restId}
          onClick={() => setExpanded((value) => !value)}
          className="group -ms-3 inline-flex h-11 fm-press items-center gap-1.5 rounded-full px-3 text-fm-small font-medium text-fm-ink-2 fm-focus transition-[background-color,color,scale] duration-150 hover:bg-fm-fill hover:text-fm-ink sm:h-10"
        >
          {expanded ? labels.less : labels.more}
          <ChevronDown
            aria-hidden="true"
            className="size-4 text-fm-ink-3 transition-transform duration-300 ease-fm-snap group-aria-expanded:rotate-180"
          />
        </button>
        {aside}
      </div>
    </div>
  )
}
