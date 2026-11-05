/**
 * Atlas glifów: wszystkie znaki zestawu narysowane raz, w jednym rzędzie, w kolorze
 * tuszu i w rozdzielczości ekranu. Klatka pola to potem wyłącznie `drawImage`
 * wycinków atlasu — koszt nie zależy od kroju ani od liczby znaków.
 * (Wzór: `glif/atlas.ts`; tu zestaw znaków i krój są parametrami — kropki rysuje
 * „Glif Symbols”, cyfry Geist Mono.)
 */
export interface Atlas {
  image: HTMLCanvasElement
  /** Znaki atlasu — indeks = pozycja wycinka. */
  chars: readonly string[]
  /** Szerokość i wysokość komórki w pikselach urządzenia (całkowite — bez szwów). */
  cw: number
  ch: number
}

/** Glif w krojach mono zajmuje 0,602 em — tyle samo co komórka, więc rząd jest ciągły. */
export const ADVANCE = 0.602

export function buildAtlas(
  chars: readonly string[],
  family: string,
  cellWidth: number,
  cellHeight: number,
  dpr: number,
  color: string,
  /** Krój mniejszy niż komórka (cyfry są wyższe niż kropki). */
  scale = 1
): Atlas {
  const cw = Math.max(1, Math.round(cellWidth * dpr))
  const ch = Math.max(1, Math.round(cellHeight * dpr))
  const image = document.createElement("canvas")
  image.width = cw * chars.length
  image.height = ch
  const ctx = image.getContext("2d")
  if (!ctx) return { image, chars, cw, ch }

  ctx.font = `${((cw / ADVANCE) * scale).toFixed(2)}px ${family}`
  ctx.fillStyle = color
  ctx.textAlign = "center"
  ctx.textBaseline = "alphabetic"
  chars.forEach((char, index) => {
    // Każdy znak wyśrodkowany optycznie w pionie (kropka i cyfra siedzą na tej samej osi).
    const metrics = ctx.measureText(char)
    const baseline =
      ch / 2 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2
    ctx.fillText(char, index * cw + cw / 2, baseline)
  })
  return { image, chars, cw, ch }
}

/** Kolor z CSS (zapisany szesnastkowo — canvas nie musi znać oklch). */
export function readInk(element: Element, property: string, fallback = "#171717"): string {
  return getComputedStyle(element).getPropertyValue(property).trim() || fallback
}

/** Rodzina kroju z zmiennej CSS (`--font-geist-mono` z `next/font`) — do `ctx.font`. */
export function readFamily(property: string, fallback = "monospace"): string {
  return getComputedStyle(document.documentElement).getPropertyValue(property).trim() || fallback
}

/** Czeka na krój; bez niego atlas narysowałby znaki zastępcze. */
export async function loadFont(family: string, chars: readonly string[], px = 16): Promise<void> {
  try {
    await document.fonts.load(`${px}px ${family}`, chars.join(""))
  } catch {
    // Brak Font Loading API — rysujemy tym, co jest.
  }
}
