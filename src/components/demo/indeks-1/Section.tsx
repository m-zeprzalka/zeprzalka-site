import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/components/demo/forma/cn"
import { ArmedText } from "./ArmedGlyph"

/**
 * Nagłówek sekcji jako jedno zdanie w jednej linii: tytuł w atramencie,
 * półpauza i lead małą literą w szarości („Kompetencje — umiejętności…”) —
 * bez dwóch wielkich liter obok siebie. Tytuł odczytuje się ze znaków sygnetu
 * tylko przy wejściu w kadr z dołu (widoczny przy załadowaniu stoi czytelny;
 * najechanie puszcza krótki przebieg). Rytm robi odstęp między sekcjami — bez numerów, liczników i linii.
 */
export function SectionHead({
  id,
  title,
  lead,
  enterAt,
}: {
  id: string
  title: string
  lead?: string
  /** Nagłówek w pierwszym oknie (telefon): wchodzi w „harmonijce” o tej porze (ms). */
  enterAt?: number
}) {
  return (
    <div
      style={enterAt === undefined ? undefined : ({ "--d": `${enterAt}ms` } as CSSProperties)}
      className={cn("mb-5 text-fm-body text-pretty sm:mb-6", enterAt !== undefined && "i1-enter")}
    >
      <h2
        id={`${id}-title`}
        tabIndex={-1}
        data-anchor-focus
        className="inline rounded-fm-xs font-medium text-fm-ink outline-none"
      >
        <ArmedText text={title} duration={0.8} />
      </h2>
      {lead && (
        <p className="inline text-fm-ink-3">
          <span aria-hidden="true"> — </span>
          {lead}
        </p>
      )}
    </div>
  )
}

export function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string
  title: string
  lead: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="i1-col scroll-mt-(--i1-header) pt-(--fm-section)"
    >
      <SectionHead id={id} title={title} lead={lead} />
      {children}
    </section>
  )
}
