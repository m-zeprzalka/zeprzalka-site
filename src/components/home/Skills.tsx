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
      <Accordion className="mt-4" type="single" collapsible defaultValue="item-1">
        {homeSkills.map((skill) => (
          <AccordionItem key={skill.id} value={skill.id} className="border-t">
            <AccordionTrigger className="py-8 md:py-10 lg:py-12 hover:no-underline">
              <div className="flex items-center gap-4 lg:gap-6 w-full">
                <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-muted-foreground/80">
                  {skill.number}
                </span>
                {/* Nagłówkiem (h3) jest już element Radix wokół przycisku. */}
                <span className="text-xl sm:text-3xl md:text-4xl xl:text-5xl">
                  {skill.title[locale]}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p className="text-lg md:text-xl text-muted-foreground max-w-5xl leading-relaxed">
                {skill.description[locale]}
              </p>
              <div className="flex flex-wrap gap-2 py-4">
                {skill.tools[locale].map((tool) => (
                  <Badge variant="outline" className="px-3 py-1" key={tool}>
                    {tool}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </HomeSection>
  )
}
