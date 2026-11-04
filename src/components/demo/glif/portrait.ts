/**
 * Źródło portretu: luminancja `avatar.png` (portret ASCII 300×300) liczona raz,
 * plus maska tła. Tło to jasne piksele połączone z krawędzią obrazu — szukane
 * na wersji pomniejszonej 4×, żeby jasne szczeliny między znakami wewnątrz
 * twarzy nie „wyciekły” do tła.
 */
export interface Portrait {
  width: number
  height: number
  /** Luminancja 0–1, wiersz po wierszu. */
  lum: Float32Array
  /** `true` = piksel twarzy (pomniejszona maska, krok `maskStep`). */
  face: Uint8Array
  maskStep: number
  maskWidth: number
  /** Prostokąt twarzy w pikselach obrazu. */
  box: { x: number; y: number; w: number; h: number }
}

const MASK_STEP = 4
const BACKGROUND = 0.9

function luminance(data: Uint8ClampedArray, count: number): Float32Array {
  const lum = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const r = data[i * 4] ?? 255
    const g = data[i * 4 + 1] ?? 255
    const b = data[i * 4 + 2] ?? 255
    lum[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  }
  return lum
}

function pixels(image: HTMLImageElement, width: number, height: number): Float32Array | null {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return null
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(image, 0, 0, width, height)
  return luminance(ctx.getImageData(0, 0, width, height).data, width * height)
}

/** Zalewanie tła od krawędzi: wszystko, co jasne i połączone z brzegiem, to nie twarz. */
function faceMask(small: Float32Array, width: number, height: number): Uint8Array {
  const face = new Uint8Array(width * height).fill(1)
  const stack: number[] = []
  for (let x = 0; x < width; x++) stack.push(x, x + (height - 1) * width)
  for (let y = 0; y < height; y++) stack.push(y * width, y * width + width - 1)
  while (stack.length) {
    const i = stack.pop() as number
    if (face[i] === 0 || (small[i] ?? 0) < BACKGROUND) continue
    face[i] = 0
    const x = i % width
    if (x > 0) stack.push(i - 1)
    if (x < width - 1) stack.push(i + 1)
    if (i >= width) stack.push(i - width)
    if (i < width * (height - 1)) stack.push(i + width)
  }
  return face
}

export async function loadPortrait(src: string): Promise<Portrait | null> {
  const image = new Image()
  image.src = src
  try {
    await image.decode()
  } catch {
    return null
  }
  const width = image.naturalWidth
  const height = image.naturalHeight
  const maskWidth = Math.ceil(width / MASK_STEP)
  const maskHeight = Math.ceil(height / MASK_STEP)
  const lum = pixels(image, width, height)
  const small = pixels(image, maskWidth, maskHeight)
  if (!lum || !small) return null

  const face = faceMask(small, maskWidth, maskHeight)
  let minX = maskWidth
  let minY = maskHeight
  let maxX = 0
  let maxY = 0
  face.forEach((value, i) => {
    if (!value) return
    const x = i % maskWidth
    const y = Math.floor(i / maskWidth)
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  })
  if (maxX < minX) return null

  return {
    width,
    height,
    lum,
    face,
    maskStep: MASK_STEP,
    maskWidth,
    box: {
      x: minX * MASK_STEP,
      y: minY * MASK_STEP,
      w: (maxX - minX + 1) * MASK_STEP,
      h: (maxY - minY + 1) * MASK_STEP,
    },
  }
}

/** Średnia luminancja prostokąta obrazu (filtr pudełkowy); poza obrazem — biel. */
export function sampleBox(p: Portrait, x0: number, y0: number, x1: number, y1: number): number {
  const ax = Math.max(0, Math.floor(x0))
  const ay = Math.max(0, Math.floor(y0))
  const bx = Math.min(p.width, Math.ceil(x1))
  const by = Math.min(p.height, Math.ceil(y1))
  if (bx <= ax || by <= ay) return 1
  let sum = 0
  for (let y = ay; y < by; y++) {
    for (let x = ax; x < bx; x++) sum += p.lum[y * p.width + x] ?? 1
  }
  return sum / ((bx - ax) * (by - ay))
}

export function isFace(p: Portrait, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= p.width || y >= p.height) return false
  const mx = Math.floor(x / p.maskStep)
  const my = Math.floor(y / p.maskStep)
  return p.face[my * p.maskWidth + mx] === 1
}
