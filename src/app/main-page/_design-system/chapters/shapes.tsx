import { declared } from "@/app/main-page/_design-system/css-tokens"
import {
  Code,
  DsNote,
  DsSection,
  DsSubheading,
  type ChapterProps,
} from "@/app/main-page/_design-system/ds-section"
import { cn } from "@/lib/utils"

/** Obłości jako zasada: skala promieni od `--radius`, pigułki — `full`. Użycia z komponentów. */
const RADII = [
  {
    className: "rounded-sm",
    token: "--radius-sm",
    use: "podpis-fraza (quiet), kod w treści wpisu",
  },
  { className: "rounded-md", token: "--radius-md", use: "klawisz, miniatury i ikony w ⌘K" },
  { className: "rounded-lg", token: "--radius-lg", use: "wiersze ⌘K, link karty, kopiowanie kodu" },
  {
    className: "rounded-xl",
    token: "--radius-xl",
    use: "pola, kadry, wiersze indeksu, dowody, blok kodu",
  },
  {
    className: "rounded-2xl",
    token: "--radius-2xl",
    use: "karty, okna, popover, CTA, wideo startu",
  },
  {
    className: "rounded-3xl",
    token: "24px",
    use: "arkusz ⌘K na telefonie, obrys fokusu karty wpisu",
  },
  {
    className: "rounded-full",
    token: "pigułka",
    use: "przyciski, plakietki, przełącznik języka, kropki",
  },
] as const

/** Głębia: obrys zamiast cienia, cień tylko tam, gdzie coś unosi się nad treścią. */
const SURFACES = [
  { className: "border", label: "border", use: "domyślny obrys (--border)" },
  {
    className: "border shadow-xs",
    label: "shadow-xs",
    use: "outline, pole, klawisz, aktywny język",
  },
  { className: "border shadow-md", label: "shadow-md", use: "popover pod frazą" },
  { className: "border shadow-lg", label: "shadow-lg", use: "karta na marginesie, okno ⌘K" },
  { className: "ring-[3px] ring-ring", label: "ring-[3px] ring-ring", use: "fokus z klawiatury" },
  {
    className: "border border-destructive ring-[3px] ring-destructive/20",
    label: "aria-invalid",
    use: "błędne pole",
  },
] as const

/** Promień w px z deklaracji: `calc(var(--radius) - 4px)` przy `--radius: 0.75rem` → 8. */
function radiusPx(value: string | undefined, base: number): string | undefined {
  if (!value) return undefined
  if (value === "var(--radius)") return `${base} px`
  const [, sign, size] = value.match(/var\(--radius\)\s*([+-])\s*(\d+)px/) ?? []
  return sign ? `${base + (sign === "+" ? 1 : -1) * Number(size)} px` : value
}

export function ShapesChapter(props: ChapterProps) {
  const radius = new Map(declared("--radius").map(({ name, value }) => [name, value]))
  const base = parseFloat(radius.get("--radius") ?? "0") * 16

  return (
    <DsSection {...props} lead="Obłości, obrysy i cienie">
      <DsNote>
        Jedna skala promieni od <Code>--radius</Code> ({radius.get("--radius")}; <Code>sm</Code> −4
        px, <Code>md</Code> −2, <Code>lg</Code> = <Code>--radius</Code>, <Code>xl</Code> +4,{" "}
        <Code>2xl</Code> +8): im większa powierzchnia, tym większy promień, a wszystko, co się klika
        jako całość (przycisk, plakietka), jest pigułką. Zagnieżdżone kształty mają mniejszy promień
        od rodzica o jego wcięcie (karta 2xl → kadr xl w karcie podglądu).
      </DsNote>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4">
        {RADII.map((item) => (
          <li key={item.className} className="grid content-start gap-2">
            <span className={cn("h-16 border-2 border-foreground/40 bg-muted", item.className)} />
            <span className="font-mono text-xs text-foreground">{item.className}</span>
            <span className="-mt-1 font-mono text-[0.6875rem]">
              {radiusPx(radius.get(item.token), base) ?? item.token}
            </span>
            <span className="text-xs">{item.use}</span>
          </li>
        ))}
      </ul>
      <DsSubheading>Obrysy, cienie i stany</DsSubheading>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3">
        {SURFACES.map((item) => (
          <li key={item.label} className="grid content-start gap-2">
            <span className={cn("h-16 rounded-xl bg-background", item.className)} />
            <span className="font-mono text-xs wrap-break-word text-foreground">{item.label}</span>
            <span className="-mt-1 text-xs">{item.use}</span>
          </li>
        ))}
      </ul>
      <DsNote>
        Najechanie to tło, nie cień: <Code>hover:bg-accent/60</Code> w wierszach indeksu,{" "}
        <Code>hover:bg-accent/50</Code> w kompetencjach, <Code>bg-muted/60</Code> →{" "}
        <Code>hover:bg-accent</Code> w dowodach. Linie dzielące to <Code>border-t</Code> (stopka
        wpisu) albo przerwa w siatce (<Code>gap-px</Code> na tle <Code>bg-border</Code>).
      </DsNote>
    </DsSection>
  )
}
