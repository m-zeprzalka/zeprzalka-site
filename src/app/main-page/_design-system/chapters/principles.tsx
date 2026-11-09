import {
  Code,
  DsNote,
  DsSection,
  DsSubheading,
  Lead,
  TokenTable,
  type ChapterProps,
} from "@/app/main-page/_design-system/ds-section"

/** Gdzie mieszka każda część systemu — jedna rzecz, jedno miejsce. */
const FILES = [
  {
    token: "globals.css",
    value: "kolory, promień, siatka, krzywe i pory ruchu, stopnie pisma, animacje",
    use: "jedyne miejsce wartości; komponenty biorą je przez klasy Tailwinda",
  },
  {
    token: "_components/ui/*",
    value: "shadcn z CLI: warianty cva, rozmiary, fokus",
    use: "zmiany systemowe z komentarzem // zeprzalka:",
  },
  {
    token: "blog/code.css",
    value: "blok kodu i paleta składni (--syntax-*)",
    use: "ładuje go CodeBlock — strona bez kodu go nie pobiera",
  },
  {
    token: "blog/article.css",
    value: "typografia treści wpisu (MDX)",
    use: "tylko na wpisach i w tym katalogu",
  },
  {
    token: "_lib/routes.ts",
    value: "adresy podglądu (prefiks /main-page)",
    use: "każdy link wewnętrzny: pageHref, postHref, categoryHref…",
  },
  {
    token: "_design-system/examples/*",
    value: "przykłady tego katalogu",
    use: "kod pod przykładem to ten plik — dokumentacja nie rozjedzie się z wyglądem",
  },
] as const

export function PrinciplesChapter(props: ChapterProps) {
  return (
    <DsSection {...props} lead="Jedna rzecz, jedno miejsce">
      <DsNote>
        <Lead>System w ui, układ w stronie.</Lead> Wygląd wspólny dla całej strony (promienie,
        rozmiary, warianty, fokus) żyje w tokenach <Code>globals.css</Code> i w wariantach{" "}
        <Code>cva</Code> komponentów <Code>_components/ui</Code>. Na stronie <Code>className</Code>{" "}
        służy tylko układowi: odstęp, szerokość, miejsce w siatce.
      </DsNote>
      <DsNote>
        <Lead>shadcn przez CLI.</Lead> <Code>pnpm dlx shadcn@latest add &lt;nazwa&gt;</Code>{" "}
        instaluje do <Code>_components/ui</Code> (wskazuje go <Code>components.json</Code>). Po
        instalacji <Code>pnpm remove cn</Code> i import <Code>cn</Code> z <Code>@/lib/utils</Code>;
        pytanie o nadpisanie <Code>button.tsx</Code> — zawsze „nie”.
      </DsNote>
      <DsNote>
        <Lead>Klasy w zapisie kanonicznym.</Lead> <Code>pnpm check:classes</Code> sprawdza każdą
        klasę systemem Tailwinda (<Code>--fix</Code> poprawia), a Prettier sortuje je według tokenów{" "}
        <Code>main-page</Code>.
      </DsNote>
      <DsNote>
        <Lead>Dostępność w systemie, nie w stronie.</Lead> Fokus to{" "}
        <Code>ring-[3px] ring-ring</Code> pełnym kolorem (≥ 3:1), cel dotyku ≥ 44 px (
        <Code>size=&quot;lg&quot;</Code>, pola <Code>h-11</Code>, w nagłówku pole powiększa{" "}
        <Code>after:</Code> bez zmiany rysunku), spoczynek zawsze kompletny, „ogranicz ruch” jedną
        regułą w <Code>globals.css</Code>.
      </DsNote>
      <DsNote>
        <Lead>Teksty z src/i18n.</Lead> Każdy napis strony ma parę <Code>pl</Code>/<Code>en</Code>.
        Ten katalog jest wyjątkiem z <Code>AGENTS.md</Code>: wewnętrzny, <Code>noindex</Code>, tylko
        po polsku — przykłady z prawdziwą treścią biorą ją z modeli widoku (
        <Code>getHomeContent</Code>, <Code>getSource</Code>).
      </DsNote>
      <DsSubheading>Gdzie co mieszka</DsSubheading>
      <TokenTable rows={FILES} />
    </DsSection>
  )
}
