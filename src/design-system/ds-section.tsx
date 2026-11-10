import type { ReactNode } from "react"
import { SectionHeading } from "@/components/sections/section-heading"

/** Rozdział dostaje kotwicę i tytuł ze spisu (`CHAPTERS` w `app/(pl)/design-system/page.tsx`) — jedno źródło. */
export interface ChapterProps {
  id: string
  title: string
}

/** Rozdział design systemu: ten sam nagłówek i rytm co sekcje podstron (`Section`). */
export function DsSection({
  id,
  title,
  lead,
  children,
}: ChapterProps & { lead: string; children: ReactNode }) {
  return (
    // `data-peek-column` — jak start i „O mnie”: popover frazy na dotyku ma szerokość kolumny.
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-peek-column=""
      className="column mt-24 md:mt-32"
    >
      <SectionHeading id={`${id}-title`} title={title} lead={lead} />
      {/* `grid-cols-1` = minmax(0, 1fr): szeroki blok kodu przewija się, a nie rozpycha rozdziału. */}
      <div className="mt-6 grid grid-cols-1 gap-4 text-pretty text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

/** Krótki opis zasady w rozdziale. */
export function DsNote({ children }: { children: ReactNode }) {
  return <p className="max-w-[60ch] text-base">{children}</p>
}

/** Śródtytuł w rozdziale — grupa tabel albo przykładów. */
export function DsSubheading({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 text-sm font-medium text-foreground">{children}</h3>
}

/** Pogrubiony początek notatki — nazwa zasady przed jej opisem. */
export function Lead({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>
}

/** Nazwa z kodu w tekście (plik, klasa, token). */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.8125em] text-foreground">
      {children}
    </code>
  )
}

export interface TokenRow {
  token: string
  value: ReactNode
  use?: ReactNode
}

/** Tabela tokenów: nazwa z kodu, wartość i miejsce użycia (lista opisowa). */
export function TokenTable({ rows }: { rows: readonly TokenRow[] }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-2xl border bg-border">
      {rows.map((row) => (
        <div
          key={row.token}
          className="grid gap-1 bg-background px-5 py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4"
        >
          <dt className="font-mono text-xs wrap-break-word text-foreground">{row.token}</dt>
          <dd className="grid gap-0.5 text-sm">
            <span className="wrap-break-word text-foreground">{row.value}</span>
            {row.use && <span>{row.use}</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}
