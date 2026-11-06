import type { Metadata } from "next"
import { SectionNav } from "@/app/main-page/_components/layout/section-nav"
import { Code, DsNote, DsSection } from "@/app/main-page/_design-system/ds-section"
import { Example } from "@/app/main-page/_design-system/example"
import { AccordionExample } from "@/app/main-page/_design-system/examples/accordion"
import { BadgeKbdExample } from "@/app/main-page/_design-system/examples/badge-kbd"
import { ButtonExample } from "@/app/main-page/_design-system/examples/button"
import { EnterStaggerExample } from "@/app/main-page/_design-system/examples/enter-stagger"
import { FieldExample } from "@/app/main-page/_design-system/examples/field"
import { GlyphTextExample } from "@/app/main-page/_design-system/examples/glyph-text"
import { HeaderControlsExample } from "@/app/main-page/_design-system/examples/header-controls"
import { PeekTriggerExample } from "@/app/main-page/_design-system/examples/peek-trigger"
import { ScrollFillExample } from "@/app/main-page/_design-system/examples/scroll-fill"
import { SectionHeadingExample } from "@/app/main-page/_design-system/examples/section-heading"
import { Replay } from "@/app/main-page/_design-system/replay"
import {
  ColorTokens,
  RadiusTokens,
  TokenTable,
  TypeScale,
} from "@/app/main-page/_design-system/tokens"

export const metadata: Metadata = {
  title: "Design system — nowa wersja",
  robots: { index: false, follow: false },
}

const SECTIONS = [
  { id: "zasady", label: "Zasady" },
  { id: "kolory", label: "Kolory" },
  { id: "pismo", label: "Pismo" },
  { id: "siatka", label: "Siatka" },
  { id: "ksztalty", label: "Kształty" },
  { id: "komponenty", label: "Komponenty" },
  { id: "kompozycje", label: "Kompozycje" },
  { id: "ruch", label: "Ruch" },
]

/**
 * Design system nowej wersji strony: tokeny, komponenty shadcn z `_components/ui`
 * i kompozycje strony głównej — każdy przykład żywy, z kodem czytanym z pliku.
 * Strona wewnętrzna (noindex), tylko po polsku — wyjątek z AGENTS.md.
 */
export default function DesignSystemPage() {
  return (
    <>
      <SectionNav label="Rozdziały" sections={SECTIONS} />
      <header className="column pt-14 md:pt-24">
        <p className="text-sm text-muted-foreground">src/app/main-page</p>
        <h1 className="mt-4 text-[1.625rem] leading-[1.2] font-medium tracking-tight text-pretty sm:text-[2.125rem]">
          Design system{" "}
          <span className="text-muted-foreground">
            — shadcn i Tailwind na własnych tokenach. Co jest, gdzie mieszka i jak tego używać.
          </span>
        </h1>
      </header>

      <DsSection id="zasady" title="Zasady" lead="Jedna rzecz, jedno miejsce">
        <DsNote>
          <strong className="font-medium text-foreground">System w ui, układ w stronie.</strong>{" "}
          Wygląd wspólny dla całej strony (promienie, rozmiary, warianty, fokus) żyje w tokenach{" "}
          <Code>globals.css</Code> i w wariantach <Code>cva</Code> komponentów{" "}
          <Code>_components/ui</Code>. Na stronie <Code>className</Code> służy tylko układowi:
          odstęp, szerokość, miejsce w siatce.
        </DsNote>
        <DsNote>
          <strong className="font-medium text-foreground">shadcn przez CLI.</strong>{" "}
          <Code>pnpm dlx shadcn@latest add &lt;nazwa&gt; -y</Code> instaluje do{" "}
          <Code>_components/ui</Code>. Zmiany systemowe w tych plikach mają komentarz{" "}
          <Code>{"// zeprzalka:"}</Code> — reszta to kod shadcn.
        </DsNote>
        <DsNote>
          <strong className="font-medium text-foreground">Klasy w zapisie kanonicznym.</strong>{" "}
          <Code>pnpm check:classes</Code> sprawdza każdą klasę systemem Tailwinda (
          <Code>--fix</Code> poprawia), a Prettier sortuje je według tokenów <Code>main-page</Code>.
        </DsNote>
      </DsSection>

      <DsSection id="kolory" title="Kolory" lead="Semantyczne nazwy shadcn, ciemny motyw na start">
        <DsNote>
          Wartości w oklch dla <Code>:root</Code> (jasny) i <Code>.dark</Code> (ciemny). Używamy
          nazw (<Code>bg-muted</Code>,<Code>text-muted-foreground</Code>), nigdy wartości.
        </DsNote>
        <ColorTokens />
      </DsSection>

      <DsSection id="pismo" title="Pismo" lead="Jeden krój (Geist), siedem stylów na całą stronę">
        <TypeScale />
      </DsSection>

      <DsSection id="siatka" title="Siatka" lead="Jedna kolumna i dwa tory na marginesach">
        <DsNote>
          Nagłówek, sekcje i stopka stoją na tej samej osi (<Code>column</Code>). Od 1280 px lewy
          tor ma spis sekcji, prawy — kartę podglądu. Ikony przycisków na krawędziach kolumny
          dostają ujemny margines równy wcięciu ikony, więc rysunek kończy się na linii.
        </DsNote>
        <TokenTable rows="layout" />
      </DsSection>

      <DsSection id="ksztalty" title="Kształty" lead="Obłości jako zasada systemu">
        <RadiusTokens />
      </DsSection>

      <DsSection id="komponenty" title="Komponenty" lead="shadcn z katalogu _components/ui">
        <Example file="button.tsx">
          <ButtonExample />
        </Example>
        <Example file="badge-kbd.tsx">
          <BadgeKbdExample />
        </Example>
        <Example file="field.tsx">
          <FieldExample />
        </Example>
        <Example file="accordion.tsx">
          <AccordionExample />
        </Example>
      </DsSection>

      <DsSection id="kompozycje" title="Kompozycje" lead="Elementy strony zbudowane z komponentów">
        <Example file="section-heading.tsx">
          <SectionHeadingExample />
        </Example>
        <Example file="peek-trigger.tsx">
          <PeekTriggerExample />
        </Example>
        <Example file="header-controls.tsx">
          <HeaderControlsExample />
        </Example>
      </DsSection>

      <DsSection id="ruch" title="Ruch" lead="Przewijanie uruchamia, spoczynek zawsze kompletny">
        <DsNote>
          Wejścia z rozmycia, dekodowanie liter ze znaków sygnetu, płynięcie karty i przelot kadru.
          Jedyny efekt sterowany przewijaniem to tekst wypełniany słowo po słowie. Przy „ogranicz
          ruch” wszystko stoi w stanie końcowym — jedna reguła w <Code>globals.css</Code> skraca
          każde przejście i animację do 1 ms, a JS pyta <Code>prefersReducedMotion()</Code> albo{" "}
          <Code>useReducedMotion()</Code>.
        </DsNote>
        <TokenTable rows="motion" />
        <Example file="enter-stagger.tsx">
          <Replay label="Powtórz">
            <EnterStaggerExample />
          </Replay>
        </Example>
        <Example file="glyph-text.tsx">
          <GlyphTextExample />
        </Example>
        <Example file="scroll-fill.tsx">
          <ScrollFillExample />
        </Example>
      </DsSection>
    </>
  )
}
