import { GLYPHS } from "./alphabet"

/**
 * Atlas glifów: wszystkie znaki alfabetu narysowane raz, w jednym rzędzie,
 * w kolorze tuszu i w rozdzielczości ekranu. Klatka pola to potem wyłącznie
 * `drawImage` wycinków atlasu — koszt nie zależy od czcionki ani od liczby znaków.
 */
export interface Atlas {
  image: HTMLCanvasElement
  /** Szerokość i wysokość komórki w pikselach urządzenia (liczby całkowite — bez szwów). */
  cw: number
  ch: number
}

/** Glif w krojach mono zajmuje 0,602 em — tyle samo co komórka, więc rząd jest ciągły. */
export const ADVANCE = 0.602

export function buildAtlas(
  family: string,
  cellWidth: number,
  cellHeight: number,
  dpr: number,
  color: string
): Atlas {
  const cw = Math.max(1, Math.round(cellWidth * dpr))
  const ch = Math.max(1, Math.round(cellHeight * dpr))
  const image = document.createElement("canvas")
  image.width = cw * GLYPHS.length
  image.height = ch
  const ctx = image.getContext("2d")
  if (!ctx) return { image, cw, ch }

  ctx.font = `${(cw / ADVANCE).toFixed(2)}px ${family}`
  ctx.fillStyle = color
  ctx.textAlign = "center"
  ctx.textBaseline = "alphabetic"
  GLYPHS.forEach((glyph, index) => {
    // Każdy znak wyśrodkowany optycznie w pionie (kropka i ramka siedzą na tej samej osi).
    const metrics = ctx.measureText(glyph)
    const baseline =
      ch / 2 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2
    ctx.fillText(glyph, index * cw + cw / 2, baseline)
  })
  return { image, cw, ch }
}

/** Kolor tuszu z CSS (`--gl-glyph-ink`, zapisany szesnastkowo — canvas nie musi znać oklch). */
export function readInk(element: Element, property = "--gl-glyph-ink"): string {
  return getComputedStyle(element).getPropertyValue(property).trim() || "#171717"
}

/** Czeka na krój glifów; bez niego atlas narysowałby znaki zastępcze. */
export async function loadGlyphFont(family: string, px = 16): Promise<void> {
  try {
    await document.fonts.load(`${px}px ${family}`, GLYPHS.join(""))
  } catch {
    // Brak Font Loading API — rysujemy tym, co jest.
  }
}
