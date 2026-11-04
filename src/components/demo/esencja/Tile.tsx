import type { CSSProperties, ReactNode } from "react"
import { cn } from "../forma/cn"

/**
 * Kafel kompetencji: najpierw działająca scena, pod nią nazwa, jedno zdanie
 * i narzędzia. Promienie koncentryczne: karta 32 px − odstęp 8 px = scena 24 px.
 */
export function Tile({
  title,
  description,
  tools,
  index,
  className,
  children,
}: {
  title: string
  description: string
  tools: readonly string[]
  /** Kolejność w rzędzie — opóźnienie wejścia (drugi kafel chwilę po pierwszym). */
  index: number
  className?: string
  children: ReactNode
}) {
  return (
    <article
      data-es-in=""
      style={{ "--i": index } as CSSProperties}
      className={cn(
        "flex min-w-0 flex-col rounded-[2rem] bg-fm-surface p-2 shadow-fm-card",
        className
      )}
    >
      <div className="@container relative flex min-h-[20rem] flex-1 flex-col overflow-hidden rounded-[1.5rem] bg-fm-fill sm:min-h-[22rem]">
        {children}
      </div>
      <div className="px-4 pt-5 pb-4 sm:px-5 sm:pb-5">
        <h3 className="text-fm-h3 font-[550]">{title}</h3>
        <p className="mt-1.5 max-w-[48ch] text-fm-small text-pretty text-fm-ink-2">{description}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Narzędzia">
          {tools.map((tool) => (
            <li
              key={tool}
              className="inline-flex h-7 items-center rounded-full bg-fm-fill px-2.5 text-fm-micro font-medium text-fm-ink-2"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/** Przycisk powtórki w rogu sceny — ten sam we wszystkich kaflach. */
export const replayButton =
  "absolute top-3 right-3 z-10 grid size-9 fm-press place-items-center rounded-full bg-fm-surface/80 text-fm-ink-2 shadow-fm-ring backdrop-blur fm-focus transition-[background-color,color,scale] after:absolute after:-inset-1.5 after:content-[''] hover:text-fm-ink"
