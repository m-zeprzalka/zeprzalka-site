import type { ComponentProps } from "react"
import { SECTION } from "@/lib/anchors"
import { SectionHeading } from "./section-heading"
import { WorkList } from "./work-list"

export function Work({
  title,
  lead,
  ...list
}: { title: string; lead: string } & ComponentProps<typeof WorkList>) {
  return (
    <section id={SECTION.work} aria-labelledby="portfolio-title" className="column mt-28 md:mt-36">
      <SectionHeading id="portfolio-title" title={title} lead={lead} />
      <div className="reveal">
        <WorkList {...list} />
      </div>
    </section>
  )
}
