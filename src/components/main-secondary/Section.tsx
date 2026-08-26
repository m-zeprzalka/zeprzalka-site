import type { ReactNode } from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/main-secondary/Reveal"
import type { SectionMeta } from "@/lib/home-content"

interface SectionProps {
  meta: SectionMeta
  className?: string
  children: ReactNode
}

/**
 * Sekcja strony: landmark `<section aria-labelledby>` + siatka kontenera.
 * Linia rozdzielająca jest wewnątrz kontenera, więc wyrównuje się do marginesów siatki.
 */
export function Section({ meta, className, children }: SectionProps) {
  return (
    <section
      id={meta.id}
      aria-labelledby={`${meta.id}-title`}
      className={cn("scroll-mt-20", className)}
    >
      <div className="container mx-auto px-4 md:px-6">
        <Separator />
        <div className="flex flex-col gap-12 py-20 md:gap-16 md:py-28 lg:gap-20 lg:py-36">
          {children}
        </div>
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  meta: SectionMeta
  /** Opcjonalna akcja (np. link do pełnej listy) — renderowana pod leadem. */
  action?: ReactNode
}

export function SectionHeader({ meta, action }: SectionHeaderProps) {
  return (
    <header className="grid items-end gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="flex flex-col gap-4 lg:col-span-7">
        <Reveal as="span" aria-hidden="true" className="ms-index">
          {meta.index}
        </Reveal>
        <Reveal as="h2" id={`${meta.id}-title`} delay={60} className="ms-h2">
          {meta.title}
        </Reveal>
      </div>
      <div className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
        <Reveal as="p" delay={120} className="ms-lead">
          {meta.lead}
        </Reveal>
        {action && <Reveal delay={180}>{action}</Reveal>}
      </div>
    </header>
  )
}
