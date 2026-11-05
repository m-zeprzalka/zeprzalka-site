import type { DemoHomeContent, DemoWork } from "../shared/content"
import { AllLink } from "./AllLink"
import { SECTIONS } from "./ids"
import { SectionHeader } from "./SectionHeader"
import { Slider } from "./Slider"
import { UI } from "./ui-strings"

/**
 * Portfolio: nagłówek z odnośnikiem „Wszystkie realizacje” (bez licznika) i jeden
 * nieskończony slider prac cyfrowych (produkty i strony). Treści wizualne
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
      data-b2-section={SECTIONS.portfolio}
      aria-labelledby="b2-portfolio-title"
      className="scroll-mt-24 pt-(--fm-section)"
    >
      <SectionHeader
        id="b2-portfolio-title"
        className="fm-container"
        title={portfolio.title}
        lead={portfolio.lead}
        aside={<AllLink href={portfolio.link.href} label={UI.allWorks} />}
      />
      <div data-b2-in="" className="mt-10 sm:mt-14">
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
