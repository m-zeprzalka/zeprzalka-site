/**
 * Kadr startu składany ze znaków sygnetu — tych samych co w logo i w nagłówkach
 * (`GLYPHS`, kroje `font-logo`). Trzy takty jednego przebiegu:
 *
 * 1. **Składanie** — na czarnym papierze pojawiają się znaki, ukośnie od lewego
 *    górnego rogu; każda komórka przez chwilę przeskakuje między losowymi znakami
 *    i staje na znaku o swoim tonie (gęstszy znak tam, gdzie obraz jest jaśniejszy).
 * 2. **Druk** — krótka pauza: kadr stoi jako obraz ze znaków.
 * 3. **Odsłanianie** — ukośny, nieregularny front od lewego dolnego rogu: komórka
 *    miga jasnym znakiem i znika, a pod spodem jest już prawdziwy kadr (wideo).
 *
 * Canvas 2D bez WebGL. Znaki rysujemy raz do atlasu (białe na przezroczystym, w
 * rozdzielczości ekranu), a klatka tylko kopiuje z niego komórki, które właśnie
 * zmieniły stan. Kolejność tonów to zmierzone pokrycie tuszem każdego znaku.
 * Wszystkie parametry są w `GLYPH_REVEAL`.
 */
import { GLYPHS } from "./glyphs"

export const GLYPH_REVEAL = {
  /** Bok komórki w px CSS; na kadrze węższym niż 480 px — `cellNarrow`. */
  cell: 12,
  cellNarrow: 9,
  /** Składanie: w tym czasie (ms) wszystkie komórki dostają znak. */
  build: 800,
  /** Jak długo komórka przeskakuje między znakami, zanim stanie na swoim (ms). */
  morph: 300,
  /** Co ile ms przeskakujący znak zmienia się na inny (ok. 16 kl./s — jak w nagłówkach). */
  tick: 60,
  /** Druk stoi tyle ms, zanim ruszy front. */
  hold: 220,
  /** Czas przejścia frontu przez cały kadr (ms). */
  duration: 1200,
  /** Szerokość migającego pasma frontu (ułamek przebiegu). */
  front: 0.08,
  /** Nieregularność frontu i składania: 0 — prosta linia, 0.3 — postrzępiona. */
  jitter: 0.22,
  /** Krzywa tonów: 1 — liniowo, więcej — ciemniej (więcej pustych i lekkich znaków). */
  contrast: 1.5,
  /** Poniżej tego tonu komórka zostaje pusta — kształt obrazu czyta się z czerni. */
  floor: 0.07,
  /** Tło druku — zawsze czerń, w obu motywach (`--color-print` w globals.css). */
  paper: "#0b0b0b",
} as const

/**
 * Kroje sygnetu z `<html>` (zmienne `next/font`, np. `"symbols", "symbols Fallback"`):
 * `family` — cały napis jak w klasie `font-logo`, `primary` — same kroje sygnetu.
 */
function logoFonts(): { family: string; primary: string[] } {
  const root = getComputedStyle(document.documentElement)
  const values = ["--font-logo-symbols", "--font-logo-math"]
    .map((name) => root.getPropertyValue(name).trim())
    .filter(Boolean)
  return {
    family: values.join(", "),
    primary: values.map((value) => value.split(",")[0]!.trim()),
  }
}

/** Stały „szum” (0–1) — ten sam przy każdej klatce, więc nic nie migocze bez powodu. */
function noise(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

/**
 * Jasność komórek obrazu (0–1), próbkowana do siatki `cols × rows`. Zakres
 * jest rozciągany do pełnej skali i przyciemniany krzywą (`contrast`).
 */
async function sample(image: HTMLImageElement, cols: number, rows: number): Promise<Float32Array> {
  const light = new Float32Array(cols * rows)
  const probe = document.createElement("canvas")
  probe.width = cols
  probe.height = rows
  const context = probe.getContext("2d", { willReadFrequently: true })
  if (!context) return light
  // Dekodowanie i skalowanie do siatki poza głównym wątkiem (gdy przeglądarka to umie);
  // `getImageData` czyta potem kilka tysięcy pikseli zamiast całego plakatu.
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(image, {
      resizeWidth: cols,
      resizeHeight: rows,
      resizeQuality: "medium",
    })
    context.drawImage(bitmap, 0, 0)
    bitmap.close()
  } else {
    context.drawImage(image, 0, 0, cols, rows)
  }
  const { data } = context.getImageData(0, 0, cols, rows)
  let min = 1
  let max = 0
  for (let i = 0; i < light.length; i++) {
    const value =
      (0.2126 * data[i * 4]! + 0.7152 * data[i * 4 + 1]! + 0.0722 * data[i * 4 + 2]!) / 255
    light[i] = value
    min = Math.min(min, value)
    max = Math.max(max, value)
  }
  const range = Math.max(max - min, 0.001)
  for (let i = 0; i < light.length; i++) {
    light[i] = Math.pow((light[i]! - min) / range, GLYPH_REVEAL.contrast)
  }
  return light
}

