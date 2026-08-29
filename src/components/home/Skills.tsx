import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { t, type Locale } from "@/i18n/config"
import { getHome, homeSkills } from "@/i18n/content/home"

export function Skills({ locale }: { locale: Locale }) {
  const copy = getHome(locale).skills

  return (
    <section className="flex flex-col justify-center p-4 py-6 md:py-8 lg:py-12 xl:py-16 xl:min-h-[calc(100vh-4rem)] container mx-auto">
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:sticky top-22 self-start">
          <div>
            <h2 className="text-3xl md:text-4xl md:font-semi-bold font-medium">
              {copy.title}
            </h2>
            <p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-2 lg:mt-6 max-w-xs">
              {copy.lead}
            </p>
          </div>
        </div>
        <div className="lg:col-span-9">
          <Accordion
            className="mt-4"
            type="single"
            collapsible
            defaultValue="item-1"
          >
            {homeSkills.map((skill) => (
              <AccordionItem
                key={skill.id}
                value={skill.id}
                className="border-t"
              >
                <AccordionTrigger className="py-8 md:py-10 lg:py-12 hover:no-underline">
                  <div className="flex items-center gap-4 lg:gap-6 w-full">
                    <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-muted-foreground/80">
                      {skill.number}
                    </span>
                    <h2 className="text-xl sm:text-3xl md:text-4xl xl:text-5xl">
                      {t(skill.title, locale)}
                    </h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <h3 className="text-lg md:text-xl lg:text-2xl text-base md:text-lg lg:text-xl text-muted-foreground max-w-5xl leading-relaxed">
                    {t(skill.description, locale)}
                  </h3>
                  <div className="flex flex-wrap gap-2 py-4">
                    {t(skill.tools, locale).map((tool) => (
                      <Badge variant="outline" className="px-3 py-1" key={tool}>
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
