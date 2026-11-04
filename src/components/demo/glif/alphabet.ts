/**
 * Alfabet „Glifu”: znaki z logo uporządkowane według ilości tuszu (pole
 * powierzchni konturu w DejaVu Sans Mono). Poziom 0 = pusto, 7 = najgęściej.
 * W obrębie poziomu glify mają zbliżone pokrycie, więc podmiana jednego na
 * drugi (miganie) nie zmienia jasności obrazu — portret drży, ale stoi.
 */
export const RAMP: readonly (readonly string[])[] = [
  [],
  ["·", "∶", "⋆"],
  ["∼", "∴", "∵", "∸", "∗", "⍣"],
  ["∷", "∹", "∻", "⋍", "⨯", "✕", "⊢", "⊣"],
  ["⧺", "⎈", "∺", "⎉", "○", "◇", "⊤", "⊥", "⎋"],
  ["⊙", "⊘", "⊖", "⊜", "⌀", "⎊", "⊡", "⊟", "⌘", "◎"],
  ["⊕", "⊗", "⊚", "◈", "⍟", "❖"],
  ["⊛", "◆", "⍫", "⧻", "⊞", "⊠"],
  ["◍", "◉", "●", "⧫"],
]

export const LEVELS = RAMP.length - 1

/** Wszystkie glify w jednej tablicy — indeks = pozycja w atlasie canvasu. */
export const GLYPHS: readonly string[] = RAMP.flat()

/** Indeksy glifów (w `GLYPHS`) dla każdego poziomu gęstości. */
export const LEVEL_INDEX: readonly (readonly number[])[] = (() => {
  let next = 0
  return RAMP.map((level) => level.map(() => next++))
})()

/** Znak spoczynkowy logo (ster) — na nim staje sygnet zatrzymany albo przy „ogranicz ruch”. */
export const REST_GLYPH = "⎈"

/**
 * Glify sygnetu i dekodowania tekstu: znaki z obecnego logo, ale tylko formy
 * geometryczne. ⍤ i ⍨ w zdaniu wyglądają jak litery z umlautem, a ∷ jak
 * dwukropek — w sygnecie i w tekście czytały się jak błąd, nie jak znak.
 */
export const MARK_GLYPHS: readonly string[] = Array.from("⎈⎉⎊⎋⌘⊞⊠⊡⊟⊛⊕⊗⍟❖◈⧺⧻⍫⌀⊜◆◇○◎")

/**
 * Kandydaci do rampy wydruku (zakodowane kafle i okładki): kropki i koła —
 * rodzina, która czyta się jak raster półtonowy, więc motyw obrazu jest
 * rozpoznawalny. Bez kresek (∼ ⊢ ⊤ dawały poziome „linie skanowania”), ramek
 * (⊞ wygląda jak brakujący znak) i trójkątów. Kolejność ustala pomiar (`print.ts`).
 */
export const PRINT_GLYPHS: readonly string[] = Array.from("·∶⋆∴∗∷○◇⊙◎⊚⊕⊗◈◉●")

/**
 * Znaki zapisane w `glif-symbols.woff2` (spacja i twarda spacja też — inaczej
 * odstępy w emblematach rysowałby krój zastępczy). Zmiana kroju = zmiana tej
 * listy; pochodzenie, licencja i przepis na plik: `glif-symbols.LICENSE.md`.
 */
export const FONT_CHARS = " \u00a0·∶⋆∼∴∵∸∗⍣∷∹∻⋍⨯✕⊢⊣⧺⎈∺⎉○◇⊤⊥⎋⊙⊘⊖⊜⌀⎊⊡⊟⌘◎⊕⊗⊚◈⍟❖⊛◆⍫⧻⊞⊠◍◉●⧫"

/*
 * Straż w trybie deweloperskim: każdy znak używany w logo, polu, emblematach,
 * dekodowaniu tekstu i wydruku musi być w kroju. Znak spoza kroju narysowałby
 * system (np. kolorowy krój emoji) — błąd wychodzi w konsoli od razu.
 */
if (process.env.NODE_ENV !== "production") {
  const used = new Set([...GLYPHS, ...MARK_GLYPHS, ...PRINT_GLYPHS, REST_GLYPH])
  const missing = [...used].filter((char) => !FONT_CHARS.includes(char))
  if (missing.length > 0) {
    console.error(`Glif: znaki spoza kroju „Glif Symbols”: ${missing.join(" ")}`)
  }
}

export function randomOf<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T
}
