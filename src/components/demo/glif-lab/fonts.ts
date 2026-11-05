import localFont from "next/font/local"

/*
 * Kroje glifów (pochodzenie i licencje: `fonts/LICENSE.md`). `display: block`
 * — przez chwilę glif jest niewidoczny zamiast zastępczego znaku z innego
 * kroju. Mono jest pobierany od razu (portret w hero), Braille i katakana
 * dopiero wtedy, gdy laboratorium ich użyje.
 */
export const monoFont = localFont({
  src: "./fonts/gll-mono.woff2",
  variable: "--gll-font-mono",
  display: "block",
  adjustFontFallback: false,
  fallback: ["monospace"],
})

export const brailleFont = localFont({
  src: "./fonts/gll-braille.woff2",
  variable: "--gll-font-braille",
  display: "block",
  preload: false,
  adjustFontFallback: false,
  fallback: ["monospace"],
})

export const kanaFont = localFont({
  src: "./fonts/gll-kana.woff2",
  variable: "--gll-font-kana",
  display: "block",
  preload: false,
  adjustFontFallback: false,
  fallback: ["monospace"],
})

export const fontVariables = `${monoFont.variable} ${brailleFont.variable} ${kanaFont.variable}`

export const FONT_FAMILIES = {
  mono: monoFont.style.fontFamily,
  braille: brailleFont.style.fontFamily,
  kana: kanaFont.style.fontFamily,
}
