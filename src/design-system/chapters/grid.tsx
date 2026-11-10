import { HEADER_OFFSET } from "@/lib/anchors"
import { COLUMN_SIZES, HALF_COLUMN_SIZES } from "@/lib/media"
import { declared, mediaOverrides } from "@/design-system/css-tokens"
import {
  Code,
  DsNote,
  DsSection,
  DsSubheading,
  TokenTable,
  type ChapterProps,
} from "@/design-system/ds-section"
import { Example } from "@/design-system/example"
import { ColumnEdgeExample } from "@/design-system/examples/column-edge"
import { GridOverlay } from "@/design-system/grid-overlay"
import { cn } from "@/lib/utils"

const REM = 16
const px = (value: string | undefined) => Math.round(parseFloat(value ?? "0") * REM)
/** Próg z zapytania `@media` w px („min-width: 90rem” → min, 1440). */
const edgeOf = (query: string) => {
  const [, side, size] = query.match(/(min|max)-width:\s*([\d.]+)rem/) ?? []
  return { side, at: px(`${size}`) }
}

/**
 * Model siatki z arkusza: tokeny z `@theme` i nadpisania z `@media` (globals.css). Czytany przy
 * każdym renderze — w `pnpm dev` zmiana arkusza od razu zmienia liczby na tej stronie.
 */
function gridModel() {
  const base = new Map(declared("--").map(({ name, value }) => [name, value]))
  const media = mediaOverrides()

  /** Szerokości części siatki (px) przy danej szerokości okna. */
  const at = (width: number) => {
    const tokens = new Map(base)
    for (const { query, tokens: override } of media) {
      const edge = edgeOf(query)
      if ((edge.side === "min" && width >= edge.at) || (edge.side === "max" && width <= edge.at)) {
        override.forEach((value, name) => tokens.set(name, value))
      }
    }
    const column = px(tokens.get("--container-column"))
    const ratio = Number(tokens.get("--container-track")?.match(/\*\s*([\d.]+)/)?.[1] ?? 0)
    const track = Math.round(column * ratio)
    const gap = px(tokens.get("--spacing-track"))
    const page = px(tokens.get("--spacing-page"))
    // Tory są od 1280 px (`xl:`); węziej sama kolumna z marginesem strony.
    if (width >= 1280) {
      return { column, track, gap, page, margin: (width - column - 2 * gap - 2 * track) / 2 }
    }
    const content = Math.min(column, width - 2 * page)
    return { column: content, track: 0, gap: 0, page, margin: (width - content) / 2 }
  }

  /** Wartość tokenu z progami: „40rem · 44rem od 1440 px · 48rem od 1680 px”. */
  const responsive = (name: string) => {
    const steps = media.flatMap(({ query, tokens }) => {
      const value = tokens.get(name)
      if (!value) return []
      const edge = edgeOf(query)
      return [`${value} ${edge.side === "min" ? "od" : "do"} ${edge.at} px`]
    })
    return [base.get(name), ...steps].join(" · ")
  }

  return { at, responsive, token: (name: string) => base.get(name) }
}

type Grid = ReturnType<ReturnType<typeof gridModel>["at"]>

const KIND = {
  margin: { className: "bg-muted", label: "margines" },
  track: { className: "bg-muted-foreground/50", label: "tor" },
  gap: { className: "bg-background", label: "odstęp" },
  column: { className: "bg-primary", label: "kolumna" },
} as const

type Kind = keyof typeof KIND

function GridBar({ width, grid }: { width: number; grid: Grid }) {
  const { column, track, gap, margin, page } = grid
  const parts: [Kind, number][] = track
    ? [
        ["margin", margin],
        ["track", track],
        ["gap", gap],
        ["column", column],
        ["gap", gap],
        ["track", track],
        ["margin", margin],
      ]
    : [
        ["margin", margin],
        ["column", column],
        ["margin", margin],
      ]

  return (
    <li className="grid gap-2">
      <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs">
        <span className="font-mono text-foreground">{width} px</span>
        <span className="tabular-nums">
          kolumna {column}
          {track > 0 ? ` · tor ${track} · odstęp ${gap}` : ` · margines strony ${page}`} · po bokach{" "}
          {Math.round(margin)}
        </span>
      </p>
      <div className="flex h-7 overflow-hidden rounded-lg border">
        {parts.map(([kind, size], index) => (
          <span
            key={index}
            className={KIND[kind].className}
            style={{ width: `${(size / width) * 100}%` }}
          />
        ))}
      </div>
    </li>
  )
}

const RHYTHM = [
  { token: "h-16", value: "64 px, sticky", use: "nagłówek; pod nim rozmycie h-24 z trzech warstw" },
  {
    token: "pt-14 md:pt-24",
    value: "56 → 96 px",
    use: "start treści pod nagłówkiem (start i podstrony)",
  },
  { token: "mt-28 md:mt-36", value: "112 → 144 px", use: "odstęp sekcji startu" },
  {
    token: "mt-24 md:mt-32",
    value: "96 → 128 px",
    use: "odstęp sekcji podstron (Section) i panelu CTA",
  },
  { token: "mt-6 · mt-8", value: "24 · 32 px", use: "nagłówek sekcji → treść (tekst · lista)" },
  { token: "mt-40", value: "160 px", use: "stopka serwisu" },
] as const

