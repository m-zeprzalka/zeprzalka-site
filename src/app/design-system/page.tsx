import type { Metadata } from "next"
import { PageHeader } from "@/components/PageHeader"
import { DsNav } from "@/components/design-system/DsNav"
import { dsSections } from "@/components/design-system/nav"
import { DsInline } from "@/components/design-system/primitives"
import { ColorSection } from "@/components/design-system/sections/Color"
import { TypeSection } from "@/components/design-system/sections/Type"
import { GridSection } from "@/components/design-system/sections/Grid"
import { ShapeSection } from "@/components/design-system/sections/Shape"
import { MotionSection } from "@/components/design-system/sections/Motion"
import { UiKitSection } from "@/components/design-system/sections/UiKit"
import { AppKitSection } from "@/components/design-system/sections/AppKit"
import { AnatomySection } from "@/components/design-system/sections/Anatomy"
import { ContentSection } from "@/components/design-system/sections/Content"
import { StatesSection } from "@/components/design-system/sections/States"
import { RulesSection } from "@/components/design-system/sections/Rules"
import { DebtSection } from "@/components/design-system/sections/Debt"

export const metadata: Metadata = {
  title: "System projektowy",
  description:
    "Katalog języka wizualnego zeprzalka.com: tokeny, typografia, siatka, komponenty i wzorce obecnej wersji serwisu.",
  // Dokumentacja wewnętrzna — nie należy do treści serwisu w wyszukiwarce.
  robots: { index: false, follow: false },
}

const facts = [
  { label: "Tokeny koloru", value: "26 semantycznych + 5 wykresów" },
  { label: "Komponenty bazowe", value: "13 w użyciu, 5 zainstalowanych" },
  { label: "Komponenty aplikacji", value: "12" },
  { label: "Motywy", value: "jasny i ciemny, domyślnie ciemny" },
]

export default function DesignSystemPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <PageHeader
        badge="Design System"
        title="System projektowy"
        description="Kompletny język wizualny obecnej wersji zeprzalka.com — tokeny, typografia, siatka, komponenty i wzorce. Katalog jest żywy: renderuje prawdziwe komponenty serwisu, czyta tokeny wprost z globals.css i mierzy typografię na wyrenderowanej stronie."
      />

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        {/* min-w-0: bez tego szerokie tabele i bloki kodu rozciągają
            kolumnę siatki do swojej naturalnej szerokości. */}
        {/* Bez `self-start`: kolumna ma wysokość całego wiersza siatki,
            dzięki czemu przyklejony spis treści ma się gdzie przesuwać. */}
        <aside className="min-w-0 lg:col-span-3">
          <DsNav entries={dsSections} />
        </aside>

        <div className="min-w-0 lg:col-span-9">
          <section className="mb-4 rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold tracking-tight">
              Jak czytać ten katalog
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground leading-relaxed">
              Wszystko poniżej opisuje <strong className="font-medium text-foreground">obecny</strong>{" "}
              wariant serwisu — ten pod adresem głównym. Próbki nie są rysunkami:
              to te same komponenty, których używają strony produkcyjne.
              Wartości tokenów pochodzą wprost z <DsInline>globals.css</DsInline>,
              a rozmiary typografii są mierzone na wyrenderowanej próbce przy
              bieżącej szerokości okna. Przełącz motyw w nagłówku, aby zobaczyć
              serwis w drugiej palecie. Fragmenty w <DsInline>tym stylu</DsInline>{" "}
              to klasy i nazwy z kodu.
            </p>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground leading-relaxed">
              Ostatnia sekcja zbiera rozbieżności między systemem a kodem — to
              lista decyzji do podjęcia, nie błędów do cichego poprawienia.
              Warianty testowe (<DsInline>/main-secondary</DsInline>,{" "}
              <DsInline>/main-third</DsInline>, <DsInline>/main-fourth</DsInline>)
              są osobnymi eksperymentami i nie należą do tego systemu.
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1">
                  <dt className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <ColorSection />
          <TypeSection />
          <GridSection />
          <ShapeSection />
          <MotionSection />
          <UiKitSection />
          <AppKitSection />
          <AnatomySection />
          <ContentSection />
          <StatesSection />
          <RulesSection />
          <DebtSection />
        </div>
      </div>
    </div>
  )
}
