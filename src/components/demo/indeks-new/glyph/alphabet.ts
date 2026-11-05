/**
 * Alfabety odkodowania. Symbole pochodzą z kroju `ixn-glyphs.woff2` (kopia
 * „Glif Symbols” z koncepcji Glif — podzbiór DejaVu Sans Mono, licencja obok),
 * cyfry binarne z Geist Mono, który piaskownica już ładuje. Żaden znak spoza
 * tych krojów nie trafia do canvasu — inaczej przeglądarka podstawiłaby krój
 * systemowy (kolorowe emoji albo puste prostokąty).
 */

/** Raster półtonowy: kropki i koła od najlżejszego do najgęstszego (kolejność ustala pomiar atlasu). */
export const HALFTONE = Array.from("·∶⋆∴∗∷○◇⊙◎⊚⊕⊗◈◉●")

/** Znaki sygnetu — formy geometryczne z logo serwisu, bez tych, które w tekście udają litery. */
export const MARK = Array.from("⎈⎉⎊⎋⌘⊛⊕⊗⍟❖◈⧺⧻⍫⌀⊜◆◇○◎")

/** Kod binarny — „Matrix” bez kiczu: dwie cyfry, kolor bierze się z obrazu. */
export const BINARY = ["0", "1"]

/** Znak spoczynkowy sygnetu i znaki sekcji (sygnet staje na nich, gdy przewijanie się zatrzyma). */
export const REST_GLYPH = "⎈"
export const SECTION_GLYPHS: Readonly<Record<string, string>> = {
  start: "⎈",
  "o-mnie": "◎",
  kompetencje: "⌘",
  realizacje: "◈",
  blog: "⊛",
  kontakt: "⊕",
}

/** Znaki zapisane w kroju (spacje też — inaczej odstępy rysowałby krój zastępczy). */
export const FONT_CHARS = " \u00a0·∶⋆∼∴∵∸∗⍣∷∹∻⋍⨯✕⊢⊣⧺⎈∺⎉○◇⊤⊥⎋⊙⊘⊖⊜⌀⎊⊡⊟⌘◎⊕⊗⊚◈⍟❖⊛◆⍫⧻⊞⊠◍◉●⧫"

if (process.env.NODE_ENV !== "production") {
  const used = new Set([...HALFTONE, ...MARK, ...Object.values(SECTION_GLYPHS), REST_GLYPH])
  const missing = [...used].filter((char) => !FONT_CHARS.includes(char))
  if (missing.length > 0) {
    console.error(`Indeks · nowy: znaki spoza kroju glifów: ${missing.join(" ")}`)
  }
}

export function randomOf<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T
}
