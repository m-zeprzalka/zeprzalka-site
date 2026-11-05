import localFont from "next/font/local"

/**
 * Krój symboli odkodowania i sygnetu (4,6 KB WOFF2): kopia „Glif Symbols”
 * z koncepcji Glif pod własną nazwą pliku — pochodzenie i licencja Bitstream
 * Vera w `ixn-glyphs.LICENSE.md`. `display: block`: przez chwilę glif jest
 * niewidoczny zamiast znaku z kroju zastępczego (ten wyglądałby jak błąd).
 */
export const glyphFont = localFont({
  src: "./ixn-glyphs.woff2",
  variable: "--ixn-font-glyph",
  display: "block",
  adjustFontFallback: false,
  fallback: ["monospace"],
})
