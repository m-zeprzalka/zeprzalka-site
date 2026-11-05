import localFont from "next/font/local"

/**
 * Krój symboli odkodowania i sygnetu logo (6,8 KB WOFF2): „Indeks Glyphs”,
 * podzbiór DejaVu Sans Mono — pochodzenie i licencja Bitstream Vera
 * w `i1-glyphs.LICENSE.md`. `display: block`: przez chwilę glif jest
 * niewidoczny zamiast znaku z kroju zastępczego (ten wyglądałby jak błąd).
 */
export const glyphFont = localFont({
  src: "./i1-glyphs.woff2",
  variable: "--i1-font-glyph",
  display: "block",
  adjustFontFallback: false,
  fallback: ["monospace"],
})
