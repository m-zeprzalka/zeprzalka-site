/**
 * Atlas glifów: wszystkie znaki alfabetu narysowane raz, w jednym rzędzie,
 * w rozdzielczości ekranu. Klatka odkodowania to potem wyłącznie `drawImage`
 * wycinków — koszt nie zależy od kroju ani od liczby znaków. Atlas jest biały:
 * kolor nadaje mu dopiero obraz (`source-in` w `print.ts`).
 */
export interface Atlas {
  image: HTMLCanvasElement
  /** Komórka w pikselach urządzenia (liczby całkowite — bez szwów między komórkami). */
  cw: number
  ch: number
  glyphs: readonly string[]
  /** Pokrycie tuszem każdego glifu (0–1) — do rampy gęstości. */
  coverage: readonly number[]
}

/** Glif w krojach mono zajmuje 0,6 em szerokości — tyle samo co komórka. */
export const ADVANCE = 0.6

const cache = new Map<string, Atlas>()

export function getAtlas(
  family: string,
  glyphs: readonly string[],
  cellWidth: number,
  dpr: number
): Atlas {
  const key = `${family}|${glyphs.join("")}|${cellWidth.toFixed(2)}|${dpr}`
  const hit = cache.get(key)
  if (hit) return hit

  const cw = Math.max(2, Math.round(cellWidth * dpr))
  const ch = Math.max(2, Math.round((cellWidth / ADVANCE) * 0.92 * dpr))
  const image = document.createElement("canvas")
  image.width = cw * glyphs.length
  image.height = ch
  const ctx = image.getContext("2d", { willReadFrequently: true })
  const atlas: Atlas = { image, cw, ch, glyphs, coverage: [] }
  if (!ctx) return atlas

  ctx.font = `${(cw / ADVANCE).toFixed(2)}px ${family}`
  ctx.fillStyle = "#fff"
  ctx.textAlign = "center"
  ctx.textBaseline = "alphabetic"
  glyphs.forEach((glyph, index) => {
    // Każdy znak wyśrodkowany optycznie w pionie (kropka i koło siedzą na tej samej osi).
    const metrics = ctx.measureText(glyph)
    const baseline =
      ch / 2 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2
    ctx.fillText(glyph, index * cw + cw / 2, baseline)
  })

  const data = ctx.getImageData(0, 0, image.width, ch).data
  atlas.coverage = glyphs.map((_, glyph) => {
    let sum = 0
    for (let y = 0; y < ch; y++) {
      const row = (y * image.width + glyph * cw) * 4 + 3
      for (let x = 0; x < cw; x++) sum += data[row + x * 4] ?? 0
    }
    return sum / (cw * ch * 255)
  })
  cache.set(key, atlas)
  return atlas
}

/** Czeka na krój; bez niego atlas narysowałby znaki zastępcze. */
export async function loadFont(family: string, sample: string): Promise<void> {
  try {
    await document.fonts.load(`16px ${family}`, sample)
  } catch {
    // Brak Font Loading API — rysujemy tym, co jest.
  }
}
