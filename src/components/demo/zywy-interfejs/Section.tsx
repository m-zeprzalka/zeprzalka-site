import type { ReactNode } from "react"
import { cn } from "../forma/cn"
import { typo } from "../forma/typo"

/** Nagłówek sekcji: tytuł i lead w dwóch tonach, opcjonalna akcja po prawej. */
export function Section({
  id,
  title,
  lead,
  action,
  className,
  children,
}: {
  id: string
  title: string
  lead: string
  action?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("fm-container scroll-mt-24 py-[calc(var(--fm-section)/2)]", className)}
    >
      <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
        <h2 id={`${id}-title`} className="max-w-[24ch] text-fm-h2 font-semibold text-balance">
          {typo(title)}
          <span className="text-fm-ink-3"> {typo(lead)}</span>
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
