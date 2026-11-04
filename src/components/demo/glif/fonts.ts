import localFont from "next/font/local"

/**
 * „Glif Symbols” — 52 symbole (z logo i z rampy gęstości: ⎈ ⊞ ⧫ ∴…) oraz spacje,
 * wycięte z DejaVu Sans Mono i przemianowane (licencja Bitstream Vera pozwala
 * na zmiany pod nową nazwą; pochodzenie i pełny tekst: `glif-symbols.LICENSE.md`),
 * 4,6 KB WOFF2. Własny plik zamiast znaków z systemu: logo nie pokazuje już
 * pustych prostokątów tam, gdzie brakuje czcionek z symbolami (dług nr 11),
 * a canvas i DOM rysują dokładnie te same kształty.
 *
 * `display: block` — przez krótką chwilę glif jest niewidoczny zamiast
 * zastępczego znaku z innego kroju (zastępczy wyglądałby jak błąd).
 */
export const glyphFont = localFont({
  src: "./glif-symbols.woff2",
  variable: "--gl-font-glyph",
  display: "block",
  adjustFontFallback: false,
  fallback: ["monospace"],
})
