"use client"

/**
 * Atlas znaków dla shadera: wszystkie glify w jednym rzędzie, białe na
 * przezroczystym, w rozdzielczości urządzenia (komórka 1:1 z komórką siatki —
 * bez rozmycia przy próbkowaniu). Krój: Geist Mono (ma polskie znaki), więc
 * portret z liter biogramu nie pokaże pustych prostokątów.
 */
export interface Atlas {
  canvas: HTMLCanvasElement
  glyphs: string[]
  cw: number
  ch: number
}

/** Rodzina kroju mono z `next/font` (zmienna CSS na `<html>`). */
export function monoFamily(): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-geist-mono")
    .trim()
  return value || "ui-monospace, monospace"
}

export async function loadMono(chars: string): Promise<void> {
  try {
    await document.fonts.load(`16px ${monoFamily()}`, chars)
  } catch {
    // Brak Font Loading API — rysujemy tym, co jest.
  }
}

export function buildAtlas(glyphs: string[], cw: number, ch: number): Atlas {
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, cw * glyphs.length)
  canvas.height = Math.max(1, ch)
  const ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.fillStyle = "#fff"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    // Glif mono ma 0,6 em szerokości — rozmiar tak, by znak wypełniał komórkę bez nachodzenia.
    const size = Math.min(ch * 0.82, cw / 0.62)
    ctx.font = `500 ${size.toFixed(2)}px ${monoFamily()}`
    glyphs.forEach((glyph, index) => {
      ctx.fillText(glyph, index * cw + cw / 2, ch / 2 + size * 0.04)
    })
  }
  return { canvas, glyphs, cw, ch }
}
