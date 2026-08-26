import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/main-fourth/Reveal"
import { pl } from "@/components/main-fourth/typography"
import type { SectionMeta } from "@/lib/home-content"

interface SectionProps {
  meta: SectionMeta
  children: ReactNode
  className?: string
}

export function Section({ meta, children, className }: SectionProps) {
  return (
    <section
      id={meta.id}
      aria-labelledby={`${meta.id}-title`}
      className={cn("m4-section scroll-mt-20", className)}
    >
      <div className="m4-container">{children}</div>
    </section>
  )
}

interface SectionHeadProps {
  meta: SectionMeta
  /** Akcja przy nagłówku (np. link do pełnej listy). */
  action?: ReactNode
}

/**
 * Nagłówek sekcji czyta się jak otwarcie rozdziału: numer, tytuł w kroju
 * display, pod nim jedno zdanie wprowadzenia w mierze do ok. 45 znaków.
 */
export function SectionHead({ meta, action }: SectionHeadProps) {
  return (
    <header className="m4-head">
      <Reveal as="p" className="m4-eyebrow">
        <span className="m4-numeral">{meta.index}</span>
        <span className="m4-rule" aria-hidden="true" />
        {meta.title}
      </Reveal>

      <div className="m4-head-body">
        <Reveal as="h2" variant="mask" id={`${meta.id}-title`} className="m4-h2">
          <span className="m4-line-in">{meta.title}</span>
        </Reveal>
        <div className="m4-head-aside">
          <Reveal as="p" i={1} className="m4-lead">
            {pl(meta.lead)}
          </Reveal>
          {action && (
            <Reveal i={2} className="mt-8">
              {action}
            </Reveal>
          )}
        </div>
      </div>
    </header>
  )
}
