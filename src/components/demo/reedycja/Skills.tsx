import type { DemoHomeContent } from "@/components/demo/shared/content"
import { SECTION } from "./ids"
import { Section } from "./Section"
import { SkillsAccordion } from "./SkillsAccordion"

export function Skills({ skills }: { skills: DemoHomeContent["skills"] }) {
  return (
    <Section id={SECTION.skills} title={skills.title} lead={skills.lead}>
      <SkillsAccordion items={skills.items} />
    </Section>
  )
}
