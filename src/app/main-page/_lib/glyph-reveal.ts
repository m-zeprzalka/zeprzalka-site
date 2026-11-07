/**
 * Odsłanianie obrazu ze znaków (wzór: karty portfolio z `/demo/glif`):
 * kadr zaczyna jako druk z kropek i kół — jasnych na czerni, gęstszych tam,
 * gdzie obraz jest jaśniejszy — a potem ukośny, nieregularny front zamienia
 * komórkę po komórce w prawdziwy obraz pod spodem (canvas staje się przezroczysty).
 *
 * Canvas 2D, bez krojów i bez WebGL. Wszystkie parametry są w `GLYPH_REVEAL`.
 */

export const GLYPH_REVEAL = {
  /** Bok komórki w px CSS (na wąskim ekranie mniejszy — patrz `cellFor`). */
  cell: 11,
  /** Ile trwa sam druk, zanim ruszy front (ms) — krótko: dłuższy martwy kadr wygląda jak ładowanie. */
  hold: 250,
  /** Czas przejścia frontu przez cały kadr (ms). */
  duration: 1300,
  /** Szerokość jasnego pasma frontu (ułamek przebiegu). */
  front: 0.07,
  /** Nieregularność frontu: 0 — prosta linia, 0.3 — postrzępiona. */
  jitter: 0.22,
  /** Krzywa tonów druku: 1 — liniowo, więcej — ciemniej (więcej kropek, mniej pełnych kół). */
  contrast: 1.8,
  /** Tło i kolor druku — szkielet jest zawsze jasny na czerni, w obu motywach (`--color-print`). */
  paper: "#0b0b0b",
  ink: "255, 255, 255",
} as const

/** Na kadrze węższym niż 480 px oczko 8 px — to samo co szkielet w CSS (`@max-[30rem]`). */
export function cellFor(width: number) {
  return width < 480 ? 8 : GLYPH_REVEAL.cell
}

/** Stały „szum” komórki (0–1) — ten sam przy każdej klatce, więc front nie migocze. */
function noise(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

/**
 * Jasność komórek obrazu (0–1), próbkowana do siatki `cols × rows`. Zakres
 * jest rozciągany do pełnej skali i przyciemniany krzywą (`contrast`) — jasny
 * kadr nie drukuje się jako jednolita ściana pełnych kół.
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

/** Jeden znak druku: od pustego, przez kropkę i pierścień, po pełne koło. */
function drawGlyph(
  context: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  light: number
) {
  if (light < 0.08) return
  context.fillStyle = context.strokeStyle = `rgba(${GLYPH_REVEAL.ink}, ${0.28 + light * 0.72})`
  context.beginPath()
  if (light < 0.45) {
    context.arc(cx, cy, size * (0.1 + light * 0.22), 0, Math.PI * 2)
    context.fill()
  } else if (light < 0.7) {
    context.lineWidth = Math.max(1, size * 0.1)
    context.arc(cx, cy, size * 0.3, 0, Math.PI * 2)
    context.stroke()
  } else {
    context.arc(cx, cy, size * (0.26 + light * 0.16), 0, Math.PI * 2)
    context.fill()
  }
}

export interface GlyphReveal {
  /** Uruchamia front; `onDone` — kadr w całości odsłonięty. */
  play: (onDone: () => void) => void
  stop: () => void
}

/**
 * Rysuje druk i zwraca sterowanie frontem. Wymiary kadru podaje wywołujący (np. z
 * `ResizeObserver`) — odczyt `clientWidth` tuż po hydratacji wymuszałby przeliczenie układu.
 */
export async function createGlyphReveal(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  width: number,
  height: number
): Promise<GlyphReveal | null> {
  const context = canvas.getContext("2d")
  if (!context) return null

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  context.scale(dpr, dpr)

  const size = cellFor(width)
  const cols = Math.ceil(width / size)
  const rows = Math.ceil(height / size)
  const light = await sample(image, cols, rows)
  // Próg komórki: ukośnie od lewego dolnego rogu, z nieregularnym brzegiem.
  const threshold = new Float32Array(cols * rows)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const diagonal = (x / cols) * 0.55 + (1 - y / rows) * 0.45
      threshold[y * cols + x] =
        diagonal * (1 - GLYPH_REVEAL.jitter) + noise(x, y) * GLYPH_REVEAL.jitter
    }
  }

  // Druk rysujemy raz, w całości.
  context.fillStyle = GLYPH_REVEAL.paper
  context.fillRect(0, 0, width, height)
  for (let i = 0; i < threshold.length; i++) {
    const x = (i % cols) * size
    const y = Math.floor(i / cols) * size
    drawGlyph(context, x + size / 2, y + size / 2, size, light[i]!)
  }

  // Front idzie tylko naprzód, więc komórki ułożone według progu zmieniają
  // stan po kolei: druk → pasmo → odsłonięta. Klatka rysuje wyłącznie te,
  // które właśnie przeszły dalej — zamiast całej siatki od nowa.
  const order = Uint32Array.from(threshold.keys()).sort((a, b) => threshold[a]! - threshold[b]!)
  let banded = 0
  let revealed = 0
  const advance = (progress: number) => {
    const cleared = progress - GLYPH_REVEAL.front
    for (; banded < order.length && threshold[order[banded]!]! < progress; banded++) {
      const i = order[banded]!
      if (threshold[i]! < cleared) continue // przeskoczyła pasmo w jednej klatce
      const x = (i % cols) * size
      const y = Math.floor(i / cols) * size
      // Pasmo frontu: komórka błyska jasno, zanim zniknie.
      context.clearRect(x, y, size, size)
      context.fillStyle = `rgba(${GLYPH_REVEAL.ink}, ${0.2 + light[i]! * 0.6})`
      context.fillRect(x, y, size, size)
    }
    for (; revealed < banded && threshold[order[revealed]!]! < cleared; revealed++) {
      const i = order[revealed]!
      // Odsłonięta — widać obraz pod spodem.
      context.clearRect((i % cols) * size, Math.floor(i / cols) * size, size, size)
    }
  }

  let frame = 0

  return {
    play(onDone) {
      const start = performance.now() + GLYPH_REVEAL.hold
      const end = 1 + GLYPH_REVEAL.front
      const tick = (now: number) => {
        const linear = Math.max(0, (now - start) / GLYPH_REVEAL.duration)
        // Łagodny start i koniec frontu.
        const eased = linear < 1 ? 0.5 - Math.cos(Math.PI * linear) / 2 : 1
        advance(eased * end)
        if (linear < 1) frame = requestAnimationFrame(tick)
        else onDone()
      }
      frame = requestAnimationFrame(tick)
    },
    stop() {
      cancelAnimationFrame(frame)
    },
  }
}
