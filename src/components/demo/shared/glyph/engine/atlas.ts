import type { Charset } from "../settings"
import { CHARSET_SPECS, type FontKey } from "../charsets"

/*
 * Atlas glifów: każdy znak narysowany raz, w dokładnym rozmiarze komórki
 * w pikselach urządzenia (shader czyta go `texelFetch` — bez filtrowania,
 * glify zostają ostre). Rampa tonalna nie jest zgadywana: pokrycie tuszem
 * mierzymy na tych samych pikselach, które trafią na ekran, i wybieramy
 * stopnie równo rozłożone po pokryciu. Kolejność w atlasie = gęstość.
 */

export interface Atlas {
  canvas: HTMLCanvasElement
  /** Komórka w px urządzenia (liczby całkowite — bez szwów). */
  cw: number
  ch: number
  /** Glifów w rzędzie atlasu. */
  columns: number
  /** Liczba stopni rampy (indeksy 0…ramp−1, od najjaśniejszego). */
  ramp: number
  /** Indeks pierwszego z czterech glifów kierunkowych. */
  lines: number
  /** Kształt glifu: pokrycie 8 pod-komórek (2 × 4), znormalizowane — RGBA8, 2 rzędy. */
  shapes: Uint8Array
}

export type Families = Record<FontKey, string>

const COLUMNS = 32
const cache = new Map<string, Atlas>()
/** Kolejność punktów Braille’a: bit → pod-komórka (2 kolumny × 4 rzędy). */
const BRAILLE_ORDER = [0, 2, 4, 1, 3, 5, 6, 7]

/** Rysuje znak wyśrodkowany optycznie w komórce. */
function drawGlyph(
  ctx: CanvasRenderingContext2D,
  char: string,
  x: number,
  y: number,
  cw: number,
  ch: number,
  family: string,
  font: FontKey
) {
  // Rozmiar kroju tak, by znak wypełnił komórkę: mono 0,602 em szerokości, Braille 0,732 em.
  const size = font === "braille" ? cw / 0.732 : cw / 0.602
  ctx.save()
  ctx.font = `${size.toFixed(2)}px ${family}`
  ctx.textAlign = "center"
  ctx.textBaseline = "alphabetic"
  const metrics = ctx.measureText(char)
  const baseline = (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2
  ctx.beginPath()
  ctx.rect(x, y, cw, ch)
  ctx.clip()
  ctx.translate(x + cw / 2, y + ch / 2)
  ctx.fillText(char, 0, baseline)
  ctx.restore()
}

function coverageOf(
  data: Uint8ClampedArray,
  width: number,
  x0: number,
  y0: number,
  cw: number,
  ch: number
) {
  let sum = 0
  for (let y = 0; y < ch; y++) {
    const row = ((y0 + y) * width + x0) * 4 + 3
    for (let x = 0; x < cw; x++) sum += data[row + x * 4] ?? 0
  }
  return sum / (Math.max(1, cw * ch) * 255)
}

/** Pokrycie ośmiu pod-komórek glifu (2 kolumny × 4 rzędy, od lewej górnej). */
function shapeOf(
  data: Uint8ClampedArray,
  width: number,
  x0: number,
  y0: number,
  cw: number,
  ch: number
) {
  const out: number[] = []
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 2; i++) {
      const sx = Math.round((i * cw) / 2)
      const ex = Math.round(((i + 1) * cw) / 2)
      const sy = Math.round((j * ch) / 4)
      const ey = Math.round(((j + 1) * ch) / 4)
      out.push(coverageOf(data, width, x0 + sx, y0 + sy, ex - sx, ey - sy))
    }
  }
  return out
}

/** Kandydaci posortowani po pokryciu (puste glify odpadają). */
function pickRamp(chars: string[], cw: number, ch: number, family: string, font: FontKey) {
  const probe = document.createElement("canvas")
  probe.width = cw * chars.length
  probe.height = ch
  const ctx = probe.getContext("2d", { willReadFrequently: true })
  if (!ctx) return chars.map((char) => ({ char, cover: 0 }))
  ctx.fillStyle = "#fff"
  chars.forEach((char, i) => drawGlyph(ctx, char, i * cw, 0, cw, ch, family, font))
  const data = ctx.getImageData(0, 0, probe.width, ch).data
  return chars
    .map((char, i) => ({ char, cover: coverageOf(data, probe.width, i * cw, 0, cw, ch) }))
    .filter((item) => item.cover > 0.004)
    .sort((a, b) => a.cover - b.cover)
}

/** `steps` stopni równo rozłożonych po pokryciu. */
function sample<T extends { cover: number }>(sorted: T[], steps: number): T[] {
  if (sorted.length <= steps) return sorted
  const lo = sorted[0]?.cover ?? 0
  const hi = sorted[sorted.length - 1]?.cover ?? 1
  const out: T[] = []
  const used = new Set<number>()
  for (let step = 0; step < steps; step++) {
    const target = lo + ((hi - lo) * step) / (steps - 1)
    let best = -1
    let error = Infinity
    sorted.forEach((item, i) => {
      if (used.has(i)) return
      const e = Math.abs(item.cover - target)
      if (e < error) {
        best = i
        error = e
      }
    })
    if (best >= 0) {
      used.add(best)
      out.push(sorted[best] as T)
    }
  }
  return out.sort((a, b) => a.cover - b.cover)
}

