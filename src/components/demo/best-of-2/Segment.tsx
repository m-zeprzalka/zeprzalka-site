import type { CSSProperties, ReactNode } from "react"
import { typo } from "../forma/typo"

/**
 * Segment kompetencji: linia podziału, po lewej nazwa, jedno zdanie
 * i narzędzia (od 1024 px przyklejone przy przewijaniu obok sceny), po prawej
 * scena w karcie. Siatka 12 kolumn: tekst 1–4, scena 5–12 (na telefonie jedna
 * pod drugą). Promienie koncentryczne: panel − odstęp 8 px = scena.
 */
export function Segment({
  title,
  text,
  tools,
  toolsLabel,
  children,
}: {
  title: string
  text: string
  tools: readonly string[]
  toolsLabel: string
  children: ReactNode
}) {
  return (
    <article className="grid gap-6 border-t border-fm-edge py-8 sm:py-10 lg:grid-cols-12 lg:gap-x-(--b2-gap) lg:py-12">
      <div data-b2-in="" className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
        <h3 className="text-[1.375rem] leading-[1.2] font-[550] tracking-[-0.025em] sm:text-[1.625rem]">
          {title}
        </h3>
        <p className="mt-3 max-w-[46ch] text-fm-body text-pretty text-fm-ink-2">{typo(text)}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={toolsLabel}>
          {tools.map((tool) => (
            <li
              key={tool}
              className="inline-flex h-7 items-center rounded-full bg-fm-fill px-3 text-fm-micro font-medium text-fm-ink-2"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>
      <div
        data-b2-in=""
        style={{ "--i": 1 } as CSSProperties}
        className="rounded-(--b2-r-panel) bg-fm-surface p-2 shadow-fm-card lg:col-span-8"
      >
        <div className="@container relative flex min-h-[22rem] flex-col overflow-hidden rounded-(--b2-r-scene) bg-fm-fill sm:min-h-[24rem]">
          {children}
        </div>
      </div>
    </article>
  )
}
