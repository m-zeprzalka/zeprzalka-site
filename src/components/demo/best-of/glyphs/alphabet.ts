/**
 * Słownictwo glifów koncepcji. Dwa języki znaków, każdy z jednym zadaniem:
 * - kropki i koła (`PRINT_GLYPHS`) — obraz: wydruki kafli i portret czytają się
 *   jak raster półtonowy (wielkość kropki = ton);
 * - cyfry `0 1` i kilka znaków składni (`CODE_GLYPHS`, Geist Mono) — kod: koło
 *   za kursorem w scenie kontaktu zamienia obraz w strumień binarny.
 * Sygnet bierze geometryczne znaki z logo serwisu (`MARK_GLYPHS`).
 */

/** Rampa wydruku i portretu — kolejność ustala pomiar pokrycia (`print.ts`). */
export const PRINT_GLYPHS: readonly string[] = Array.from("·∶⋆∴∗∷○◇⊙◎⊚⊕⊗◈◉●")

/** Znaki sygnetu: tylko formy geometryczne z obecnego logo (bez „liter z umlautem”). */
export const MARK_GLYPHS: readonly string[] = Array.from("⎈⎉⎊⎋⌘⊞⊠⊡⊟⊛⊕⊗⍟❖◈⧺⧻⍫⌀⊜◆◇○◎")

/** Znak spoczynkowy sygnetu — na nim staje przy „ogranicz ruch” i w HTML z serwera. */
export const REST_GLYPH = "⎈"

/** Kod w kole: cztery piąte to cyfry binarne, reszta — znaki składni. */
export const CODE_GLYPHS: readonly string[] = Array.from("010101010101010101010101{}<>/=")

/** Znaki zapisane w `glyph-symbols.woff2` (lista z `glif/alphabet.ts`). */
const FONT_CHARS = "  ·∶⋆∼∴∵∸∗⍣∷∹∻⋍⨯✕⊢⊣⧺⎈∺⎉○◇⊤⊥⎋⊙⊘⊖⊜⌀⎊⊡⊟⌘◎⊕⊗⊚◈⍟❖⊛◆⍫⧻⊞⊠◍◉●⧫"

/* Straż w trybie deweloperskim: znak spoza kroju narysowałby system (np. kolorowe emoji). */
if (process.env.NODE_ENV !== "production") {
  const missing = [...PRINT_GLYPHS, ...MARK_GLYPHS, REST_GLYPH].filter(
    (char) => !FONT_CHARS.includes(char)
  )
  if (missing.length > 0) {
    console.error(`Best Of: znaki spoza kroju „Glif Symbols”: ${missing.join(" ")}`)
  }
}

export function randomOf<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T
}
