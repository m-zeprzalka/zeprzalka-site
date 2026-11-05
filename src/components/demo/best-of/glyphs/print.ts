import { PRINT_GLYPHS } from "./alphabet"
import type { Atlas } from "./atlas"

/*
 * „Wydruk z glifów” (wzór: `glif/print.ts`) — tonowanie obrazu do zakodowanego
 * stanu kafli i do portretu w scenie kontaktu.
 * Rampa nie jest zgadywana: pokrycie tuszem każdego glifu jest mierzone na
 * atlasie (dokładnie te piksele, które potem trafią na ekran), a obraz przed
 * próbkowaniem dostaje wyostrzenie krawędzi i auto-poziomy, więc jasny zrzut
 * strony i ciemna okładka wykorzystują całą rampę tak samo.
 */

/** Stopnie rampy (bez pustej komórki — ta jest tylko dla prawdziwej bieli). */
export const PRINT_STEPS = 10

/** Glify, które nie zostawiają na papierze prawie nic, nie nadają się do rampy. */
const MIN_COVERAGE = 0.01

/** Pokrycie tuszem każdego glifu atlasu: suma alfy w komórce / pole komórki. */
function measureCoverage(atlas: Atlas): number[] {
  const ctx = atlas.image.getContext("2d")
  if (!ctx) return []
  const { width, height } = atlas.image
  const data = ctx.getImageData(0, 0, width, height).data
  return atlas.chars.map((_, glyph) => {
    let sum = 0
    for (let y = 0; y < atlas.ch; y++) {
      const row = (y * width + glyph * atlas.cw) * 4 + 3
      for (let x = 0; x < atlas.cw; x++) sum += data[row + x * 4] ?? 0
    }
    return sum / (atlas.cw * atlas.ch * 255)
  })
}

/**
 * Dziesięć glifów rozłożonych równomiernie po zmierzonym pokryciu, od
 * najjaśniejszego do najciemniejszego (indeksy w `GLYPHS` i w atlasie).
 */
export function measureRamp(atlas: Atlas, covered = measureCoverage(atlas)): number[] {
  const candidates = PRINT_GLYPHS.map((char) => atlas.chars.indexOf(char))
    .filter((glyph) => glyph >= 0 && (covered[glyph] ?? 0) >= MIN_COVERAGE)
    .sort((a, b) => (covered[a] ?? 0) - (covered[b] ?? 0))
  if (candidates.length === 0) return []
  const lo = covered[candidates[0] as number] ?? 0
  const hi = covered[candidates[candidates.length - 1] as number] ?? 1
  const ramp: number[] = []
  for (let step = 0; step < PRINT_STEPS; step++) {
    const target = lo + ((hi - lo) * step) / (PRINT_STEPS - 1)
    let best = -1
    let bestError = Infinity
    for (const glyph of candidates) {
      if (ramp.includes(glyph)) continue
      const error = Math.abs((covered[glyph] ?? 0) - target)
      if (error < bestError) {
        best = glyph
        bestError = error
      }
    }
    if (best >= 0) ramp.push(best)
  }
  return ramp.sort((a, b) => (covered[a] ?? 0) - (covered[b] ?? 0))
}

/** Luminancja (0–1) pikseli RGBA. */
export function luminance(data: Uint8ClampedArray, count: number): Float32Array {
  const lum = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    lum[i] =
      (0.2126 * (data[i * 4] ?? 0) +
        0.7152 * (data[i * 4 + 1] ?? 0) +
        0.0722 * (data[i * 4 + 2] ?? 0)) /
      255
  }
  return lum
}

/** Mediana tonu (po auto-poziomach) powyżej / poniżej progu = jasne / ciemne tło obrazu. */
const LIGHT_GROUND = 0.62
const DARK_GROUND = 0.38

/**
 * Obraz (luminancja w siatce komórek) → stopień rampy każdej komórki:
 * wyostrzenie 3×3, auto-poziomy na 2. i 98. percentylu, polaryzacja, gamma.
 *
 * Polaryzacja: dominujący ton obrazu (mediana) staje się papierem. Zrzut
 * strony na bieli — glify tam, gdzie ciemno; ciemna okładka albo nocne
 * zdjęcie — glify tam, gdzie jasno; obraz w półtonach — pozytyw zgodny
 * z motywem (tusz na jasnym papierze, jasny glif na ciemnym). Dzięki temu
 * wydruk jest miękki w obu motywach, a nie jest dywanem znaków.
 * 0 = pusto, 1…PRINT_STEPS = glif.
 */
export function printLevels(
  lum: Float32Array,
  cols: number,
  rows: number,
  dark: boolean
): Uint8Array {
  const count = cols * rows
  const sharp = new Float32Array(count)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let sum = 0
      let n = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const y = row + dy
          const x = col + dx
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue
          sum += lum[y * cols + x] ?? 0
          n++
        }
      }
      const value = lum[row * cols + col] ?? 0
      // Maska wyostrzająca: krawędzie (ramki urządzeń, nagłówki) wychodzą z szumu.
      sharp[row * cols + col] = value + 0.8 * (value - sum / n)
    }
  }
  const sorted = Array.from(sharp).sort((a, b) => a - b)
  const lo = sorted[Math.floor(count * 0.02)] ?? 0
  const hi = sorted[Math.min(count - 1, Math.floor(count * 0.98))] ?? 1
  const span = Math.max(0.04, hi - lo)

  const median = ((sorted[Math.floor(count / 2)] ?? 0.5) - lo) / span
  const inkWhereDark = median >= LIGHT_GROUND ? true : median <= DARK_GROUND ? false : !dark

  const levels = new Uint8Array(count)
  for (let i = 0; i < count; i++) {
    const light = Math.min(1, Math.max(0, ((sharp[i] ?? 0) - lo) / span))
    // Gamma 1,6: półtony jaśnieją, pełna gęstość zostaje dla najmocniejszych kształtów.
    // Pusta komórka tylko dla tonu papieru (biel strony, czerń okładki) — bez „kurzu” na tle.
    const density = Math.pow(inkWhereDark ? 1 - light : light, 1.6)
    levels[i] = density < 0.06 ? 0 : Math.min(PRINT_STEPS, 1 + Math.floor(density * PRINT_STEPS))
  }
  return levels
}
