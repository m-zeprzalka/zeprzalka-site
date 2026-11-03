import type { ReactNode } from "react"
import { cn } from "../forma/cn"

/**
 * Kafel kompetencji: nagłówek i jedno zdanie, a pod nimi „ekran” z działającym
 * mini-interfejsem. Promienie koncentryczne: kafel 24 px z odstępem 8 px,
 * ekran 16 px.
 */
export function Tile({
  title,
  description,
  className,
  children,
}: {
  title: string
  description: string
  className?: string
  children: ReactNode
}) {
  return (
    <article
      className={cn(
        "flex min-w-0 flex-col rounded-fm-3xl bg-fm-surface p-2 shadow-fm-card",
        className
      )}
    >
      <div className="px-4 pt-4 pb-5 md:px-5 md:pt-5 md:pb-6">
        <h3 className="text-fm-h3 font-semibold">{title}</h3>
        <p className="mt-1.5 max-w-[48ch] text-fm-small text-pretty text-fm-ink-2">{description}</p>
      </div>
      <div className="relative flex min-h-72 flex-1 flex-col overflow-hidden rounded-fm-xl bg-fm-fill">
        {children}
      </div>
    </article>
  )
}
