import type { ReactNode } from "react"
import { DecodeTitle } from "./DecodeTitle"

/**
 * Sekcja kolumny: nagłówek w tym samym dwutonowym rytmie co start (tytuł
 * w atramencie, lead w szarości), po prawej cicha liczba pozycji. Tytuł przy
 * wejściu w kadr odkodowuje się z cyfr binarnych, lead dopływa z rozmycia.
 * Odstęp między sekcjami robi rytm — bez numerów i linii.
 */
export function Section({
  id,
  title,
  lead,
  meta,
  children,
}: {
  id: string
  title: string
  lead: string
  meta?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="ixn-col scroll-mt-(--ixn-header) pt-(--fm-section)"
    >
      <div className="ixn-shead mb-5 flex items-baseline justify-between gap-6 sm:mb-6">
        <div className="min-w-0 flex-1 text-fm-body text-pretty">
          <h2
            id={`${id}-title`}
            tabIndex={-1}
            data-anchor-focus
            className="inline rounded-fm-xs font-medium text-fm-ink outline-none"
          >
            <DecodeTitle text={title} />
          </h2>{" "}
          <p className="ixn-shead__lead inline text-fm-ink-3">{lead}</p>
        </div>
        {meta && (
          <p className="ixn-shead__lead hidden shrink-0 text-fm-small text-fm-ink-3 tabular-nums sm:block">
            {meta}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}
