import { ArrowUpRight } from "lucide-react"
import type { DemoHomeContent, DemoWork } from "../shared/content"
import { SectionHeader } from "./SectionHeader"
import { Works } from "./Works"

/**
 * Portfolio: nagłówek z odnośnikiem do pełnej strony i masonry treści
 * wizualnych (grupa „Wideo i animacja”). Prace cyfrowe są w pokazie pod
 * hero — każda realizacja występuje na stronie raz.
 */
export function Portfolio({
  portfolio,
  works,
}: {
  portfolio: DemoHomeContent["portfolio"]
  works: readonly DemoWork[]
}) {
  const group = portfolio.groups.find((item) => item.id === works[0]?.group)

  return (
    <section
      id="realizacje"
      data-es-section="realizacje"
      aria-labelledby="realizacje-title"
      className="fm-container scroll-mt-24 pt-(--fm-section)"
    >
      <SectionHeader
        id="realizacje-title"
        title={portfolio.title}
        lead={portfolio.lead}
        aside={
          <a
            href={portfolio.link.href}
            className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-fm-surface ps-4 pe-3.5 text-sm font-medium shadow-fm-ring fm-focus transition-colors hover:bg-fm-fill"
          >
            {portfolio.link.label}
            <span className="text-fm-micro text-fm-ink-3 tabular-nums">
              {portfolio.works.length}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-fm-ink-3 transition-[translate,color] duration-150 group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fm-ink"
            />
          </a>
        }
      />
      {group && (
        <div className="mt-12 flex flex-col gap-1.5 sm:mt-16 sm:flex-row sm:items-baseline sm:gap-6">
          <h3 className="flex shrink-0 items-baseline gap-2 text-fm-small font-medium">
            {group.label}
            <span className="text-fm-ink-3 tabular-nums">{works.length}</span>
          </h3>
          <p className="max-w-[52ch] text-fm-small text-pretty text-fm-ink-3">
            {group.description}
          </p>
        </div>
      )}
      <div className="mt-6">
        <Works works={works} />
      </div>
    </section>
  )
}