export function GridChapter(props: ChapterProps) {
  const grid = gridModel()
  const layout = [
    {
      token: "--container-column",
      value: grid.responsive("--container-column"),
      use: "kolumna treści: utility column (z marginesem strony), max-w-column",
    },
    {
      token: "--container-track",
      value: `${grid.token("--container-track")} = ${[1280, 1440, 1680].map((w) => grid.at(w).track).join(" · ")} px`,
      use: "tor boczny: utility rail (lewy — menu główne) i stage-track (prawy — karta podglądu, spis rozdziałów); szerokość toru gdzie indziej — w-(--container-track)",
    },
    {
      token: "--spacing-track",
      value: grid.responsive("--spacing-track"),
      use: "odstęp toru od kolumny",
    },
    {
      token: "--spacing-page",
      value: grid.responsive("--spacing-page"),
      use: "margines strony (padding kolumny); 16 px przy 320 px — nagłówek mieści się bez przewijania",
    },
    {
      token: "--spacing-rail",
      value: grid.token("--spacing-rail"),
      use: "top-rail: górna krawędź obu torów (menu, spis) = środek pierwszego wiersza treści (154 px)",
    },
    {
      token: "--removed-body-scroll-bar-size",
      value: "szerokość zdjętego paska przewijania, bez blokady 0px",
      use: "rail i stage-track odejmują jej połowę — tory stoją w miejscu, gdy ⌘K zdejmuje pasek (react-remove-scroll)",
    },
    {
      token: "stage:",
      value: "(min-width: 80rem) and (hover: hover) and (pointer: fine)",
      use: "wariant: karta podglądu w prawym torze zamiast popovera (STAGE_QUERY w lib/hooks.ts)",
    },
    {
      token: "HEADER_OFFSET",
      value: `${HEADER_OFFSET} px (scroll-padding-top: 5rem)`,
      use: "miejsce pod nagłówkiem: kotwice, dosuwanie strony, karta podglądu",
    },
    { token: "COLUMN_SIZES", value: COLUMN_SIZES, use: "sizes kadru na szerokość kolumny" },
    {
      token: "HALF_COLUMN_SIZES",
      value: HALF_COLUMN_SIZES,
      use: "sizes galerii i kart w dwóch kolumnach",
    },
  ]

  return (
    <DsSection {...props} lead="Kolumna, dwa tory i marginesy">
      <DsNote>
        Od 1280 px: <Code>[margines][tor][odstęp][kolumna][odstęp][tor][margines]</Code>. Kolumna
        stoi na środku, tory mają stałą proporcję do niej (3/8), resztę szerokości okna biorą
        marginesy. Lewy tor to menu główne, prawy — karta podglądu, a we wpisie (i tutaj) także spis
        rozdziałów, który ustępuje karcie. Tory są <Code>fixed</Code>, więc liczą się od okna, nie
        od <Code>&lt;body&gt;</Code>. Węziej jest sama kolumna z marginesem strony. Nagłówek, sekcje
        i stopka stoją na tej samej osi (<Code>column</Code>).
      </DsNote>
      <GridOverlay />
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs" aria-label="Legenda">
        {Object.values(KIND).map((kind) => (
          <li key={kind.label} className="flex items-center gap-2">
            <span className={cn("size-3 rounded-sm border", kind.className)} />
            {kind.label}
          </li>
        ))}
      </ul>
      <DsSubheading>Od 1280 px — z torami</DsSubheading>
      <ul className="grid gap-5">
        {[1280, 1440, 1680, 1920].map((width) => (
          <GridBar key={width} width={width} grid={grid.at(width)} />
        ))}
      </ul>
      <DsSubheading>Węziej — sama kolumna</DsSubheading>
      <ul className="grid gap-5">
        {[320, 390, 768, 1024].map((width) => (
          <GridBar key={width} width={width} grid={grid.at(width)} />
        ))}
      </ul>
      <DsSubheading>Tokeny siatki</DsSubheading>
      <TokenTable rows={layout} />
      <DsSubheading>Rytm pionowy</DsSubheading>
      <TokenTable rows={RHYTHM} />
      <Example
        file="column-edge.tsx"
        title="Wyrównanie do krawędzi kolumny"
        note={
          <>
            Linie przerywane to krawędzie kolumny. Tło wiersza i przycisku wychodzi poza nie, a
            tekst stoi na linii — ujemny margines równy wcięciu (<Code>-mx-3 px-3</Code>,{" "}
            <Code>-ms-2.5</Code>). Najedź na wiersz.
          </>
        }
      >
        <ColumnEdgeExample />
      </Example>
    </DsSection>
  )
}
