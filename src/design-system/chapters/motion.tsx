import { GLYPH_REVEAL } from "@/lib/glyph-reveal"
import { declared, ms, themeTokens } from "@/design-system/css-tokens"
import {
  Code,
  DsNote,
  DsSection,
  DsSubheading,
  Lead,
  TokenTable,
  type ChapterProps,
} from "@/design-system/ds-section"
import { Example } from "@/design-system/example"
import { CascadeExample } from "@/design-system/examples/cascade"
import { EnterStaggerExample } from "@/design-system/examples/enter-stagger"
import { GlyphRevealExample } from "@/design-system/examples/glyph-reveal"
import { GlyphTextExample } from "@/design-system/examples/glyph-text"
import { RevealExample } from "@/design-system/examples/reveal"
import { ScrollFillExample } from "@/design-system/examples/scroll-fill"
import { Replay } from "@/design-system/replay"

/** Kroki „harmonijki”: pora z `--enter-*`, długość z animacji, którą dany element wchodzi. */
const CASCADE = [
  { token: "--enter-header", animation: "--animate-enter-down", what: "nagłówek" },
  { token: "--enter-rail", animation: "--animate-enter-side", what: "menu i spis w torach" },
  { token: "--enter-status", animation: "--animate-enter", what: "status startu, okruszki" },
  { token: "--enter-title", animation: "--animate-enter", what: "tytuł, +40 ms na słowo" },
  { token: "--enter-lead", animation: "--animate-enter", what: "rozwinięcie, +16 ms na słowo" },
  { token: "--enter-actions", animation: "--animate-enter", what: "działania, dane wpisu" },
  { token: "--enter-media", animation: "--animate-enter-media", what: "kadr: wideo, okładka" },
] as const

/** Gdzie pracuje każda krzywa i animacja z globals.css (wartości czyta tabela z arkusza). */
const USE: Record<string, string> = {
  "--ease-out": "wejścia, płynięcie karty, przelot kadru — jedna krzywa strony",
  "--ease-in-out": "kropka spisu, rysowanie obwódki „Nowy”",
  "--animate-enter": "słowa tytułu i zdania, status, działania (rozmycie 10 px, 0,5 em z dołu)",
  "--animate-enter-down": "nagłówek (z góry, rozmycie 6 px)",
  "--animate-enter-side":
    "od zewnętrznej krawędzi toru: menu w lewym z lewej, spis wpisu w prawym z prawej ([--enter-side-from:1rem])",
  "--animate-enter-media": "kadr startu: wjazd z dołu i przycięcie do kolumny",
  "--animate-settle": "okładka wpisu osiada do swojej skali pod zasłoną (uncover)",
  "--animate-peek-in": "nowa treść karty podglądu (z rozmycia)",
  "--animate-peek-out": "poprzednia treść karty gaśnie pod nową",
  "--animate-draw": "obwódka „Nowy” — dwa pociągnięcia",
  "--animate-expand": "akordeon: wysokość z pomiaru Radix (przed nim zero)",
  "--animate-collapse": "akordeon: zwijanie",
}

/** Niewypełnione słowo `scroll-fill` w obu motywach — z arkusza przy renderze, nie z kopii. */
function FillFrom() {
  const { light, dark } = themeTokens("globals")
  return (
    <>
      jasny {light.get("--fill-from")}, ciemny {dark.get("--fill-from")}
    </>
  )
}

