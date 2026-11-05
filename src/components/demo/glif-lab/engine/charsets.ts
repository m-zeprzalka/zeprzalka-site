import type { Charset } from "../lab/config"

/*
 * Zestawy znaków silnika. Kandydaci do rampy są sortowani według zmierzonego
 * pokrycia tuszem (atlas.ts) i próbkowani równomiernie — kolejność tutaj nie
 * ma znaczenia. Każdy zestaw ma też cztery glify kierunkowe (poziomo, pionowo,
 * „/”, „\”) do konturów i promienia skanera.
 */

export type FontKey = "mono" | "braille" | "kana"

export interface CharsetSpec {
  font: FontKey
  /** Kandydaci do rampy tonalnej (bez spacji — pusta komórka to brak glifu). */
  candidates: string
  /** Ile stopni rampy wybrać (Braille: 256 wzorów w kolejności bitów). */
  steps: number
  lines: string
  /** Krój glifów kierunkowych. */
  linesFont: FontKey
  /** Jaką część tonu niesie krycie (0 — tylko kształt glifu, 1 — tylko krycie). */
  alphaTone: number
  /** Braille: komórka 2×4 punkty rastrowane osobno (dithering), nie rampa. */
  dither: boolean
  /** Glif dobierany do kształtu tonu komórki (2×4), a nie tylko do jasności. */
  match: boolean
  /** Glif losowy (stały w komórce), ton niesie krycie — jak kod w „Matriksie”. */
  random: boolean
  /** Krzywa gęstości (smoothstep): jasne partie pustoszeją, rysy zostają. */
  curve: [number, number]
  /** Katakana jak w filmie: odbita lustrzanie i ściśnięta do komórki mono. */
  mirror: boolean
  /** Skala glifu względem komórki (wysokość). */
  scale: number
}

const ASCII_RAMP = ".'`,:;-~^=+*<>!?/\\|()[]{}%#&$@"
const KANA =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"

export const CHARSET_SPECS: Record<Charset, CharsetSpec> = {
  ascii: {
    font: "mono",
    candidates: ASCII_RAMP,
    steps: 14,
    lines: "-|/\\",
    linesFont: "mono",
    alphaTone: 0.2,
    dither: false,
    match: false,
    random: false,
    curve: [0.1, 0.92],
    mirror: false,
    scale: 1,
  },
  binary: {
    font: "mono",
    candidates: "10",
    steps: 2,
    lines: "-|/\\",
    linesFont: "mono",
    alphaTone: 0.9,
    dither: false,
    match: false,
    random: true,
    curve: [0.06, 0.9],
    mirror: false,
    scale: 1,
  },
  kana: {
    font: "kana",
    candidates: KANA + "0123456789",
    steps: 24,
    lines: "─│╱╲",
    linesFont: "mono",
    alphaTone: 0.85,
    dither: false,
    match: false,
    random: true,
    curve: [0.06, 0.9],
    mirror: true,
    scale: 1,
  },
  braille: {
    font: "braille",
    candidates: "",
    steps: 256,
    lines: "─│╱╲",
    linesFont: "mono",
    alphaTone: 0,
    dither: true,
    match: false,
    random: false,
    curve: [0, 1],
    mirror: false,
    scale: 1,
  },
  blocks: {
    font: "mono",
    candidates: "▘▝▖▗▀▄▌▐▚▞▙▛▜▟█░▒▓",
    steps: 160,
    lines: "─│╱╲",
    linesFont: "mono",
    alphaTone: 0.4,
    dither: false,
    match: true,
    random: false,
    curve: [0, 1],
    mirror: false,
    scale: 1,
  },
  dots: {
    font: "mono",
    candidates: "·∶⋆∴∗∷○◇⊙◎⊚⊕⊗◈◉●",
    steps: 10,
    lines: "─│╱╲",
    linesFont: "mono",
    alphaTone: 0.2,
    dither: false,
    match: false,
    random: false,
    curve: [0.12, 0.95],
    mirror: false,
    scale: 1,
  },
  sygnet: {
    font: "mono",
    candidates: "·∴⋆⌀○◇⎋⊡⊟⊞⌘⎈⎉⎊⊜⊙⊛⊕⊗⍟❖◈◆",
    steps: 12,
    lines: "─│╱╲",
    linesFont: "mono",
    alphaTone: 0.4,
    dither: false,
    match: false,
    random: false,
    curve: [0.12, 0.95],
    mirror: false,
    scale: 1,
  },
}

/** Znaki do dekodowania liter w DOM (bez znaków zbyt podobnych do liter). */
export const TEXT_GLYPHS: Record<Charset, string> = {
  ascii: "#%&*+=?@$/<>{}[]",
  binary: "01",
  kana: KANA,
  braille: "⠁⠃⠇⠏⠟⠿⡿⣿⣷⣯⣟⡾⢿⠾⠷⠯⠽",
  blocks: "░▒▓█▚▞▙▟",
  dots: "·∶∴○◎⊙●◉",
  sygnet: "⎈⎉⎊⎋⌘⊞⊠⊡⊟⊛⊕⊗⍟❖◈",
}

/** Glify, które sygnet w nagłówku pokazuje dla danego zestawu. */
export const MARK_GLYPHS: Record<Charset, string> = {
  ascii: "@#%&$*+=",
  binary: "01",
  kana: "アカサタナハマヤラワ",
  braille: "⣿⡷⢿⣯⣟⠿",
  blocks: "█▓▒░▚▞",
  dots: "●◉◎⊙○",
  sygnet: "⎈⎉⎊⎋⌘⊞⊛⊕⊗⍟❖◈",
}

/** Krój DOM dla danego zestawu (zmienne z `fonts.ts`). */
export const FONT_VAR: Record<FontKey, string> = {
  mono: "var(--gll-font-mono)",
  braille: "var(--gll-font-braille)",
  kana: "var(--gll-font-kana)",
}
