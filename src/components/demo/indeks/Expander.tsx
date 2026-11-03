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
  count,
  labels,
  aside,
}: {
  head: ReactNode
  rest: ReactNode
  count: number
  labels: { more: string; less: string }
  /** Element po prawej stronie przycisku (np. link do archiwum). */
  aside?: ReactNode
}) {
  const [expanded, setExpanded] = useState(false)
  const restId = useId()

  return (
    // Jedna grupa wygaszania (`ix-dim`) dla wierszy widocznych i rozwiniętych.
    <div className="ix-dim">
      <div className="ix-fade" data-collapsed={!expanded || undefined}>
        {head}
      </div>
      <div id={restId} className="ix-panel" data-open={expanded || undefined} inert={!expanded}>
        <div>{rest}</div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-4 whitespace-nowrap sm:ps-(--ix-lane)">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={restId}
          onClick={() => setExpanded((value) => !value)}
          className="group fm-focus fm-press text-fm-small text-fm-ink-2 hover:text-fm-ink hover:bg-fm-fill -ms-3 inline-flex h-11 items-center gap-1.5 rounded-full px-3 font-medium transition-[background-color,color,scale] duration-150 sm:h-10"
        >
          {expanded ? labels.less : labels.more}
          {!expanded && <span className="text-fm-ink-3 tabular-nums">{count}</span>}
          <ChevronDown
            aria-hidden="true"
            className="text-fm-ink-3 ease-fm-snap size-4 transition-transform duration-300 group-aria-expanded:rotate-180"
          />
        </button>
        {aside}
      </div>
    </div>
  )
}