const OTHER = [
  {
    token: "reveal",
    value: "rise · animation-timeline: view() · entry 0 → 10rem",
    use: "bloki sekcji wjeżdżają z dołu (1,5 rem) przy przewijaniu; bez wsparcia i przy „ogranicz ruch” — stoją",
  },
  {
    token: "scroll-fill",
    value: "fill · view-timeline · granica na 58% wysokości okna · słowo na odcinku trzech słów",
    use: (
      <>
        biogram „O mnie”: ostra granica koloru idzie z linią czytania; niewypełnione słowo ma
        --fill-from (<FillFrom /> koloru tekstu — kontrast 3:1), fraza z kartą idzie z falą
      </>
    ),
  },
  {
    token: "observeReveal",
    value: "pierwszy odczyt IntersectionObservera, bez pomiarów",
    use: "„przy wejściu w kadr”: nagłówki i liczby (GlyphText), „Nowy”, znak stopki",
  },
  {
    token: "peek-media (View Transition)",
    value: "480 ms, --ease-out",
    use: "przelot kadru z karty na marginesie do panelu realizacji (lib/morph.ts)",
  },
  {
    token: "PeekStage",
    value: "pokaz po 70 ms spokoju · ukrycie po 300 ms · płynięcie 500 ms · wysokość 300 ms",
    use: "karta w prawym torze idzie za kursorem w pionie; kursor zdąży wjechać na kartę",
  },
  {
    token: "GlyphText",
    value: "odczyt 820 ms · fala 26 ms na literę, 110 ms znaku · znak co 70 ms",
    use: "nagłówki sekcji i liczby (decode), logo i linki (wave)",
  },
  {
    token: "LogoMark",
    value: "znak co 1000 ms bez końca · szum 7 × 42 ms",
    use: "sygnet logo; najechanie albo fokus puszcza szum, „ogranicz ruch” zatrzymuje znak",
  },
] as const

