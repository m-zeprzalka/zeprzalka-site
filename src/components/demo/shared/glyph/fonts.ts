import localFont from "next/font/local"

/*
 * Kroje glifów (pochodzenie i licencje: `fonts/LICENSE.md`). „Glif Mono” niesie
 * ASCII, bloki, linie i większość znaków logo; „Glif Symbols” — znaki logo,
 * których DejaVu Sans Mono nie ma; „Glif Math” — resztę (STIX Two Math), więc
 * zestaw logo jest kompletny jak w `LogoGlyph`. `display: "block"` — przez chwilę glif jest
 * niewidoczny zamiast znaku zastępczego z innego kroju. Braille dopiero wtedy,
 * gdy któraś powierzchnia go użyje.
 */
export const monoFont = localFont({
  src: "./fonts/gx-mono.woff2",
  variable: "--gx-font-mono",
  display: "block",
  adjustFontFallback: false,
  fallback: [],
})

export const symbolsFont = localFont({
  src: "./fonts/gx-symbols.woff2",
  variable: "--gx-font-symbols",
  display: "block",
  adjustFontFallback: false,
  fallback: [],
})

/** Reszta znaków logo (⨝, ⧬–⧿, ⨃–⨋, ⎄–⎏…) — STIX Two Math, OFL. */
export const mathFont = localFont({
  src: "./fonts/gx-math.woff2",
  variable: "--gx-font-math",
  display: "block",
  adjustFontFallback: false,
  fallback: [],
})

export const brailleFont = localFont({
  src: "./fonts/gx-braille.woff2",
  variable: "--gx-font-braille",
  display: "block",
  preload: false,
  adjustFontFallback: false,
  fallback: [],
})

/** Klasa ze zmiennymi krojów — każdy komponent silnika nakłada ją na swój korzeń. */
export const glyphFontVariables = `${monoFont.variable} ${symbolsFont.variable} ${mathFont.variable} ${brailleFont.variable}`

/** Pierwsza nazwa z listy `font-family` (bez rodzin zastępczych). */
function first(family: string) {
  return family.split(",")[0]?.trim() ?? family
}

/** Rodziny dla canvasu: mono z dopełnieniem symboli i znaków matematycznych, potem monospace. */
export const FONT_FAMILIES = {
  mono: `${first(monoFont.style.fontFamily)}, ${first(symbolsFont.style.fontFamily)}, ${first(mathFont.style.fontFamily)}, monospace`,
  braille: `${first(brailleFont.style.fontFamily)}, monospace`,
} as const
