import type { DemoHomeContent, DemoWork } from "../shared/content"
import { SECTIONS } from "./ids"
import { Masonry } from "./Masonry"
import { SectionHeader } from "./SectionHeader"

/**
 * Wideo i animacja: treści wizualne w masonry („najlepsza opcja prezentowania
 * treści wizualnych”) z efektem glifów („jakiś kosmos”). Nazwa i opis to grupa
 * realizacji z serwisu; prace cyfrowe są w sliderze wyżej — bez powtórzeń.
 */
export function VideoWorks({
  portfolio,
  works,
}: {
  portfolio: DemoHomeContent["portfolio"]
  works: readonly DemoWork[]
}) {
  const group = portfolio.groups.find((item) => item.id === works[0]?.group)
  if (!group) return null

  return (
    <section
      id={SECTIONS.video}
      data-b2-section={SECTIONS.video}
      aria-labelledby="b2-video-title"
      className="fm-container scroll-mt-24 pt-(--fm-section)"
    >
      <SectionHeader id="b2-video-title" title={group.label} lead={group.description} />
      <div className="mt-12 sm:mt-16">
        <Masonry works={works} />
      </div>
    </section>
  )
}
