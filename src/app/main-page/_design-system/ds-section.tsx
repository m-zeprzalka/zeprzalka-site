import type { ReactNode } from "react"
import { SectionHeading } from "@/app/main-page/_components/sections/section-heading"

/** Rozdział design systemu: ten sam nagłówek co sekcje strony głównej. */
export function DsSection({
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
    <section id={id} aria-labelledby={`${id}-title`} className="column mt-24">
      <SectionHeading id={`${id}-title`} title={title} lead={lead} />
      <div className="mt-6 grid gap-4 text-pretty text-muted-foreground">{children}</div>
    </section>
  )
}

/** Krótki opis zasady w rozdziale. */
export function DsNote({ children }: { children: ReactNode }) {
  return <p className="max-w-[60ch] text-base">{children}</p>
}

/** Nazwa z kodu w tekście (plik, klasa, token). */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.8125em] text-foreground">
      {children}
    </code>
  )
}
