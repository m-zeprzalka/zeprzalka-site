import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Reveal } from "@/components/main-secondary/Reveal"
import { Section, SectionHeader } from "@/components/main-secondary/Section"
import { sections, skills } from "@/lib/home-content"

export function Skills() {
  return (
    <Section meta={sections.skills}>
      <SectionHeader meta={sections.skills} />

      <Reveal delay={120}>
        <Accordion type="single" collapsible defaultValue={skills[0].id}>
          {skills.map((skill) => (
            <AccordionItem
              key={skill.id}
              value={skill.id}
              className="first:border-t"
            >
              <AccordionTrigger className="items-center gap-6 py-7 hover:no-underline md:py-9 lg:py-11 [&>svg]:size-6 [&>svg]:translate-y-0 [&>svg]:duration-300 md:[&>svg]:size-8">
                <span className="grid grid-cols-[3ch_1fr] items-baseline gap-4 md:grid-cols-[5ch_1fr] md:gap-8">
                  <span className="ms-index" aria-hidden="true">
                    {skill.number}
                  </span>
                  <span className="ms-h3">{skill.title}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-10 md:pb-12 lg:pb-14">
                <div className="grid gap-4 md:grid-cols-[5ch_1fr] md:gap-8">
                  <span className="hidden md:block" aria-hidden="true" />
                  <div className="flex max-w-3xl flex-col gap-8">
                    <p className="text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl lg:text-2xl">
                      {skill.description}
                    </p>
                    <ul
                      aria-label={`Narzędzia: ${skill.title}`}
                      className="ms-tags"
                    >
                      {skill.tools.map((tool) => (
                        <li key={tool}>{tool}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  )
}
