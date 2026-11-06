import { cn } from "@/lib/utils"

/** Kolory semantyczne shadcn (paleta neutral) — klasa `bg-*` / `text-*` i zmienna w globals.css. */
const COLORS = [
  { name: "background", className: "bg-background", use: "tło strony" },
  { name: "foreground", className: "bg-foreground", use: "tekst" },
  { name: "card", className: "bg-card", use: "otwarta karta akordeonu" },
  { name: "popover", className: "bg-popover", use: "karta podglądu, okna" },
  { name: "primary", className: "bg-primary", use: "główny przycisk" },
  { name: "secondary", className: "bg-secondary", use: "przycisk drugorzędny, chipy" },
  { name: "muted", className: "bg-muted", use: "tła kadrów, kod" },
  { name: "muted-foreground", className: "bg-muted-foreground", use: "tekst drugorzędny" },
  { name: "accent", className: "bg-accent", use: "najechanie, aktywna fraza" },
  { name: "border", className: "bg-border", use: "obrysy" },
  { name: "ring", className: "bg-ring", use: "fokus" },
  { name: "success", className: "bg-success", use: "status „gotowy”" },
] as const

export function ColorTokens() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {COLORS.map((color) => (
        <li key={color.name} className="grid gap-2">
          <span className={cn("h-14 rounded-xl border", color.className)} />
          <span className="text-sm text-foreground">{color.name}</span>
          <span className="-mt-1.5 text-xs">{color.use}</span>
        </li>
      ))}
    </ul>
  )
}

/** Obłości jako zasada: jedna skala promieni od `--radius` (0,75 rem), pigułki — `full`. */
const RADII = [
  { name: "rounded-md", use: "drobne: kbd, miniatury" },
  { name: "rounded-lg", use: "wiersze w oknach" },
  { name: "rounded-xl", use: "pola, kadry, wiersze list" },
  { name: "rounded-2xl", use: "karty, okna, akordeon" },
  { name: "rounded-full", use: "przyciski, chipy, przełączniki" },
] as const

export function RadiusTokens() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {RADII.map((radius) => (
        <li key={radius.name} className="grid gap-2">
          <span className={cn("h-16 border-2 border-foreground/40 bg-muted", radius.name)} />
          <span className="font-mono text-xs text-foreground">{radius.name}</span>
          <span className="-mt-1.5 text-xs">{radius.use}</span>
        </li>
      ))}
    </ul>
  )
}

/** Skala pisma — tylko style, których używa strona (Geist). */
const TYPE = [
  {
    sample: "Przekształcam ambitne projekty",
    className: "text-[1.625rem] leading-[1.2] font-medium tracking-tight sm:text-[2.125rem]",
    use: "h1 startu",
  },
  {
    sample: "Łączę umiejętności techniczne",
    className: "text-2xl leading-snug font-medium tracking-tight md:text-[1.75rem]",
    use: "tekst „O mnie”",
  },
  { sample: "15+", className: "text-3xl font-medium tracking-tight tabular-nums", use: "liczby" },
  {
    sample: "Kompetencje — w jednym wierszu",
    className: "text-base font-medium",
    use: "nagłówek sekcji",
  },
  { sample: "Opis kompetencji i realizacji", className: "text-base", use: "tekst" },
  { sample: "Kategoria, data, podpis", className: "text-sm", use: "drugorzędny" },
  { sample: "Uwagi, skróty", className: "text-xs", use: "najmniejszy" },
] as const

export function TypeScale() {
  return (
    <ul className="grid gap-5">
      {TYPE.map((style) => (
        <li key={style.use} className="grid gap-1">
          <span className={cn("text-foreground", style.className)}>{style.sample}</span>
          <span className="font-mono text-xs">
            {style.use} · {style.className}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Siatka i ruch — wartości tokenów z globals.css (`@theme`). */
const LAYOUT = [
  {
    token: "--container-column",
    value: "40 rem · 44 rem od 1440 px · 48 rem od 1680 px",
    use: "kolumna treści (`max-w-column`, `column`)",
  },
  { token: "--spacing-page", value: "20 px · 32 px od 768 px", use: "margines strony" },
  {
    token: "--spacing-track",
    value: "32 px · 48 px od 1440 px",
    use: "odstęp kolumny od torów bocznych",
  },
  {
    token: "stage:",
    value: "od 1280 px, mysz (hover + pointer: fine)",
    use: "wariant: karta na marginesie zamiast popovera (`STAGE_QUERY`)",
  },
  {
    token: "HEADER_OFFSET",
    value: "80 px (`scroll-padding-top: 5rem`)",
    use: "miejsce pod nagłówkiem: kotwice, dosuwanie strony, karta",
  },
] as const

const MOTION = [
  {
    token: "--ease-out",
    value: "cubic-bezier(0.22, 1, 0.36, 1)",
    use: "wejścia, płynięcie karty, przelot kadru",
  },
  {
    token: "--ease-in-out",
    value: "cubic-bezier(0.65, 0, 0.35, 1)",
    use: "kropka spisu, rysowanie obwódki",
  },
  { token: "--animate-enter", value: "540 ms, rozmycie 8 px → 0", use: "harmonijka startu, słowa" },
  {
    token: "--animate-peek-in / out",
    value: "240 / 200 ms, rozmycie 6 px",
    use: "zmiana treści karty",
  },
  { token: "--animate-draw", value: "450 ms + 150 ms zwłoki", use: "obwódka „Nowy”" },
  {
    token: "--animate-expand / collapse",
    value: "200 ms, wysokość z pomiaru Radix (przed nim 0)",
    use: "akordeony",
  },
  {
    token: "observeReveal",
    value: "pierwszy odczyt IntersectionObserver, bez pomiarów",
    use: "animacje „przy wejściu w kadr”: napisy, „Nowy”, stopka",
  },
  {
    token: "GlyphText",
    value: "decode 820 ms · fala 26 ms/litera · 14 kl./s",
    use: "nagłówki, liczby, logo",
  },
] as const

export function TokenTable({ rows }: { rows: "layout" | "motion" }) {
  const list = rows === "layout" ? LAYOUT : MOTION
  return (
    <dl className="grid gap-px overflow-hidden rounded-2xl border bg-border">
      {list.map((row) => (
        <div
          key={row.token}
          className="grid gap-1 bg-background px-5 py-4 sm:grid-cols-[13rem_1fr] sm:gap-4"
        >
          <dt className="font-mono text-xs text-foreground">{row.token}</dt>
          <dd className="grid gap-0.5 text-sm">
            <span className="text-foreground">{row.value}</span>
            <span>{row.use}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
