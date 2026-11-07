import type { ReactNode } from "react"
import { SectionHeading } from "@/app/main-page/_components/sections/section-heading"
import { cn } from "@/lib/utils"

/**
 * Sekcja podstrony: kolumna, nagłówek w jednym wierszu („Tytuł — rozwinięcie”,
 * odczyt ze znaków) i treść. Kotwica sekcji = `id`, nagłówek = `${id}-title`.
 */
export function Section({
  id,
  title,
  lead,
  className,
  children,
}: {
  id: string
  title: string
  lead?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("column mt-24 md:mt-32", className)}
    >
      <SectionHeading id={`${id}-title`} title={title} lead={lead} />
      {children}
    </section>
  )
}
