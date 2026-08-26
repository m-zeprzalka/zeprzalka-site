import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Frame } from "@/components/main-third/Frame"
import { Rise } from "@/components/main-third/Rise"
import { sections, skills } from "@/lib/home-content"

/**
 * Kompetencje jako karta katalogowa: numer w rynnie, tytuł w kroju display,
 * a po rozwinięciu opis i lista narzędzi w układzie tabelarycznym.
 * `type="multiple"` — użytkownik może zestawić kompetencje obok siebie,
 * zamiast zamykać jedną, żeby otworzyć drugą.
 */
export function Skills() {
  return (
    <Frame meta={sections.skills}>
      <Accordion type="multiple" defaultValue={[skills[0].id]}>
        {skills.map((skill, i) => (
          <Rise as="div" i={i} key={skill.id}>
            <AccordionItem
              value={skill.id}
              className="border-t border-b-0 border-border/60"
            >
              <AccordionTrigger className="group py-8 hover:no-underline md:py-10 [&>svg]:hidden">
                <span className="grid w-full grid-cols-[2.5rem_1fr_1.5rem] items-baseline gap-4 md:gap-8">
                  <span className="m3-label m3-num">{skill.number}</span>
                  <span className="m3-h3 transition-opacity duration-300 group-hover:opacity-70">
                    {skill.title}
                  </span>
                  <span className="m3-toggle" aria-hidden="true" />
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-12 md:pb-16">
                <div className="grid gap-8 md:grid-cols-[2.5rem_1fr] md:gap-8">
                  <span className="hidden md:block" aria-hidden="true" />
                  <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                    <p className="m3-body lg:col-span-7">{skill.description}</p>
                    <ul
                      aria-label={`Narzędzia: ${skill.title}`}
                      className="m3-specs lg:col-span-5"
                    >
                      {skill.tools.map((tool) => (
                        <li key={tool}>{tool}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Rise>
        ))}
      </Accordion>
    </Frame>
  )
}
