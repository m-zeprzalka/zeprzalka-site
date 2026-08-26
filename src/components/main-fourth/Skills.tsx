import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Reveal } from "@/components/main-fourth/Reveal"
import { Section, SectionHead } from "@/components/main-fourth/Section"
import { pl } from "@/components/main-fourth/typography"
import { sections, skills } from "@/lib/home-content"

/**
 * Kompetencje jako spis rozdziałów: numer, tytuł w kroju display, a po
 * rozwinięciu opis w mierze czytelniczej i lista narzędzi.
 */
export function Skills() {
  return (
    <Section meta={sections.skills}>
      <SectionHead meta={sections.skills} />

      <Accordion type="single" collapsible defaultValue={skills[0].id} className="m4-list">
        {skills.map((skill, index) => (
          <Reveal as="div" i={index} key={skill.id}>
            <AccordionItem value={skill.id} className="m4-item">
              <AccordionTrigger className="m4-item-trigger">
                <span className="m4-item-head">
                  <span className="m4-numeral">{skill.number}</span>
                  <span className="m4-item-title">{skill.title}</span>
                </span>
                <span className="m4-plus" aria-hidden="true" />
              </AccordionTrigger>

              <AccordionContent className="m4-item-body">
                <div className="m4-item-grid">
                  <p className="m4-prose">{pl(skill.description)}</p>
                  <ul aria-label={`Narzędzia: ${skill.title}`} className="m4-tools">
                    {skill.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Reveal>
        ))}
      </Accordion>
    </Section>
  )
}
