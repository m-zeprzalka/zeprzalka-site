import { GLYPHS } from "@/app/main-page/_lib/glyphs"
import {
  Code,
  DsNote,
  DsSection,
  DsSubheading,
  type ChapterProps,
} from "@/app/main-page/_design-system/ds-section"
import { cn } from "@/lib/utils"

/** Kroje: tekst, kod i znaki sygnetu. */
const FAMILIES = [
  {
    name: "Geist",
    className: "font-sans",
    sample: "Aa Ąą Ęę Łł Śś Żż 0123",
    use: "cały tekst; latin-ext, z preloadem",
  },
  {
    name: "Geist Mono",
    className: "font-mono",
    sample: "const radius = 12",
    use: "bloki kodu i nazwy z kodu; bez preloadu",
  },
  {
    name: "Znaki sygnetu",
    className: "font-logo",
    sample: GLYPHS.slice(0, 12).join(""),
    use: "logo, dekodowanie napisów, druk wideo; podzbiór 165 znaków",
  },
] as const

/** Stopnie pisma — tylko te, których używa strona (klasy jak w komponentach). */
const SCALE = [
  {
    sample: "Tytuł wpisu na blogu",
    className: "text-title",
    size: "32 → 44 px od 640 px → 48 px od 1440 px, 600",
    use: 'tytuł wpisu (PageHeader variant="article") — stopień nad text-display, ciaśniej',
  },
  {
    sample: "Przekształcam ambitne projekty",
    className: "text-display",
    size: "26 → 34 px od 640 px",
    use: "h1 startu i podstron, dwutonowe z rozwinięciem",
  },
  {
    sample: "Łączę projektowanie z technologią",
    className: "text-2xl leading-snug font-medium tracking-tight md:text-[1.75rem]",
    size: "24 → 28 px od 768 px",
    use: "tekst „O mnie” wypełniany przewijaniem",
  },
  {
    sample: "15+",
    className: "text-3xl font-medium tracking-tight tabular-nums",
    size: "30 px",
    use: "liczby w „O mnie”",
  },
  {
    sample: "Opis wpisu pod tytułem",
    className: "text-lg leading-snug font-normal tracking-normal sm:text-xl",
    size: "18 → 20 px od 640 px",
    use: 'rozwinięcie nagłówka wpisu (variant="article"); text-lg — biogram, logo',
  },
  {
    sample: "Kompetencje",
    className: "text-base font-medium",
    size: "16 px, 500",
    use: "nagłówek sekcji (SectionHeading) i tytuły w wierszach",
  },
  {
    sample: "Opis kompetencji i realizacji",
    className: "text-base",
    size: "16 px",
    use: "tekst, wiersze list; pola 16 px na telefonie (iOS nie powiększa), 14 od 768 px",
  },
  {
    sample: "Kategoria, data, okruszki, przycisk",
    className: "text-sm",
    size: "14 px",
    use: "drugorzędny",
  },
  {
    sample: "Nagłówek grupy, „Nowy”, etykieta spisu",
    className: "text-xs",
    size: "12 px",
    use: "najmniejszy",
  },
] as const

export function TypeChapter(props: ChapterProps) {
  return (
    <DsSection {...props} lead="Jeden krój i stopnie z prawdziwych użyć">
      <DsNote>
        Kroje przez <Code>next/font</Code> (<Code>src/app/fonts.ts</Code> i{" "}
        <Code>layout/fonts.ts</Code>), zmienne na <Code>&lt;html&gt;</Code>. Polska typografia w
        treści: <Code>noOrphans</Code> (twarde spacje po „i”, „w”, „z” i po liczbie),{" "}
        <Code>text-pretty</Code> w akapitach, <Code>tabular-nums</Code> w datach i liczbach,
        półpauzy w okresach („2016–obecnie”).
      </DsNote>
      <ul className="grid gap-3 sm:grid-cols-3">
        {FAMILIES.map((family) => (
          <li key={family.name} className="grid content-start gap-2 rounded-2xl border p-4">
            <span className={cn("truncate text-xl text-foreground", family.className)}>
              {family.sample}
            </span>
            <span className="text-sm text-foreground">
              {family.name} · <span className="font-mono text-xs">{family.className}</span>
            </span>
            <span className="text-xs">{family.use}</span>
          </li>
        ))}
      </ul>
      <DsSubheading>Stopnie</DsSubheading>
      <ul className="grid gap-px overflow-hidden rounded-2xl border bg-border">
        {SCALE.map((style) => (
          <li key={style.className} className="grid gap-2 bg-background px-5 py-4">
            {/* Bez `cn`: tailwind-merge bierze `text-display` za kolor i zgasiłby `text-foreground`. */}
            <span className={`${style.className} text-foreground`}>{style.sample}</span>
            <span className="grid gap-0.5 text-xs">
              <span className="font-mono wrap-break-word text-foreground">{style.className}</span>
              <span>
                {style.size} — {style.use}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <DsNote>
        Poza skalą: kod <Code>13 → 14 px</Code> od 768 px (<Code>code.css</Code>), klawisze{" "}
        <Code>11 px</Code> (<Code>Kbd</Code>), wiersze ⌘K <Code>15 px</Code>, znak stopki — SVG na
        całą szerokość okna. Treść wpisu ma własną skalę (tekst 17 → 19 px, h3 21 → 24 px, h2 26 →
        32 px) — rozdział „Treść wpisu”.
      </DsNote>
    </DsSection>
  )
}
