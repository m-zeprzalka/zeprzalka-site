/*
 * Ustawienia efektów ze znaków — JEDNO miejsce, w którym właściciel stroi
 * silnik (iteracja 7, wybór z „Glif · laboratorium”). Moduł czysty: bez Reacta
 * i DOM, importują go serwer (podpisy) i wyspy klienckie.
 *
 * Decyzje właściciela (docs/prompt-najnowszy.md, pkt 3):
 * - zestaw „Sygnet” — znaki z obecnego logo („ASCII ze starego sygnetu”), drugi ASCII;
 *   bez katakany i Matrixa;
 * - wszystkie animacje dobre, skaner odpada;
 * - tempo 6/8–24 kl./s (60 odpada), komórki małe (14 px za duże);
 * - kolor: bazowy atrament (bez odwróconego i zieleni);
 * - portret tonalny, kursor = tylko szum, obszar nieregularny i morfujący (nie koło).
 */

export type Charset = "sygnet" | "ascii" | "binary" | "braille" | "blocks" | "dots"
/** Przepływ — obraz „oddycha”; fala — od punktu; szum — losowo; deszcz — kolumnami; rozpad — w dół. */
export type Mode = "flow" | "wave" | "scramble" | "rain" | "dissolve"
export type Fps = 6 | 8 | 12 | 24
/** Komórka siatki w px CSS (wysokość = 1,6 × szerokość). */
export type Cell = 6 | 8 | 10
export type Render = "tone" | "contour"

export interface GlyphSettings {
  charset: Charset
  mode: Mode
  fps: Fps
  cell: Cell
  render: Render
  /** Czas dekodowania (ms) — tekst, liczby, media. Nie krócej niż ~700 ms (tekst nie może być za szybki). */
  decode: number
  /** Jedyny kolor: atrament w kolorze tekstu (na jasnym — ciemny, na ciemnym — jasny). */
  tone: "ink"
  /** Kursor i palec: tylko szum, w nieregularnym, morfującym obszarze. */
  cursor: "noise"
}

export const GLYPH_DEFAULTS: GlyphSettings = {
  charset: "sygnet",
  mode: "flow",
  fps: 12,
  cell: 8,
  render: "tone",
  decode: 1100,
  tone: "ink",
  cursor: "noise",
}

export function withDefaults(settings?: Partial<GlyphSettings>): GlyphSettings {
  return settings ? { ...GLYPH_DEFAULTS, ...settings } : GLYPH_DEFAULTS
}

/* ——— Słownik opcji (krótkie napisy interfejsu — panel „Pobaw się”) ——— */

export const CHARSETS: readonly { id: Charset; label: string; sample: string }[] = [
  { id: "sygnet", label: "Sygnet", sample: "⎈⊞⍟" },
  { id: "ascii", label: "ASCII", sample: "#%+:" },
  { id: "binary", label: "Binarny", sample: "0110" },
  { id: "braille", label: "Braille", sample: "⣿⡷⠕" },
  { id: "blocks", label: "Bloki", sample: "█▓▒░" },
  { id: "dots", label: "Kropki", sample: "●◎○·" },
]

export const MODES: readonly { id: Mode; label: string }[] = [
  { id: "flow", label: "Przepływ" },
  { id: "wave", label: "Fala" },
  { id: "scramble", label: "Szum" },
  { id: "rain", label: "Deszcz" },
  { id: "dissolve", label: "Rozpad" },
]

export const FPS_OPTIONS: readonly Fps[] = [6, 8, 12, 24]
export const CELL_OPTIONS: readonly Cell[] = [6, 8, 10]

/** Gotowe zestawienia do wypróbowania (wszystkie w granicach wyboru właściciela). */
export const PRESETS: readonly { id: string; label: string; settings: Partial<GlyphSettings> }[] = [
  { id: "sygnet", label: "Sygnet", settings: { charset: "sygnet", mode: "flow", fps: 12 } },
  { id: "ascii", label: "ASCII", settings: { charset: "ascii", mode: "wave", fps: 8 } },
  { id: "binary", label: "Binarny", settings: { charset: "binary", mode: "rain", fps: 12 } },
  { id: "braille", label: "Braille", settings: { charset: "braille", mode: "flow", fps: 24 } },
  { id: "calm", label: "Spokój", settings: { mode: "dissolve", fps: 6, decode: 1800 } },
]
