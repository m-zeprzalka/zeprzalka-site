import type { ReactNode } from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

/**
 * Rusztowanie strony /design-system. Świadomie zbudowane z tych samych
 * elementów, które opisuje: kontener, siatka 12 kolumn, etykiety w wersalikach,
 * karty z obrysem. Katalog wygląda więc dokładnie tak, jak serwis, który
 * dokumentuje.
 */

export interface DsEntry {
  id: string
  title: string
}

interface SectionProps {
  id: string
  title: string
  description?: string
  children: ReactNode
}

export function DsSection({ id, title, description, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-12 first:pt-0 md:py-16">
      <header className="mb-8 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </header>
      <div className="flex flex-col gap-12">{children}</div>
      <Separator className="mt-12 md:mt-16" />
    </section>
  )
}

interface BlockProps {
  title: string
  description?: ReactNode
  /** Uwaga o stanie faktycznym: gdzie kod odbiega od zamierzenia. */
  note?: ReactNode
  children: ReactNode
  className?: string
}

export function DsBlock({
  title,
  description,
  note,
  children,
  className,
}: BlockProps) {
  return (
    <article className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
      {note && (
        <p className="border-l-2 border-primary/40 pl-4 text-sm text-muted-foreground leading-relaxed">
          {note}
        </p>
      )}
    </article>
  )
}

/** Etykieta w wersalikach — wzorzec z /o-mnie i /kontakt. */
export function DsLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-xs font-medium uppercase tracking-widest text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  )
}

interface PreviewProps {
  /** Podpis nad ramką — co dokładnie pokazuje próbka. */
  label?: string
  /** Klasy lub fragment kodu opisujący próbkę. */
  code?: string
  children: ReactNode
  className?: string
}

export function DsPreview({ label, code, children, className }: PreviewProps) {
  return (
    <figure className="flex flex-col gap-2">
      {label && <DsLabel>{label}</DsLabel>}
      <div
        className={cn(
          "rounded-lg border bg-card p-6 text-card-foreground",
          className
        )}
      >
        {children}
      </div>
      {code && (
        <figcaption>
          <DsCode>{code}</DsCode>
        </figcaption>
      )}
    </figure>
  )
}

export function DsCode({ children }: { children: ReactNode }) {
  return (
    <code className="block overflow-x-auto rounded border bg-muted px-2 py-1.5 font-mono text-xs leading-relaxed text-muted-foreground">
      {children}
    </code>
  )
}

export function DsInline({ children }: { children: ReactNode }) {
  return (
    <code className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[0.8125rem]">
      {children}
    </code>
  )
}

/** Tabela specyfikacji: nazwa → wartość → zastosowanie. */
export function DsTable({
  head,
  rows,
}: {
  head: string[]
  rows: ReactNode[][]
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/50">
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="border-b px-4 py-3 text-left font-medium whitespace-nowrap"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "px-4 py-3 align-top",
                    cellIndex === 0 && "font-mono text-xs whitespace-nowrap",
                    cellIndex > 0 && "text-muted-foreground"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
