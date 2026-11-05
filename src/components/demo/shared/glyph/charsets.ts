import type { Charset } from "./settings"

/*
 * Zestawy znaków silnika. Kandydaci do rampy są sortowani według zmierzonego
 * pokrycia tuszem (atlas.ts) i próbkowani równomiernie — kolejność tutaj nie
 * ma znaczenia. Każdy zestaw ma też cztery glify kierunkowe (poziomo, pionowo,
 * „/”, „\”) do wariantu konturowego. Wszystkie znaki są w krojach `fonts/`
 * (sprawdzone przy budowie podzbiorów) — bez „tofu” i bez emoji z systemu.
 */

export type FontKey = "mono" | "braille"

export interface CharsetSpec {
  font: FontKey
  /** Kandydaci do rampy tonalnej (bez spacji — pusta komórka to brak glifu). */
  candidates: string
  /** Ile stopni rampy wybrać (Braille: 256 wzorów w kolejności bitów). */
  steps: number
  lines: string
  /** Jaką część tonu niesie krycie (0 — tylko kształt glifu, 1 — tylko krycie). */
  alphaTone: number
  /** Braille: komórka 2×4 punkty rastrowane osobno (dithering), nie rampa. */
  dither: boolean
  /** Glif dobierany do kształtu tonu komórki (2×4), a nie tylko do jasności. */
  match: boolean
  /** Glif losowy (stały w komórce), ton niesie krycie. */
  random: boolean
  /** Krzywa gęstości (smoothstep): jasne partie pustoszeją, rysy zostają. */
  curve: [number, number]
}

/**
 * Znaki obecnego logo serwisu (`src/components/layout/LogoGlyph.tsx`), które
 * mają krój w `fonts/` — „ASCII ze starego sygnetu”, ulubiony zestaw właściciela.
 */
export const LOGO_GLYPHS =
  "⍤⍨⍫⍮⍯⍰⍲⍳⍴⍵⍶⍷⍸⍹⍺⍻⍼⍽⍾⍿⎈⎇⎋⎌⎍⎎⎏⎄⎅⎆⎊⎉⎂⎃⎀⎁⋇⋉⋊⋋⋌⋍⋎⋏⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿⌀⍂⍙⍚⍛⍜⍝⍞⍠⍡⍢⍣⍦⍧⍩⍪⍬⍭⧫⧬⧭⧮⧯⧰⧱⧲⧳⧴⧵⧶⧷⧸⧹⧺⧻⧼⧽⧾⧿⨀⨁⨂⨃⨄⨅⨆⨇⨈⨉⨊⨋⨌⨍⨎⨏⨐⨑⨒⨓⨔⨕⨖⨗⨘⨙⨚⨛⨜⨝⨞⨟"

/**
 * Rampa „sygnet”: tylko formy geometryczne z logo i jego okolic (koła, kwadraty,
 * romby, gwiazdy, ster ⎈, ⌘) — bez znaków czytających się jak litery (całki,
 * rho, omega, kreski). Od kropek po pełne koło, gęstość dobiera atlas.
 */
export const SYGNET_RAMP = "·∶∴∷⋆∗○◇⌀⊙⊚◎⊜⊝⊡⊟⊞⊠⎈⎉⎊⎋⎄⎅⌘⊕⊗⊛⍟⨀⨁⨂⨉⨝⨞⧫⧬⧭⧮⧯⧰⧱⧲⧳◈❖◆◉●"

const ASCII_RAMP = ".'`,:;-~^=+*<>!?/\\|()[]{}%#&$@"

export const CHARSET_SPECS: Record<Charset, CharsetSpec> = {
  sygnet: {
    font: "mono",
    candidates: SYGNET_RAMP,
    steps: 18,
    lines: "─│╱╲",
    alphaTone: 0.4,
    dither: false,
    match: false,
    random: false,
    curve: [0.1, 0.94],
  },
  ascii: {
    font: "mono",
    candidates: ASCII_RAMP,
    steps: 14,
    lines: "-|/\\",
    alphaTone: 0.2,
    dither: false,
    match: false,
    random: false,
    curve: [0.1, 0.92],
  },
  binary: {
    font: "mono",
    candidates: "10",
    steps: 2,
    lines: "-|/\\",
    alphaTone: 0.9,
    dither: false,
    match: false,
    random: true,
    curve: [0.06, 0.9],
  },
  braille: {
    font: "braille",
    candidates: "",
    steps: 256,
    lines: "─│╱╲",
    alphaTone: 0,
    dither: true,
    match: false,
    random: false,
    curve: [0, 1],
  },
  blocks: {
    font: "mono",
    candidates: "▘▝▖▗▀▄▌▐▚▞▙▛▜▟█░▒▓",
    steps: 160,
    lines: "─│╱╲",
    alphaTone: 0.4,
    dither: false,
    match: true,
    random: false,
    curve: [0, 1],
  },
  dots: {
    font: "mono",
    candidates: "·∶⋆∴∗∷○◇⊙◎⊚⊕⊗◈◉●",
    steps: 10,
    lines: "─│╱╲",
    alphaTone: 0.2,
    dither: false,
    match: false,
    random: false,
    curve: [0.12, 0.95],
  },
}

/** Znaki do dekodowania liter w DOM (bez znaków zbyt podobnych do liter). */
export const TEXT_GLYPHS: Record<Charset, string> = {
  sygnet: "⎈⎉⎊⎋⊞⊠⊡⊟⍟❖◈⊛⊕⊗⨀⨁⨂⧫⨝⊜⧮⧯",
  ascii: "#%&*+=?@$/<>{}[]",
  binary: "01",
  braille: "⠁⠃⠇⠏⠟⠿⡿⣿⣷⣯⣟⡾⢿⠾⠷⠯⠽",
  blocks: "░▒▓█▚▞▙▟",
  dots: "·∶∴○◎⊙●◉",
}

/** Cyfry dekodowane w liczbach: glify o „cyfrowej” wadze, bez liter. */
export const DIGIT_GLYPHS: Record<Charset, string> = {
  sygnet: "⊞⊠⊡⊟⎈⍟◈⨀⨁⨂⨝⧫",
  ascii: "#%&*+=@$",
  binary: "01",
  braille: "⡿⣿⣷⣯⣟⢿",
  blocks: "░▒▓█",
  dots: "○◎⊙●◉",
}

/** Krój DOM dla danego zestawu (zmienne z `fonts.ts`). */
export const FONT_VAR: Record<FontKey, string> = {
  mono: "var(--gx-font-mono), var(--gx-font-symbols), var(--gx-font-math)",
  braille: "var(--gx-font-braille)",
}
