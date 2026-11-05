import localFont from "next/font/local"

/**
 * Krój glifów („Glif Symbols” — 52 symbole z logo i z rampy gęstości, podzbiór
 * DejaVu Sans Mono pod zmienioną nazwą; licencja obok w `glyph-symbols.LICENSE.md`).
 * Kopia z koncepcji „Glif” — sygnet, wydruki kafli i portret rysują dokładnie
 * te same kształty w DOM i w canvasie, bez pustych prostokątów z braku czcionek.
 * `display: block` — przez chwilę glif jest niewidoczny zamiast znaku zastępczego.
 */
export const glyphFont = localFont({
  src: "./glyph-symbols.woff2",
  variable: "--bo-font-glyph",
  display: "block",
  adjustFontFallback: false,
  fallback: ["monospace"],
})
