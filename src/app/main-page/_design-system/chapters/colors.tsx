import "@/app/main-page/_components/blog/code.css"
import { themeTokens } from "@/app/main-page/_design-system/css-tokens"
import {
  Code,
  DsNote,
  DsSection,
  DsSubheading,
  type ChapterProps,
} from "@/app/main-page/_design-system/ds-section"

/** Kolory semantyczne shadcn (paleta neutral): tło i — gdy jest — jego tekst. */
const SEMANTIC = [
  { name: "background", text: "foreground", use: "tło strony i jego tekst" },
  { name: "card", text: "card-foreground", use: "otwarta kompetencja, panel CTA" },
  { name: "popover", text: "popover-foreground", use: "karta podglądu, popover, ⌘K" },
  { name: "primary", text: "primary-foreground", use: "główny przycisk, zaznaczony wybór" },
  { name: "secondary", text: "secondary-foreground", use: "przycisk drugorzędny, plakietki" },
  { name: "muted", text: "muted-foreground", use: "tła kadrów i kodu; tekst drugorzędny" },
  { name: "accent", text: "accent-foreground", use: "najechanie, aktywna fraza, wybór w ⌘K" },
  { name: "destructive", use: "błędne pole i komunikat formularza" },
  { name: "border", use: "obrysy, linie tabel" },
  { name: "input", use: "obrys pól; w ciemnym także tło (dark:bg-input/30)" },
  { name: "ring", use: "obwódka fokusu — pełny kolor, ≥ 3:1" },
  { name: "success", use: "kropka statusu, komunikat wysłania formularza" },
] as const

/** Kategorie składni (`code.css`) i próbka tekstu w każdej z nich. */
const SYNTAX = [
  { name: "syntax-keyword", sample: "export const", use: "słowa kluczowe, selektory znaczników" },
  { name: "syntax-string", sample: '"tekst"', use: "napisy, wyrażenia regularne, dodane linie" },
  { name: "syntax-function", sample: "render()", use: "nazwy funkcji, tytuły, sekcje" },
  { name: "syntax-number", sample: "42 true", use: "liczby, literały, linki" },
  { name: "syntax-type", sample: "<Button>", use: "typy, klasy, nazwy znaczników" },
  { name: "syntax-attribute", sample: "className", use: "atrybuty, właściwości, selektory id" },
  { name: "syntax-deletion", sample: "- usunięte", use: "usunięte linie (diff)" },
  { name: "muted-foreground", sample: "// komentarz", use: "komentarze, interpunkcja, operatory" },
  { name: "foreground", sample: "props", use: "zmienne, parametry, reszta kodu" },
] as const

/** Wartość w obu motywach — z arkusza, nie z kopii w kodzie. */
function Values({ light, dark }: { light?: string; dark?: string }) {
  return (
    <span className="grid font-mono text-[0.6875rem] leading-relaxed text-muted-foreground">
      <span>jasny {light ?? "—"}</span>
      <span>ciemny {dark ?? light ?? "—"}</span>
    </span>
  )
}

export function ColorsChapter(props: ChapterProps) {
  const ui = themeTokens("globals")
  const code = themeTokens("code")
  // Paleta składni nie nadpisuje tekstu i komentarzy — te biorą tokeny strony.
  const syntax = (name: string, theme: "light" | "dark") =>
    code[theme].get(`--${name}`) ?? ui[theme].get(`--${name}`)

  return (
    <DsSection {...props} lead="Semantyczne nazwy shadcn, ciemny motyw na start">
      <DsNote>
        Wartości w oklch: <Code>:root</Code> to jasny motyw, <Code>.dark</Code> — ciemny (domyślny,
        już w HTML). Ciemny działa tylko na ekranie, wydruk jest zawsze jasny. Używamy nazw (
        <Code>bg-muted</Code>, <Code>text-muted-foreground</Code>), nigdy wartości. Próbki niżej
        pokazują bieżący motyw — przełącznik jest w nagłówku.
      </DsNote>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3">
        {SEMANTIC.map((color) => (
          <li key={color.name} className="grid content-start gap-2">
            <span
              className="grid h-16 place-items-center rounded-xl border text-lg font-medium"
              style={{
                backgroundColor: `var(--${color.name})`,
                color: "text" in color ? `var(--${color.text})` : undefined,
              }}
            >
              {"text" in color && "Aa"}
            </span>
            <span className="text-sm wrap-break-word text-foreground">
              {color.name}
              {"text" in color && <span className="text-muted-foreground"> / {color.text}</span>}
            </span>
            <span className="-mt-1 text-xs">{color.use}</span>
            <Values light={ui.light.get(`--${color.name}`)} dark={ui.dark.get(`--${color.name}`)} />
          </li>
        ))}
        <li className="grid content-start gap-2">
          <span className="h-16 rounded-xl border bg-print" />
          <span className="text-sm text-foreground">print</span>
          <span className="-mt-1 text-xs">czerń druku ze znaków (kadr startu), stała</span>
          <Values light="#0b0b0b" />
        </li>
      </ul>

      <DsSubheading>Składnia kodu</DsSubheading>
      <DsNote>
        Tokeny <Code>--syntax-*</Code> w <Code>blog/code.css</Code>: sześć barw o tej samej jasności
        (jeden stopień oklch na motyw) — żadna kategoria nie krzyczy głośniej, a każda ma kontrast ≥
        5:1 do tła bloku. Komentarze i interpunkcja biorą szarość tekstu pomocniczego, zmienne —
        kolor tekstu. Próbki stoją na tle bloku kodu; pełne bloki w kilku językach są w rozdziale
        „Treść wpisu”.
      </DsNote>
      <ul className="code-block grid gap-px overflow-hidden">
        {SYNTAX.map((token) => (
          <li
            key={token.name}
            className="grid gap-1 px-5 py-3 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
          >
            <span
              className="font-mono text-[0.8125rem] font-medium"
              style={{ color: `var(--${token.name})` }}
            >
              {token.sample}
            </span>
            <span className="grid gap-0.5 text-xs text-muted-foreground">
              <span className="font-mono text-foreground">--{token.name}</span>
              {token.use}
            </span>
            <Values light={syntax(token.name, "light")} dark={syntax(token.name, "dark")} />
          </li>
        ))}
      </ul>
    </DsSection>
  )
}
