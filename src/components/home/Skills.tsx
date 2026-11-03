import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { HomeSection } from "@/components/home/HomeSection"
import type { Locale } from "@/i18n/config"
import { getHome, homeSkills } from "@/i18n/content/home"

export function Skills({ locale }: { locale: Locale }) {
  const copy = getHome(locale).skills

  return (
    <HomeSection title={copy.title} lead={copy.lead} gridClassName="gap-6 lg:gap-8">
      <Accordion className="mt-4" type="single" collapsible defaultValue={homeSkills[0]?.id}>
        {homeSkills.map((skill) => (
          <AccordionItem key={skill.id} value={skill.id} className="border-t">
            <AccordionTrigger className="py-8 hover:no-underline md:py-10 lg:py-12">
              <span className="flex w-full items-center gap-4 lg:gap-6">
                <span className="text-2xl text-muted-foreground/80 md:text-3xl lg:text-4xl xl:text-5xl">
                  {skill.number}
                </span>
                {/* Nagłówkiem (h3) jest już element Radix wokół przycisku. */}
                <span className="text-xl sm:text-3xl md:text-4xl xl:text-5xl">
                  {skill.title[locale]}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p className="max-w-5xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {skill.description[locale]}
              </p>
              <ul className="flex flex-wrap gap-2 py-4">
                {skill.tools[locale].map((tool) => (
                  <li key={tool} className="flex">
                    <Badge variant="outline" className="px-3 py-1">
                      {tool}
                    </Badge>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </HomeSection>
  )
}
