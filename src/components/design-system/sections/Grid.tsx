import {
  DsBlock,
  DsCode,
  DsInline,
  DsSection,
  DsTable,
} from "@/components/design-system/primitives"

export function GridSection() {
  return (
    <DsSection
      id="siatka"
      title="Przestrzeń i siatka"
      description="Cały serwis mieści się w jednym kontenerze i jednej siatce dwunastu kolumn. Sekcje strony głównej dzielą ją zawsze tak samo: wąska kolumna opisowa przyklejona do góry ekranu i szeroka kolumna treści."
    >
      <DsBlock title="Kontener">
        <DsTable
          head={["Element", "Klasy", "Zastosowanie"]}
          rows={[
            [
              "container",
              <DsInline key="a">container mx-auto px-4</DsInline>,
              "Wszystkie strony i nagłówek — jedyna miara treści",
            ],
            [
              "podstrony",
              <DsInline key="b">py-12 md:py-16 lg:py-20</DsInline>,
              "/blog, /kontakt, /o-mnie, ekran ładowania",
            ],
            [
              "sekcje /",
              <DsInline key="c">p-4 py-6 md:py-8 lg:py-12 xl:py-16</DsInline>,
              "Hero, Kompetencje, Portfolio, Kontakt",
            ],
            [
              "wysokość sekcji",
              <DsInline key="d">xl:min-h-[calc(100vh-4rem)]</DsInline>,
              "Od XL sekcja wypełnia ekran pomniejszony o nagłówek",
            ],
            [
              "wąska treść",
              <DsInline key="e">max-w-4xl</DsInline>,
              "/o-mnie — miara czytelnicza dla tekstu ciągłego",
            ],
          ]}
        />
      </DsBlock>

      <DsBlock
        title="Podział sekcji"
        description="Powtarzalny szkielet: 3 kolumny opisu + 9 kolumn treści. Kolumna opisu jest przyklejona (sticky), więc tytuł sekcji towarzyszy treści podczas przewijania."
      >
        <div className="rounded-lg border p-4 md:p-6">
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-8">
            <div className="rounded-md border border-dashed bg-muted/40 p-4 lg:col-span-3">
              <p className="text-sm font-medium">lg:col-span-3</p>
              <p className="mt-1 text-xs text-muted-foreground">
                H2 sekcji + jedno zdanie wprowadzenia.{" "}
                <DsInline>lg:sticky top-22</DsInline>
              </p>
            </div>
            <div className="rounded-md border border-dashed bg-muted/40 p-4 lg:col-span-9">
              <p className="text-sm font-medium">lg:col-span-9</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Treść sekcji: akordeon, siatka kart, lista wpisów, formularz.
              </p>
            </div>
          </div>
        </div>
        <DsCode>
          {`<section className="… container mx-auto">
  <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
    <div className="lg:col-span-3 lg:sticky top-22 self-start">…</div>
    <div className="lg:col-span-9">…</div>
  </div>
</section>`}
        </DsCode>
      </DsBlock>

      <DsBlock
        title="Warianty podziału"
        note={
          <>
            Odstępy przyklejenia nie są ujednolicone:{" "}
            <DsInline>top-22</DsInline> na stronie głównej,{" "}
            <DsInline>top-24</DsInline> w /kontakt i w podglądzie bloga. Nagłówek
            ma 4 rem (<DsInline>h-16</DsInline>), więc wartością docelową jest
            jedna z nich — do ustalenia.
          </>
        }
      >
        <DsTable
          head={["Strona", "Podział", "Uwagi"]}
          rows={[
            ["Strona główna", "3 / 9", "Kompetencje, Portfolio, Blog, Kontakt"],
            ["/kontakt", "4 / 8 → xl 3 / 9", "Dane kontaktowe + formularz"],
            ["/o-mnie", "3 / 9", "Etykieta w wersalikach zamiast H2"],
            ["/blog", "brak podziału", "Siatka kart 2 / 3 kolumny"],
            ["Wpis bloga", "sidebar + treść", "Spis treści w komponencie Sidebar"],
          ]}
        />
      </DsBlock>

      <DsBlock title="Siatki kart">
        <DsTable
          head={["Wzorzec", "Klasy", "Gdzie"]}
          rows={[
            [
              "portfolio",
              <DsInline key="a">columns-1 md:columns-2 lg:columns-3</DsInline>,
              "Układ murowany — kadry mają różne proporcje",
            ],
            [
              "blog na stronie głównej",
              <DsInline key="b">grid sm:grid-cols-2 gap-8</DsInline>,
              "Sześć ostatnich wpisów",
            ],
            [
              "lista bloga",
              <DsInline key="c">grid md:grid-cols-2 lg:grid-cols-3 gap-8</DsInline>,
              "Wszystkie wpisy",
            ],
            [
              "wyróżnione",
              <DsInline key="d">grid md:grid-cols-2 gap-8</DsInline>,
              "Dwa wpisy na pierwszej stronie listy",
            ],
          ]}
        />
      </DsBlock>
    </DsSection>
  )
}
