import {
  DsBlock,
  DsCode,
  DsInline,
  DsPreview,
  DsSection,
  DsTable,
} from "@/components/design-system/primitives"
import { ComputedFont, Specimen } from "@/components/design-system/live"

const sample = "Przekształcam ambitne projekty w produkty cyfrowe"

export function TypeSection() {
  return (
    <DsSection
      id="typografia"
      title="Typografia"
      description="Jeden krój bezszeryfowy do wszystkiego, monospace do kodu. Hierarchię buduje rozmiar i kolor, nie krój — nagłówki są w wadze medium, nigdy w bold, poza artykułami blogowymi."
    >
      <DsBlock
        title="Kroje"
        note={
          <>
            Kolumna „renderowane teraz&rdquo; czyta krój z wyrenderowanej strony, więc
            potwierdza, że deklaracja działa. Do 26 sierpnia 2026 pokazywała krój
            systemowy: zmienne były ustawiane na{" "}
            <DsInline>&lt;body&gt;</DsInline>, a Tailwind v4 przypisuje{" "}
            <DsInline>font-family</DsInline> na <DsInline>&lt;html&gt;</DsInline>{" "}
            — o poziom wyżej, gdzie zmiennej jeszcze nie było. Klasy przeniesiono
            na <DsInline>&lt;html&gt;</DsInline> w{" "}
            <DsInline>src/app/layout.tsx</DsInline>.
          </>
        }
      >
        <DsTable
          head={["Rola", "Deklaracja", "Renderowane teraz"]}
          rows={[
            [
              "Tekst i interfejs",
              <span key="a">
                Geist Sans <DsInline>next/font/google</DsInline>
              </span>,
              <ComputedFont key="b" selector="body" />,
            ],
            [
              "Kod, dane liczbowe",
              <span key="c">
                Geist Mono <DsInline>--font-geist-mono</DsInline>
              </span>,
              <ComputedFont key="d" selector="code" />,
            ],
          ]}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <DsPreview label="Geist Sans — tekst i interfejs">
            <p className="text-2xl">{sample}</p>
          </DsPreview>
          <DsPreview label="Geist Mono — kod i dane liczbowe">
            <p className="font-mono text-xl tabular-nums">
              2011 — 2026 · 12 min · oklch(0.145 0 0)
            </p>
          </DsPreview>
        </div>
      </DsBlock>

      <DsBlock
        title="Skala nagłówków"
        description="Rozmiary są responsywne — wartości obok próbek mierzone są na żywo przy bieżącej szerokości okna."
      >
        <div className="rounded-lg border px-6">
          <Specimen
            as="p"
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-medium"
            usage="Hero strony głównej — jedyny H1 tej wielkości"
          >
            Przekształcam ambitne projekty
          </Specimen>
          <Specimen
            as="p"
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight"
            usage="H1 podstron (PageHeader, /o-mnie)"
          >
            Porozmawiajmy o projekcie
          </Specimen>
          <Specimen
            as="p"
            className="text-3xl md:text-4xl font-medium"
            usage="H2 sekcji strony głównej: Kompetencje, Portfolio, Blog, Kontakt"
          >
            Kompetencje
          </Specimen>
          <Specimen
            as="p"
            className="text-xl sm:text-3xl md:text-4xl xl:text-5xl"
            usage="Tytuł pozycji w akordeonie kompetencji"
          >
            Projektowanie Produktu
          </Specimen>
          <Specimen
            as="p"
            className="text-2xl font-semibold"
            usage="H2 na liście bloga („Wyróżnione artykuły”)"
          >
            Wyróżnione artykuły
          </Specimen>
          <Specimen
            as="p"
            className="text-2xl font-bold tracking-tight"
            usage="H2 wewnątrz artykułu (MDX)"
          >
            Jak działa ten mechanizm
          </Specimen>
        </div>
      </DsBlock>

      <DsBlock title="Tekst i etykiety">
        <div className="rounded-lg border px-6">
          <Specimen
            className="sm:text-xl md:text-2xl text-muted-foreground"
            usage="Lead pod nagłówkiem hero"
          >
            Digital Solutions Architect — ponad 12+ lat doświadczenia
          </Specimen>
          <Specimen
            className="text-muted-foreground lg:text-lg 2xl:text-xl"
            usage="Wprowadzenie w kolumnie bocznej sekcji"
          >
            Umiejętności, które pomogą w sukcesie Twojego projektu
          </Specimen>
          <Specimen
            className="text-base leading-relaxed text-muted-foreground"
            usage="Tekst ciągły (/o-mnie, opisy)"
          >
            Łączę umiejętności techniczne z wrażliwością projektową
          </Specimen>
          <Specimen
            className="text-sm text-muted-foreground"
            usage="Metadane: data, czas czytania, podpisy"
          >
            23 sierpnia 2026 · 12 min czytania
          </Specimen>
          <Specimen
            className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
            usage="Etykieta kolumny bocznej (/o-mnie, /kontakt) — jedyne wersaliki w systemie"
          >
            Doświadczenie
          </Specimen>
          <Specimen
            className="text-sm tabular-nums text-muted-foreground"
            usage="Liczby i okresy — cyfry o stałej szerokości"
          >
            2011 — obecnie
          </Specimen>
        </div>
      </DsBlock>

      <DsBlock
        title="Zasady"
        note={
          <>
            W serwisie nagłówki sekcji mają dziś klasę{" "}
            <DsInline>md:font-semi-bold</DsInline> — taka klasa nie istnieje
            w Tailwindzie i nic nie robi. Do usunięcia albo zamiany na{" "}
            <DsInline>md:font-semibold</DsInline>.
          </>
        }
      >
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground leading-relaxed">
          <li>
            Nagłówki serwisu: waga <DsInline>font-medium</DsInline>. Waga{" "}
            <DsInline>font-bold</DsInline> zarezerwowana dla treści artykułów.
          </li>
          <li>
            <DsInline>tracking-tight</DsInline> tylko przy stopniach od 4xl w górę.
          </li>
          <li>
            Tekst drugorzędny zawsze przez{" "}
            <DsInline>text-muted-foreground</DsInline>, nigdy przez
            przezroczystość.
          </li>
          <li>Jeden H1 na stronę; kolejność nagłówków bez przeskoków.</li>
        </ul>
        <DsCode>
          {`// Nagłówek sekcji — wzorzec powtarzany na stronie głównej
<h2 className="text-3xl md:text-4xl font-medium">Portfolio</h2>
<p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-2 lg:mt-6 max-w-xs">…</p>`}
        </DsCode>
      </DsBlock>
    </DsSection>
  )
}
