import { SECTION } from "@/app/main-page/_lib/anchors"
import type { Skill } from "@/app/main-page/_lib/types"
import { SectionHeading } from "./section-heading"
import { SkillList } from "./skill-list"

export function Skills({
  title,
  lead,
  items,
}: {
  title: string
  lead: string
  items: readonly Skill[]
}) {
  return (
    <section
      id={SECTION.skills}
      aria-labelledby="kompetencje-title"
      className="column mt-28 md:mt-36"
    >
      <SectionHeading id="kompetencje-title" title={title} lead={lead} />
      <SkillList items={items} />
    </section>
  )
}
