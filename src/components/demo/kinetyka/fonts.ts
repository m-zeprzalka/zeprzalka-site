import localFont from "next/font/local"

/**
 * Glify sygnetu z własnego pliku (kopia „Glif Symbols”, licencja obok w
 * `kn-glyphs.LICENSE.md`) — znak zawsze ma ten sam kształt i nigdy nie jest
 * pustym prostokątem ani kolorowym emoji z kroju systemowego.
 */
export const glyphFont = localFont({
  src: "./kn-glyphs.woff2",
  variable: "--kn-font-glyph",
  display: "block",
  adjustFontFallback: false,
  fallback: ["monospace"],
})
