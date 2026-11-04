import {
  DsBlock,
  DsCode,
  DsInline,
  DsPreview,
  DsSection,
  DsTable,
} from "@/components/design-system/primitives"

export function MotionSection() {
  return (
    <DsSection
      id="ruch"
      title="Ruch"
      description="Ruch w serwisie jest reakcją na działanie użytkownika, nie ozdobą. Wyjątki są trzy: pasek postępu przewijania, pulsująca kropka dostępności i animowany znak w logo."
    >
      <DsBlock title="Czasy trwania">
        <DsTable
          head={["Czas", "Klasa", "Zastosowanie"]}
          rows={[
            ["150 ms", <DsInline key="a">duration-150</DsInline>, "Podmiana znaku w logo"],
            ["200 ms", <DsInline key="b">duration-200</DsInline>, "Obrót strzałki w akordeonie"],
            [
              "300 ms",
              <DsInline key="c">duration-300</DsInline>,
              "Domyślna reakcja: hover kart, nakładki, badge portfolio",
            ],
            [
              "500 ms",
              <DsInline key="d">duration-500</DsInline>,
              "Powiększenie obrazu wpisu pod kursorem",
            ],
            [
              "—",
              <DsInline key="e">animation-timeline: scroll()</DsInline>,
              "Pasek postępu czytania — sprzężony z przewijaniem, bez czasu trwania",
            ],
          ]}
        />
      </DsBlock>

      <DsBlock
        title="Wzorce interakcji"
        description="Najedź kursorem na próbki, aby zobaczyć zachowanie w oryginale."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <DsPreview
            label="Karta portfolio"
            code="group transition-all duration-300 hover:shadow-xl"
          >
            <div className="group flex h-24 items-center justify-center rounded-lg border bg-card transition-all duration-300 hover:shadow-xl">
              <span className="text-sm text-muted-foreground transition-opacity duration-300 group-hover:opacity-100">
                cień + nakładka
              </span>
            </div>
          </DsPreview>

          <DsPreview label="Obraz wpisu" code="group-hover:scale-105 duration-500">
            <div className="group h-24 overflow-hidden rounded-lg border">
              <div className="h-full w-full bg-muted transition-transform duration-500 ease-in-out group-hover:scale-105" />
            </div>
          </DsPreview>

          <DsPreview
            label="Link nawigacji"
            code="hover:text-foreground hover:underline underline-offset-4"
          >
            <div className="flex h-24 items-center justify-center">
              <a
                href="#ruch"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                O mnie
              </a>
            </div>
          </DsPreview>
        </div>
      </DsBlock>

      <DsBlock
        title="Ruch ciągły"
        note={
          <>
            Wszystkie trzy źródła ruchu ciągłego respektują ustawienie{" "}
            <DsInline>prefers-reduced-motion: reduce</DsInline>: reguła w{" "}
            <DsInline>globals.css</DsInline> skraca animacje i przejścia oraz wyłącza płynne
            przewijanie, sygnet przestaje podmieniać znak, a wideo zatrzymuje się na pierwszej
            klatce (pauza w efekcie i w zdarzeniu <DsInline>onPlay</DsInline>, żeby złapać też start
            po dociągnięciu danych). Sterowanie odtwarzaniem dla pozostałych użytkowników to osobna
            sprawa — patrz sekcja 12.
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <DsPreview label="Kropka dostępności" code="animate-pulse bg-green-500">
            <div className="flex h-16 items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-sm">Gotowy do współpracy</span>
            </div>
          </DsPreview>

          <DsPreview label="Pasek postępu" code="components/layout/ReadingProgress.tsx">
            <div className="flex h-16 items-center">
              <div className="h-1 w-full rounded-full bg-background">
                <div className="h-full w-2/3 rounded-full bg-linear-to-r from-primary/20 to-primary" />
              </div>
            </div>
          </DsPreview>

          <DsPreview label="Wideo w portfolio" code="autoPlay muted loop playsInline">
            <div className="flex h-16 items-center text-sm text-muted-foreground">
              W pętli, bez dźwięku; przy ograniczonym ruchu zatrzymane na pierwszej klatce
            </div>
          </DsPreview>
        </div>
        <DsCode>
          {`// Leniwe wczytanie kadru — components/portfolio/LazyVideo.tsx
const [frameRef, near] = useInViewOnce<HTMLDivElement>("200px 0px")
// plik wideo dostaje dopiero kafel 200 px przed kadrem, gra tylko ten w kadrze
// (play() w efekcie po ustawieniu src); poster maluje się od razu, a przy
// „ogranicz ruch” film stoi na pierwszej klatce`}
        </DsCode>
      </DsBlock>
    </DsSection>
  )
}
