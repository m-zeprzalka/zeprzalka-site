import { ArrowUpRight } from "lucide-react"
import type { DemoHomeContent, DemoWork } from "../shared/content"
import { SECTIONS } from "./ids"
import { SectionHeader } from "./SectionHeader"
import { Slider } from "./Slider"
import { UI } from "./ui-strings"

/**
 * Portfolio: nagłówek z odnośnikiem do pełnej strony i jeden nieskończony
 * slider prac cyfrowych (produkty i strony). Sekcja „dokuje” pod kadrem
 * reelu (`bo-dock`) — po odpięciu sceny stoi tuż pod nim. Treści wizualne
 * (wideo) mają własną sekcję z masonry — każda realizacja występuje raz.
 */
export function Portfolio({
  portfolio,
  works,
}: {
  portfolio: DemoHomeContent["portfolio"]
  works: readonly DemoWork[]
}) {
  return (
    <section
      id={SECTIONS.portfolio}
      data-bo-section={SECTIONS.portfolio}
      aria-labelledby="bo-portfolio-title"
      className="bo-dock scroll-mt-24 pt-(--fm-section)"
    >
      <SectionHeader
        id="bo-portfolio-title"
        className="fm-container"
        title={portfolio.title}
        lead={portfolio.lead}
        aside={
          <a
            href={portfolio.link.href}
            className="group inline-flex h-11 items-center gap-1.5 rounded-full bg-fm-surface ps-4 pe-3.5 text-sm font-medium shadow-fm-ring fm-focus transition-colors hover:bg-fm-fill"
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
      <div data-bo-in="" className="mt-10 sm:mt-14">
        <Slider
          works={works}
          labels={{
            region: portfolio.title,
            previous: UI.sliderPrevious,
            next: UI.sliderNext,
            pause: UI.sliderPause,
            play: UI.sliderPlay,
            preview: UI.preview,
          }}
        />
      </div>
    </section>
  )
}