/** Oś „harmonijki” — paski od pory startu przez czas animacji (wszystko z arkusza). */
function CascadeTimeline() {
  const timing = new Map(
    [...declared("--enter-"), ...declared("--animate-")].map(({ name, value }) => [name, value])
  )
  const rows = CASCADE.map((step) => ({
    ...step,
    at: ms(timing.get(step.token)),
    duration: ms(timing.get(step.animation)),
  }))
  const total = Math.ceil(Math.max(...rows.map((row) => row.at + row.duration)) / 500) * 500
  const ticks = Array.from({ length: total / 500 + 1 }, (_, index) => index * 500)

  return (
    <div className="grid gap-2 rounded-2xl border p-5 text-xs">
      {rows.map((row) => (
        <div key={row.token} className="grid gap-1 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
          <span className="grid">
            <span className="font-mono text-foreground">
              {row.token} · {row.at} ms
            </span>
            <span>{row.what}</span>
          </span>
          <span className="relative h-5 self-center rounded-full bg-muted">
            <span
              className="absolute inset-y-0 rounded-full bg-primary"
              style={{
                left: `${(row.at / total) * 100}%`,
                width: `${(row.duration / total) * 100}%`,
              }}
            />
          </span>
        </div>
      ))}
      <div className="grid sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
        <span className="max-sm:hidden" />
        <span className="relative h-4 font-mono tabular-nums">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
              style={{ left: `${(tick / total) * 100}%` }}
            >
              {tick}
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}

export function MotionChapter(props: ChapterProps) {
  const tokens = [...declared("--ease-"), ...declared("--animate-")].map(({ name, value }) => ({
    token: name,
    value,
    use: USE[name],
  }))
  const glyphs = [
    {
      token: "GLYPH_REVEAL",
      value: `komórka ${GLYPH_REVEAL.cell} px (${GLYPH_REVEAL.cellNarrow} px poniżej 480) · składanie ${GLYPH_REVEAL.build} ms + przeskok ${GLYPH_REVEAL.morph} ms · takt ${GLYPH_REVEAL.tick} ms · druk ${GLYPH_REVEAL.hold} ms · front ${GLYPH_REVEAL.duration} ms`,
      use: "wideo startu (lib/glyph-reveal.ts): canvas 2D, atlas znaków, ton z jasności plakatu",
    },
  ]

  return (
    <DsSection {...props} lead="Przewijanie uruchamia, spoczynek zawsze kompletny">
      <DsNote>
        <Lead>Zasady.</Lead> Każdy efekt ma powód (hierarchia, informacja zwrotna, ciągłość) i jedną
        sygnaturę na sekcję. Wejście strony to samo CSS i nigdy nie czeka na JS. Jedyny efekt
        sterowany przewijaniem, który zostawia niepełny stan, to tekst wypełniany słowo po słowie.
        Przy „ogranicz ruch” wszystko stoi w stanie końcowym: jedna reguła w{" "}
        <Code>globals.css</Code> skraca każde przejście i animację do 1 ms (zdarzenia końca nadal
        przychodzą), a JS pyta <Code>prefersReducedMotion()</Code> albo{" "}
        <Code>useReducedMotion()</Code>.
      </DsNote>

      <DsSubheading>Harmonijka wejścia</DsSubheading>
      <DsNote>
        Jedna oś dla startu i podstron (ms od pierwszego malowania): z góry nagłówek, z boku tory,
        status albo okruszki, słowa tytułu i szarego rozwinięcia, działania, na końcu kadr. Klasy
        biorą pory przez <Code>motion-safe:[animation-delay:var(--enter-status)]</Code>, a animacje
        mają <Code>backwards</Code> — po końcu nie zostaje żaden <Code>filter</Code> ani{" "}
        <Code>translate</Code>.
      </DsNote>
      <CascadeTimeline />
      <Example file="cascade.tsx" title="Harmonijka w miniaturze">
        <Replay label="Powtórz">
          <CascadeExample />
        </Replay>
      </Example>
      <Example
        file="enter-stagger.tsx"
        title="Słowo po słowie — enter-stagger"
        note={
          <>
            Dzieci z indeksem <Code>--i</Code> (<Code>Segments split=&quot;block&quot;</Code>, słowa
            jako <Code>inline-block</Code>); start i krok ustawia rodzic.
          </>
        }
      >
        <Replay label="Powtórz">
          <EnterStaggerExample />
        </Replay>
      </Example>

      <DsSubheading>Przewijanie</DsSubheading>
      <Example
        file="reveal.tsx"
        title="Wjazd bloku — reveal"
        note={
          <>
            Oś <Code>view()</Code>: pierwsze 10 rem przewinięcia od chwili, gdy góra bloku mija dół
            okna. Widoczny przy wczytaniu stoi od razu. Nie na elementach, które same zmieniają{" "}
            <Code>opacity</Code>.
          </>
        }
      >
        <RevealExample />
      </Example>
      <Example
        file="scroll-fill.tsx"
        title="Tekst wypełniany przewijaniem — scroll-fill"
        note={
          <>
            Akapit to jedna oś czasu. Słowo nabiera koloru, gdy mija linię 58% wysokości okna, na
            odcinku przewinięcia równym trzem słowom — granica jest ostra i idzie z czytaniem przy
            każdej wysokości akapitu. Przed nią słowa mają <Code>--fill-from</Code>: najciemniej,
            jak pozwala kontrast 3:1 dużego tekstu. Fraza z kartą idzie z falą, wyróżnia ją samo
            podkreślenie. Przewiń powoli.
          </>
        }
      >
        <ScrollFillExample />
      </Example>

      <DsSubheading>Znaki sygnetu</DsSubheading>
      <Example
        file="glyph-text.tsx"
        title="Napis ze znaków — GlyphText"
        note={
          <>
            Tekst w DOM się nie zmienia (znak rysuje <Code>::after</Code>), czytnik dostaje napis w
            całości. <Code>decode</Code> rusza tylko, gdy napis był pod zgięciem — przewiń stronę od
            góry. Logo w nagłówku to <Code>wave</Code> plus sygnet zmieniający znak co sekundę.
          </>
        }
      >
        <GlyphTextExample />
      </Example>
      <Example
        file="glyph-reveal.tsx"
        title="Wideo startu ze znaków — createGlyphReveal"
        note={
          <>
            Kadr składa się ze znaków ukośnie od lewego górnego rogu (gęstszy znak tam, gdzie obraz
            jest jaśniejszy), stoi chwilę jako druk i odsłania się frontem od lewego dolnego. Na
            starcie pod drukiem rusza wideo; tutaj — sam plakat.
          </>
        }
      >
        <Replay label="Powtórz">
          <GlyphRevealExample />
        </Replay>
      </Example>

      <DsSubheading>Krzywe i animacje (globals.css)</DsSubheading>
      <TokenTable rows={tokens} />
      <DsSubheading>Pozostałe pory</DsSubheading>
      <TokenTable rows={[...OTHER, ...glyphs]} />
    </DsSection>
  )
}
