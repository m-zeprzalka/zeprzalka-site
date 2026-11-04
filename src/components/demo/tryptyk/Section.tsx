import type { ReactNode } from "react"
import { cn } from "../forma/cn"

/**
 * Sekcja kolumny: nagłówek w tym samym dwutonowym rytmie co pierwszy ekran
 * (tytuł w atramencie, lead w szarości), po prawej cicha liczba pozycji.
 * Odstęp między sekcjami robi rytm — bez numerów i linii.
 */
export function Section({
  id,
  title,
  lead,
  meta,
  className,
  children,
}: {
  id: string
  title: string
  lead: string
  meta?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("pt-(--fm-section)", className)}>
      <div className="mb-5 flex items-baseline justify-between gap-6 sm:mb-6">
        <div className="min-w-0 flex-1 text-fm-body text-pretty xl:text-[1.0625rem]">
          <h2
            id={`${id}-title`}
            tabIndex={-1}
            data-anchor-focus
            className="inline rounded-fm-xs font-medium text-fm-ink outline-none"
          >
            {title}
          </h2>{" "}
          <p className="inline text-fm-ink-3">{lead}</p>
        </div>
        {meta && (
          <p className="hidden shrink-0 text-fm-small text-fm-ink-3 tabular-nums sm:block">
            {meta}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}
