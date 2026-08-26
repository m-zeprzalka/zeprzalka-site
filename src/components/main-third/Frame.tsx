import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Rise } from "@/components/main-third/Rise"
import type { SectionMeta } from "@/lib/home-content"

interface FrameProps {
  meta: SectionMeta
  /** Treść nagłówka po prawej: lead + opcjonalna akcja. */
  aside?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Rama sekcji w systemie 12 kolumn:
 *
 *   ├─ linia włosowa na całą szerokość
 *   ├─ [01]  sticky etykieta w rynnie (≥lg)  │  H2 + lead
 *   └─ treść wyrównana do kolumny 3
 *
 * Etykieta zostaje przyklejona przez całą sekcję — to ona pełni rolę
 * nawigacji („gdzie jestem”), więc strona nie potrzebuje pływającego chromu.
 */
export function Frame({ meta, aside, children, className }: FrameProps) {
  return (
    <section
      id={meta.id}
      aria-labelledby={`${meta.id}-title`}
      className={cn("border-t border-border/60 scroll-mt-16", className)}
    >
      <div className="container mx-auto grid gap-x-6 gap-y-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-12 lg:py-32">
        <div className="min-w-0 lg:col-span-2">
          <p className="m3-label lg:sticky lg:top-24">
            <span className="m3-num">{meta.index}</span>
            <span className="text-foreground/70"> {meta.title}</span>
          </p>
        </div>

        {/* min-w-0: bez tego kolumna siatki rozciąga się do szerokości
            najszerszej treści (poziomy pas realizacji) i rozpycha stronę. */}
        <div className="grid min-w-0 gap-x-6 gap-y-8 lg:col-span-10 lg:grid-cols-10">
          <header className="grid gap-6 lg:col-span-10 lg:grid-cols-10 lg:items-end">
            <Rise as="h2" id={`${meta.id}-title`} className="m3-h2 lg:col-span-6">
              {meta.title}
            </Rise>
            <Rise i={1} className="flex flex-col gap-5 lg:col-span-4">
              <p className="m3-lead">{meta.lead}</p>
              {aside}
            </Rise>
          </header>

          <div className="min-w-0 lg:col-span-10">{children}</div>
        </div>
      </div>
    </section>
  )
}
