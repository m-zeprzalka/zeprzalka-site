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
    // Jedna grupa wygaszania (`tk-dim`) dla wierszy widocznych i rozwiniętych.
    <div className="tk-dim">
      <div className="tk-fade" data-collapsed={!expanded || undefined}>
        {head}
      </div>
      <div id={restId} className="tk-panel" data-open={expanded || undefined} inert={!expanded}>
        <div>{rest}</div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-4 whitespace-nowrap sm:ps-(--tk-lane)">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={restId}
          onClick={() => setExpanded((value) => !value)}
          className="group -ms-3 inline-flex h-11 fm-press items-center gap-1.5 rounded-full px-3 text-fm-small font-medium text-fm-ink-2 fm-focus transition-[background-color,color,scale] duration-150 hover:bg-fm-fill hover:text-fm-ink sm:h-10"
        >
          {expanded ? labels.less : labels.more}
          {!expanded && <span className="text-fm-ink-3 tabular-nums">{count}</span>}
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
