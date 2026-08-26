import { ArrowRight, CalendarDays, Clock, Hash, Mail, MousePointerClick } from "lucide-react"
import {
  DsBlock,
  DsInline,
  DsPreview,
  DsSection,
  DsTable,
} from "@/components/design-system/primitives"

const radii = [
  { token: "--radius-sm", value: "calc(var(--radius) - 4px)", usage: "Drobne elementy wewnątrz kart" },
  { token: "--radius-md", value: "calc(var(--radius) - 2px)", usage: "Przyciski, pola formularza, badge" },
  { token: "--radius-lg", value: "var(--radius) = 0.625rem", usage: "Kadry wideo, obrazy wpisów" },
  { token: "--radius-xl", value: "calc(var(--radius) + 4px)", usage: "Karty portfolio, wyróżnione obrazy" },
]

const icons = [
  { Icon: MousePointerClick, name: "MousePointerClick", usage: "Przyciski akcji (CTA, wyślij)" },
  { Icon: CalendarDays, name: "CalendarDays", usage: "Data publikacji" },
  { Icon: Clock, name: "Clock", usage: "Czas czytania" },
  { Icon: Hash, name: "Hash", usage: "Tagi wpisu" },
  { Icon: Mail, name: "Mail", usage: "Kontakt" },
  { Icon: ArrowRight, name: "ArrowRight", usage: "Nawigacja, paginacja" },
]

export function ShapeSection() {
  return (
    <DsSection
      id="ksztalt"
      title="Kształt i ikony"
      description="Jedna zmienna promienia rozchodzi się na cały interfejs. Warstwy oddziela obrys o grubości 1 px — cień pojawia się wyłącznie jako reakcja na kursor."
    >
      <DsBlock title="Promienie">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {radii.map((radius) => (
            <div key={radius.token} className="flex flex-col gap-2">
              <div
                className="h-16 border bg-muted"
                style={{ borderRadius: `var(${radius.token})` }}
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-xs">{radius.token}</span>
                <span className="font-mono text-[0.6875rem] text-muted-foreground">
                  {radius.value}
                </span>
                <span className="text-xs text-muted-foreground leading-snug">
                  {radius.usage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title="Obrys i cień"
        description="Domyślny obrys to jeden piksel w kolorze tokenu border. Karty dostają cień dopiero pod kursorem, przyciski mają ledwie widoczny shadow-xs z presetu shadcn."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <DsPreview label="Obrys" code="border rounded-lg">
            <div className="h-16 rounded-lg border" />
          </DsPreview>
          <DsPreview label="Cień kart (hover)" code="hover:shadow-xl">
            <div className="h-16 rounded-lg border shadow-xl" />
          </DsPreview>
          <DsPreview label="Pierścień fokusu" code="focus-visible:ring-[3px] ring-ring/50">
            <div className="h-16 rounded-lg border ring-[3px] ring-ring/50" />
          </DsPreview>
        </div>
      </DsBlock>

      <DsBlock
        title="Ikony"
        description="Biblioteka lucide-react. Rozmiar dobierany do kontekstu tekstu, kolor dziedziczony po tekście — ikony nigdy nie mają własnej barwy."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {icons.map(({ Icon, name, usage }) => (
            <div key={name} className="flex items-start gap-3 rounded-lg border p-4">
              <Icon className="mt-0.5 w-4 h-4 shrink-0 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-mono text-xs">{name}</span>
                <span className="text-xs text-muted-foreground">{usage}</span>
              </div>
            </div>
          ))}
        </div>
        <DsTable
          head={["Rozmiar", "Klasa", "Gdzie"]}
          rows={[
            ["12 px", <DsInline key="a">w-3 h-3</DsInline>, "Metadane kart wpisów"],
            ["16 px", <DsInline key="b">w-4 h-4</DsInline>, "Tekst, listy, przyciski"],
            ["20 px", <DsInline key="c">w-5 h-5</DsInline>, "Menu mobilne, komunikaty formularza"],
            ["1.2 rem", <DsInline key="d">h-[1.2rem] w-[1.2rem]</DsInline>, "Przełącznik motywu"],
          ]}
        />
      </DsBlock>
    </DsSection>
  )
}