interface Atlas {
  canvas: HTMLCanvasElement
  /** Bok kafla w pikselach urządzenia. */
  tile: number
  perRow: number
  /** Numery znaków od najlżejszego do najcięższego (znaki bez tuszu — poza listą). */
  byInk: Uint16Array
}

/** Wszystkie znaki sygnetu w jednym obrazie i ich kolejność według pokrycia tuszem. */
function buildAtlas(font: string, tile: number): Atlas | null {
  const perRow = 16
  const canvas = document.createElement("canvas")
  canvas.width = perRow * tile
  canvas.height = Math.ceil(GLYPHS.length / perRow) * tile
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) return null
  context.fillStyle = "#fff"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.font = `${Math.round(tile * 0.84)}px ${font}`
  GLYPHS.forEach((glyph, i) => {
    context.fillText(
      glyph,
      (i % perRow) * tile + tile / 2,
      Math.floor(i / perRow) * tile + tile / 2
    )
  })
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
  const ink = new Float32Array(GLYPHS.length)
  for (let i = 0; i < ink.length; i++) {
    const left = (i % perRow) * tile
    const top = Math.floor(i / perRow) * tile
    let sum = 0
    for (let y = top; y < top + tile; y++) {
      for (let x = left; x < left + tile; x++) sum += data[(y * canvas.width + x) * 4 + 3]!
    }
    ink[i] = sum
  }
  const byInk = Uint16Array.from(ink.keys())
    .filter((i) => ink[i]! > 0)
    .sort((a, b) => ink[a]! - ink[b]!)
  return byInk.length > 8 ? { canvas, tile, perRow, byInk } : null
}

/** Stan komórki — klatka rysuje tylko te, które zmieniły stan albo znak. */
const Cell = { Blank: 0, Morph: 1, Settled: 2, Band: 3, Clear: 4 } as const

export interface GlyphReveal {
  /**
   * Cały przebieg: składanie, druk i front. `onFront` — rusza front (czas puścić
   * wideo pod spodem), `onDone` — kadr w całości odsłonięty.
   */
  play: (handlers: { onFront?: () => void; onDone: () => void }) => void
  stop: () => void
}

/**
 * Przygotowuje druk (kroje, atlas, tony obrazu) i maluje czysty papier. Wymiary
 * kadru podaje wywołujący (np. z `ResizeObserver`) — odczyt `clientWidth` tuż po
 * hydratacji wymuszałby przeliczenie układu. `null` — brak canvasu albo krojów.
 */