/** Punkty Braille’a jako raster (2 × 4 w środkach pod-komórek) — grubsze niż w kroju. */
function drawDots(ctx: CanvasRenderingContext2D, bits: number, i: number, cw: number, ch: number) {
  const radius = Math.max(0.8, Math.min(cw / 2, ch / 4) * 0.42)
  const x0 = (i % COLUMNS) * cw
  const y0 = Math.floor(i / COLUMNS) * ch
  for (let bit = 0; bit < 8; bit++) {
    if (!(bits & (1 << bit))) continue
    const sub = BRAILLE_ORDER[bit] ?? 0
    ctx.beginPath()
    ctx.arc(
      x0 + ((sub % 2) + 0.5) * (cw / 2),
      y0 + (Math.floor(sub / 2) + 0.5) * (ch / 4),
      radius,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }
}

export function getAtlas(charset: Charset, cw: number, ch: number, families: Families): Atlas {
  const key = `${charset}|${cw}|${ch}`
  const hit = cache.get(key)
  if (hit) return hit
  const spec = CHARSET_SPECS[charset]
  const family = families[spec.font]

  let glyphs: string[]
  if (spec.dither) {
    // Braille: 256 wzorów w kolejności bitów — indeks = maska punktów.
    glyphs = Array.from({ length: 256 }, (_, bits) => String.fromCodePoint(0x2800 + bits))
  } else {
    const sorted = pickRamp(Array.from(spec.candidates), cw, ch, family, spec.font)
    const picked = spec.match ? sorted : sample(sorted, spec.steps)
    glyphs = picked.map((item) => item.char)
  }

  const total = glyphs.length + 4
  const canvas = document.createElement("canvas")
  canvas.width = COLUMNS * cw
  canvas.height = Math.ceil(total / COLUMNS) * ch
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (ctx) {
    ctx.fillStyle = "#fff"
    if (spec.dither) {
      glyphs.forEach((_, bits) => drawDots(ctx, bits, bits, cw, ch))
      // Kierunki z punktów (poziomo, pionowo, „/”, „\”) — ten sam raster co obraz.
      ;[0x12, 0x47, 0x5c, 0xa3].forEach((bits, n) => drawDots(ctx, bits, glyphs.length + n, cw, ch))
    } else {
      glyphs.forEach((char, i) =>
        drawGlyph(
          ctx,
          char,
          (i % COLUMNS) * cw,
          Math.floor(i / COLUMNS) * ch,
          cw,
          ch,
          family,
          spec.font
        )
      )
      Array.from(spec.lines).forEach((char, n) => {
        const i = glyphs.length + n
        drawGlyph(
          ctx,
          char,
          (i % COLUMNS) * cw,
          Math.floor(i / COLUMNS) * ch,
          cw,
          ch,
          families.mono,
          "mono"
        )
      })
    }
  }

  // Kształty mierzone na gotowym atlasie (te same piksele, które trafią na ekran).
  const shapes = new Uint8Array(glyphs.length * 8)
  const read = ctx?.getImageData(0, 0, canvas.width, canvas.height).data
  if (read && spec.match) {
    const raw = glyphs.map((_, i) =>
      shapeOf(read, canvas.width, (i % COLUMNS) * cw, Math.floor(i / COLUMNS) * ch, cw, ch)
    )
    const top = Math.max(0.05, ...raw.flat())
    raw.forEach((shape, i) =>
      shape.forEach((value, k) => {
        // Tekstura: rząd 0 = pod-komórki 0–3, rząd 1 = 4–7 (RGBA).
        const offset = (k < 4 ? i * 4 : (glyphs.length + i) * 4) + (k % 4)
        shapes[offset] = Math.round(Math.min(1, value / top) * 255)
      })
    )
  }

  const atlas: Atlas = {
    canvas,
    cw,
    ch,
    columns: COLUMNS,
    ramp: glyphs.length,
    lines: glyphs.length,
    shapes,
  }
  cache.set(key, atlas)
  return atlas
}

/** Czeka na krój zestawu; bez niego atlas narysowałby znaki zastępcze. */
export async function loadCharsetFont(charset: Charset, families: Families): Promise<void> {
  const spec = CHARSET_SPECS[charset]
  // Cały zestaw: część znaków jest w „Glif Symbols” — ten krój też musi być gotowy.
  const sampleText = spec.font === "braille" ? "⠁⣿" : spec.candidates || "01"
  try {
    await Promise.all([
      document.fonts.load(`16px ${families[spec.font]}`, sampleText),
      document.fonts.load(`16px ${families.mono}`, spec.lines),
    ])
  } catch {
    // brak Font Loading API — rysujemy tym, co jest
  }
}
