import type { CSSProperties, ReactNode } from "react"
import { cn } from "../forma/cn"
import { BlurWords } from "./BlurWords"

/**
 * Nagłówek sekcji — jeden dla całej strony: tytuł po lewej, opis i akcja po
 * prawej (na telefonie pod spodem), wyrównane do dolnej linii. Tytuł wyostrza
 * się słowo po słowie przy wejściu w kadr, opis chwilę po nim.
 */
export function SectionHeader({
  id,
  title,
  lead,
  aside,
  className,
}: {
  id: string
  title: string
  lead: string
  /** Akcja albo kontrolki po prawej stronie opisu. */
  aside?: ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        "grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16",
        className
      )}
    >
      <BlurWords as="h2" id={id} text={title} className="bo-h2 text-balance" />
      <div
        className="flex flex-col items-start gap-5 lg:pb-1.5"
        data-bo-in=""
        style={{ "--i": 2 } as CSSProperties}
      >
        <p className="text-fm-lead text-pretty text-fm-ink-2">{lead}</p>
        {aside}
      </div>
    </header>
  )
}
