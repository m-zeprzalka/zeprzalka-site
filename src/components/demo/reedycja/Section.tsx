import type { ReactNode } from "react"
import { cn } from "@/components/demo/forma/cn"
import { typo } from "@/components/demo/forma/typo"

/**
 * Szkielet sekcji z obecnej strony głównej — zostaje, bo działa: szyna
 * z tytułem, leadem i akcjami (3/12, lepka od 1024 px) i treść (9/12).
 * Nowe: jeden rytm odstępów, skala pisma Formy, akcje pod leadem.
 */
export function Section({
  id,
  title,
  lead,
  actions,
  children,
  className,
}: {
  id: string
  title: string
  lead: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("re-section", className)}>
      <div className="re-container grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--re-header)+2.5rem)]">
            <h2 id={`${id}-title`} tabIndex={-1} className="re-h2 outline-none">
              {typo(title)}
            </h2>
            <p className="mt-3 max-w-[22rem] text-pretty text-fm-ink-2 lg:mt-5 lg:text-[1.0625rem] lg:leading-[1.55]">
              {typo(lead)}
            </p>
            {actions && <div className="mt-6 flex flex-wrap items-center gap-2.5">{actions}</div>}
          </div>
        </div>
        <div className="min-w-0 lg:col-span-8 xl:col-span-9">{children}</div>
      </div>
    </section>
  )
}