export async function createGlyphReveal(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  width: number,
  height: number
): Promise<GlyphReveal | null> {
  const context = canvas.getContext("2d")
  const { family: font, primary } = logoFonts()
  if (!context || !font) return null
  // Atlas rysujemy dopiero z wczytanymi krojami sygnetu (inaczej narysowałby się krój
  // zastępczy). Każdy osobno: krój zastępczy `next/font` to `local("Arial")`, którego
  // na Linuksie i Androidzie nie ma — wspólne `load()` odrzuciłoby się w całości.
  const text = GLYPHS.join("")
  await Promise.all(
    primary.map((name) => document.fonts.load(`16px ${name}`, text).catch(() => []))
  )

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const size = width < 480 ? GLYPH_REVEAL.cellNarrow : GLYPH_REVEAL.cell
  const atlas = buildAtlas(font, Math.ceil(size * dpr))
  if (!atlas) return null
  const cols = Math.ceil(width / size)
  const rows = Math.ceil(height / size)
  const count = cols * rows
  const light = await sample(image, cols, rows)

  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  context.scale(dpr, dpr)
  context.fillStyle = GLYPH_REVEAL.paper
  context.fillRect(0, 0, width, height)

  // Dla każdej komórki: znak tonu, jego krycie, pora pojawienia się i próg frontu.
  const ramp = atlas.byInk
  const heavy = ramp.subarray(Math.floor(ramp.length * 0.75))
  const glyph = new Uint16Array(count)
  const alpha = new Float32Array(count)
  const appear = new Float32Array(count)
  const threshold = new Float32Array(count)
  const { jitter } = GLYPH_REVEAL
  for (let i = 0; i < count; i++) {
    const x = i % cols
    const y = Math.floor(i / cols)
    const tone = light[i]!
    // Sąsiednie znaki rampy mają podobny ton — szum wybiera jeden z nich, żeby
    // równe plamy obrazu nie składały się z jednego powtórzonego znaku.
    const step = Math.round(tone * (ramp.length - 1) + (noise(y, x) - 0.5) * 6)
    glyph[i] = ramp[Math.min(ramp.length - 1, Math.max(0, step))]!
    alpha[i] = tone < GLYPH_REVEAL.floor ? 0 : 0.3 + tone * 0.7
    // Składanie: ukośnie od lewego górnego rogu; front: od lewego dolnego.
    appear[i] = ((x / cols) * 0.5 + (y / rows) * 0.5) * (1 - jitter) + noise(x, y) * jitter
    threshold[i] =
      ((x / cols) * 0.55 + (1 - y / rows) * 0.45) * (1 - jitter) + noise(x + 7, y) * jitter
  }

  const state = new Uint8Array(count).fill(Cell.Blank)
  const lastTick = new Int32Array(count).fill(-1)
  const perRow = atlas.perRow
  const tile = atlas.tile

  const paint = (i: number, glyphIndex: number, opacity: number) => {
    const x = (i % cols) * size
    const y = Math.floor(i / cols) * size
    context.globalAlpha = 1
    context.fillStyle = GLYPH_REVEAL.paper
    context.fillRect(x, y, size, size)
    if (opacity <= 0) return
    context.globalAlpha = opacity
    context.drawImage(
      atlas.canvas,
      (glyphIndex % perRow) * tile,
      Math.floor(glyphIndex / perRow) * tile,
      tile,
      tile,
      x,
      y,
      size,
      size
    )
  }
  /** Losowy, ale powtarzalny znak komórki na dany takt (`tick`). */
  const scramble = (i: number, tick: number, from: Uint16Array) =>
    from[Math.floor(noise(i, tick + 1) * from.length)]!

  let frame = 0

  return {
    play({ onFront, onDone }) {
      const { build, morph, hold, duration, front, tick: tickMs } = GLYPH_REVEAL
      const start = performance.now()
      const frontStart = build + morph + hold
      let frontCalled = false

      const step = (now: number) => {
        const time = now - start
        const frontLinear = Math.max(0, (time - frontStart) / duration)
        // Łagodny start i koniec frontu.
        const progress =
          (frontLinear < 1 ? 0.5 - Math.cos(Math.PI * frontLinear) / 2 : 1) * (1 + front)
        if (!frontCalled && time >= frontStart) {
          frontCalled = true
          onFront?.()
        }

        for (let i = 0; i < count; i++) {
          const current = state[i]!
          if (current === Cell.Clear) continue
          const th = threshold[i]!
          if (time >= frontStart && progress > th) {
            if (progress > th + front) {
              const x = (i % cols) * size
              const y = Math.floor(i / cols) * size
              context.clearRect(x, y, size, size)
              state[i] = Cell.Clear
              continue
            }
            // Pasmo frontu: jasny, ciężki znak przeskakuje, zanim komórka zniknie.
            const tick = Math.floor(time / tickMs)
            if (current !== Cell.Band || lastTick[i] !== tick) {
              paint(i, scramble(i, tick, heavy), 1)
              state[i] = Cell.Band
              lastTick[i] = tick
            }
            continue
          }
          const since = time - appear[i]! * build
          if (since < 0) continue
          if (since < morph) {
            // Składanie: znak przeskakuje między losowymi i nabiera krycia.
            const tick = Math.floor(since / tickMs)
            if (current !== Cell.Morph || lastTick[i] !== tick) {
              const opacity = Math.max(alpha[i]!, 0.22) * (0.4 + (0.6 * since) / morph)
              paint(i, scramble(i, tick, ramp), opacity)
              state[i] = Cell.Morph
              lastTick[i] = tick
            }
          } else if (current !== Cell.Settled) {
            paint(i, glyph[i]!, alpha[i]!)
            state[i] = Cell.Settled
          }
        }

        if (frontLinear < 1) frame = requestAnimationFrame(step)
        else onDone()
      }
      frame = requestAnimationFrame(step)
    },
    stop() {
      cancelAnimationFrame(frame)
    },
  }
}
