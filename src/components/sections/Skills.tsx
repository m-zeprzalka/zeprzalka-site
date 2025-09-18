import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const skillsData = [
  {
    id: "item-1",
    number: "01",
    title: "Projektowanie Produktu",
    description:
      "Od analizy rynku i potrzeb użytkowników, przez architekturę informacji (UX), po tworzenie interaktywnych prototypów (UI). Projektuję produkty multimedialne, które użytkownicy kochają, a biznes docenia.",
    tools: [
      "User Experience (UX)",
      "User Interface (UI)",
      "Human-Centered Design",
      "AI Models",
    ],
  },
  {
    id: "item-2",
    number: "02",
    title: "Development i Technologia",
    description:
      "Wdrażam responsywne, wydajne i skalowalne serwisy internetowe. Specjalizuję się w nowoczesnym frontendzie i integracji rozwiązań AI, które automatyzują procesy i dostarczają realną wartość.",
    tools: [
      "Next.js",
      "React",
      "JavaScript",
      "HTML/CSS",
      "WordPress",
      "Vercel",
      "API",
      "AI Models",
    ],
  },
  {
    id: "item-3",
    number: "03",
    title: "Komunikacja Wizualna",
    description:
      "Tworzę spójną i angażującą komunikację – od brandingu i identyfikacji wizualnej, przez zaawansowaną grafikę cyfrową, po dynamiczne animacje. Dbam o to, by Twoja marka opowiadała historię i wyróżniała się na rynku.",
    tools: [
      "Adobe Photoshop",
      "After Effects",
      "Premiere Pro",
      "Blender",
      "Figma",
    ],
  },
]

export function Skills() {
  return (
    <section className="flex flex-col justify-center p-4 py-6 md:py-8 lg:py-12 xl:py-16 min-h-[calc(100vh-4rem)] container mx-auto">
      <Accordion type="single" collapsible defaultValue="item-1">
        {skillsData.map((skill) => (
          <AccordionItem key={skill.id} value={skill.id}>
            <AccordionTrigger className="py-8 md:py-10 lg:py-12 hover:no-underline">
              <div className="flex items-center gap-4 md:gap-8 lg:gap-12 w-full">
                <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-muted-foreground/30">
                  {skill.number}
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl xl:text-5xl">
                  {skill.title}
                </h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <h3 className="text-lg md:text-xl lg:text-2xl text-base md:text-lg lg:text-xl text-muted-foreground max-w-5xl leading-relaxed">
                {skill.description}
              </h3>
              <div className="flex flex-wrap gap-2 py-4">
                {skill.tools.map((tool) => (
                  <Badge variant="outline" className="px-3 py-1" key={tool}>
                    {tool}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
