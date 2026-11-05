import { CODE_GLYPHS, PRINT_GLYPHS } from "./alphabet"
import { buildAtlas, type Atlas } from "./atlas"
import { measureRamp } from "./print"

/*
 * Scena glifów w kontakcie: ciemny panel, w nim portret złożony z kropek
 * (nowe źródło: `shared/portrait/portrait-luma-soft.webp` — podniesione cienie,
 * maska w alfie, więc oczodoły nie zapadają się w czerń) i koło kodu, które
 * idzie za kursorem: pod nim obraz zamienia się w strumień cyfr binarnych
 * spadających kolumnami jak w Matriksie. Twarz pod kołem nadal jest twarzą —
 * jasność cyfr niesie ton portretu.
 *
 * Dwa słowniki znaków, każdy z jednym zadaniem: kropki = obraz, cyfry = kod.
 * Koszt klatki: przerysowanie wyłącznie prostokąta koła (≈ 600 komórek) plus
 * pojedyncze komórki migotania; cały panel rysuje się raz (i przy wejściu).
 * Czysty moduł canvasu bez Reacta — opakowanie podaje rozmiar, układ, ruch,
 * widoczność i wskaźnik.
 */

export interface PortraitSource {
  width: number
  height: number
  /** Jasność 0–1 i krycie 0–1, wiersz po wierszu. */
  luma: Float32Array
  alpha: Float32Array
}

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** Promień koła (px) i stała czasowa podążania za wskaźnikiem (ms). */
const RADIUS = { fine: 116, coarse: 88 }
const FOLLOW_TAU = 90
/** Ułożenie portretu z szumu przy pierwszym wejściu (ms). */
const INTRO_MS = 1400
/** Migotanie spoczynku: co ile ms i jaki ułamek komórek. */
const FLICKER_MS = 130
const FLICKER_SHARE = 0.004
const BREATH_MS = 420
/** Dryf koła bez wskaźnika: okresy (ms) i amplituda względem twarzy. */
const DRIFT = { tx: 9300, ty: 6100, ax: 0.3, ay: 0.24 }
/** Po zejściu wskaźnika koło wraca do dryfu po tej chwili (ms). */
const RESUME_MS = 1400

/** Wysokość wiersza względem szerokości komórki. */
const ROW = 1.25
/** Wyostrzenie rysów na siatce komórek (maska nieostra 3 × 3). */
const SHARPEN = 0.8

/** Kadr źródła (ułamki): głowa i ramiona bez dołu kurtki — więcej komórek na rysy twarzy. */
const CROP = { x: 0.05, y: 0, w: 0.9, h: 0.8 }
/**
 * Wąski panel (telefon): ciaśniejszy kadr — sama głowa i kołnierz — i mniejsza
 * komórka, żeby na twarz przypadało 60+ kolumn; przy grubszej siatce oczy i usta
 * zlewały się w plamę.
 */
const NARROW = { below: 520, columns: 84, minCell: 4.25 }
/** Pojawianie się i gaśnięcie koła (stała czasowa, ms) — po zjechaniu kursora znika w ok. 400 ms. */
const FADE_TAU = 110
const CROP_NARROW = { x: 0.1, y: 0.02, w: 0.8, h: 0.7 }

const BG_SHARE = 0.2
const BG_ALPHA = 0.11
const FACE_ALPHA = 0.94

function hash(a: number, b: number, c: number): number {
  let h = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

export class GlyphStage {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D | null
  private readonly families: { glyph: string; mono: string }
  private readonly coarse: boolean
  private portrait: PortraitSource | null = null
  private dots: Atlas | null = null
  private code: Atlas | null = null
  /** Kod w kole: cyfry w komórkach 2 × 2 — wyraźne, „przybliżone” znaki zamiast drobnicy. */
  private bigCode: Atlas | null = null
  private ramp: number[] = []
  private ink = "#f2f2f2"

  private width = 0
  private height = 0
  private dpr = 1
  private cols = 0
  private rows = 0
  private cw = 0
  private ch = 0
  private face: Rect = { x: 0, y: 0, w: 0, h: 0 }
  private quiet: Rect[] = []

  /** Glif kropek (indeks atlasu) albo −1; −2 = znak kodu w tle. */
  private base = new Int16Array(0)
  private codeChar = new Int16Array(0)
  private density = new Float32Array(0)
  private dim = new Float32Array(0)
  private due = new Float32Array(0)
  private shown = new Int16Array(0)
  /** Kolumny deszczu: prędkość (komórki/s), faza, długość śladu. */
  private speed = new Float32Array(0)
  private phase = new Float32Array(0)
  private trail = new Float32Array(0)

  private auto = true
  private reduced = false
  private visible = false
  private hidden = false
  private introStart = -1
  private introDone = false
  private frame = 0
  private last = 0
  private lastFlicker = 0
  private clock = 0
  private pointer: { x: number; y: number } | null = null
  private resumeAt = 0
  private lens = { x: 0, y: 0 }
  /** Siła koła 0–1: rośnie, gdy jest wskaźnik albo dryf, gaśnie po zjechaniu i przy „ogranicz ruch”. */
  private intensity = 0
  private lastBox: [number, number, number, number] | null = null
  /** Komórki twarzy chwilowo o stopień jaśniejsze/ciemniejsze — wracają po `BREATH_MS`. */
  private breathing: { i: number; at: number }[] = []

  constructor(canvas: HTMLCanvasElement, families: { glyph: string; mono: string }) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.families = families
    this.coarse = window.matchMedia("(pointer: coarse)").matches
  }

  setPortrait(portrait: PortraitSource) {
    this.portrait = portrait
    this.rebuild()
  }

  /** Rozmiar panelu, prostokąt twarzy i prostokąty tekstu (tam glify przygasają). */
  layout(width: number, height: number, dpr: number, face: Rect, quiet: Rect[]) {
    this.width = width
    this.height = height
    this.dpr = dpr
    this.face = face
    this.quiet = quiet
    this.rebuild()
  }

  setMotion(auto: boolean, reduced: boolean) {
    this.auto = auto
    this.reduced = reduced
    // „Ogranicz ruch”: sama twarz, bez koła (żadnego bloku cyfr w spoczynku).
    if (reduced) {
      this.introDone = true
      this.pointer = null
      this.intensity = 0
    }
    this.drawAll()
    this.wake()
  }

  setVisible(visible: boolean) {
    this.visible = visible
    if (visible && this.introStart < 0 && !this.introDone && this.base.length) {
      this.introStart = performance.now()
    }
    this.wake()
  }

  setHidden(hidden: boolean) {
    this.hidden = hidden
    this.wake()
  }

  pointerMove(x: number, y: number) {
    this.pointer = this.clamp({ x, y })
    // Koło, którego nie widać, pojawia się pod kursorem — nie przyjeżdża z poprzedniego miejsca.
    if (this.intensity < 0.05) this.lens = { ...this.pointer }
    this.wake()
  }

  pointerLeave() {
    this.pointer = null
    this.resumeAt = performance.now() + RESUME_MS
    this.wake()
  }

  destroy() {
    cancelAnimationFrame(this.frame)
    this.frame = 0
  }

  /* ——— układ ——— */

  private get radius() {
    return Math.min(this.coarse ? RADIUS.coarse : RADIUS.fine, this.face.w * 0.42 || 999)
  }

  private rebuild() {
    if (!this.portrait || !this.width || !this.height || !this.ctx) return
    // Komórka ok. 70 kolumn na szerokość twarzy, wiersz 1,25 szerokości (nie 1,6 jak w tekście):
    // dwa razy więcej wierszy niż w „Glifie” — oczy, nos i usta mają z czego się złożyć.
    const cellW =
      this.width < NARROW.below
        ? Math.max(NARROW.minCell, this.face.w / NARROW.columns)
        : Math.min(6.5, Math.max(5.5, this.face.w / 72))
    const cellH = cellW * ROW
    this.dots = buildAtlas(PRINT_GLYPHS, this.families.glyph, cellW, cellH, this.dpr, this.ink)
    this.code = buildAtlas(CODE_GLYPHS, this.families.mono, cellW, cellH, this.dpr, "#ffffff", 0.86)
    this.bigCode = buildAtlas(
      CODE_GLYPHS,
      this.families.mono,
      cellW * 2,
      cellH * 2,
      this.dpr,
      "#ffffff",
      0.84
    )
    this.ramp = measureRamp(this.dots)
    this.cw = this.dots.cw
    this.ch = this.dots.ch
    this.canvas.width = Math.round(this.width * this.dpr)
    this.canvas.height = Math.round(this.height * this.dpr)
    this.cols = Math.ceil(this.canvas.width / this.cw)
    this.rows = Math.ceil(this.canvas.height / this.ch)
    const count = this.cols * this.rows
    this.base = new Int16Array(count).fill(-1)
    this.codeChar = new Int16Array(count)
    this.density = new Float32Array(count)
    this.dim = new Float32Array(count).fill(1)
    this.due = new Float32Array(count)
    this.shown = new Int16Array(count).fill(-3)
    // Deszcz liczony na kolumnach komórek 2 × 2 (tak rysuje się kod w kole).
    const bigCols = Math.ceil(this.cols / 2)
    this.speed = new Float32Array(bigCols)
    this.phase = new Float32Array(bigCols)
    this.trail = new Float32Array(bigCols)
    for (let c = 0; c < bigCols; c++) {
      this.speed[c] = 3.5 + hash(c, 1, 7) * 6
      this.phase[c] = hash(c, 2, 9) * (this.rows / 2 + 12)
      this.trail[c] = 3 + hash(c, 3, 5) * 6
    }
    this.lastBox = null
    this.map()
    if (!this.lens.x && !this.lens.y) this.lens = this.restPoint()
    this.drawAll()
    if (this.visible) this.setVisible(true)
  }

  /** Portret → komórki: próbka pudełkowa, rozciągnięcie kontrastu, rampa 10 stopni. */
  private map() {
    const p = this.portrait as PortraitSource
    const cellW = this.cw / this.dpr
    const cellH = this.ch / this.dpr
    const { x: fx, y: fy, w: fw, h: fh } = this.face
    // Kadr źródła wpisany w prostokąt twarzy jak `object-fit: cover`, przyklejony do góry.
    const crop = this.width < NARROW.below ? CROP_NARROW : CROP
    const sw = p.width * crop.w
    const sh = p.height * crop.h
    const scale = Math.max(fw / sw, fh / sh)
    const ox = fx + (fw - sw * scale) / 2 - p.width * crop.x * scale
    const oy = fy - p.height * crop.y * scale
    const centerX = fx + fw / 2
    const centerY = fy + fh * 0.34
    const reach = Math.hypot(this.width, this.height)

    const raw = new Float32Array(this.base.length).fill(-1)
    const values: number[] = []
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const i = row * this.cols + col
        const cx = (col + 0.5) * cellW
        const cy = (row + 0.5) * cellH
        // Komórki pod tekstem przygasają — portret i kod nie walczą z czytaniem.
        for (const q of this.quiet) {
          if (cx >= q.x - 6 && cx <= q.x + q.w + 6 && cy >= q.y - 4 && cy <= q.y + q.h + 4) {
            this.dim[i] = 0.28
            break
          }
        }
        const u0 = (cx - cellW / 2 - ox) / scale
        const v0 = (cy - cellH / 2 - oy) / scale
        const sample = this.sample(p, u0, v0, u0 + cellW / scale, v0 + cellH / scale)
        if (sample && sample[1] > 0.5) {
          raw[i] = sample[0]
          values.push(sample[0])
        }
        this.codeChar[i] = Math.floor(hash(col, row, 11) * CODE_GLYPHS.length)
        this.due[i] =
          120 + (Math.hypot(cx - centerX, cy - centerY) / reach) * 1100 + hash(col, row, 3) * 360
      }
    }
    // Wyostrzenie: ton komórki odsunięty od średniej sąsiadów (tylko komórki twarzy).
    const sharp = new Float32Array(raw.length).fill(-1)
    values.length = 0
    for (let i = 0; i < raw.length; i++) {
      const value = raw[i] ?? -1
      if (value < 0) continue
      const col = i % this.cols
      let sum = 0
      let n = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const c = col + dx
          const j = i + dy * this.cols + dx
          if (c < 0 || c >= this.cols || j < 0 || j >= raw.length) continue
          const neighbour = raw[j] ?? -1
          if (neighbour < 0) continue
          sum += neighbour
          n++
        }
      }
      sharp[i] = value + SHARPEN * (value - sum / n)
      values.push(sharp[i] ?? 0)
    }
    // Ton: pół na pół rozciągnięcie kontrastu (3–97 percentyl) i wyrównanie histogramu
    // (ranga tonu) — skóra, włosy i rysy dostają równo rozłożone stopnie rampy,
    // a oczy i brwi nie toną w jasnej masie.
    values.sort((a, b) => a - b)
    const lo = values[Math.floor(values.length * 0.03)] ?? 0
    const hi = values[Math.floor(values.length * 0.97)] ?? 1
    const span = Math.max(0.05, hi - lo)
    const rank = (value: number) => {
      let a = 0
      let b = values.length
      while (a < b) {
        const mid = (a + b) >> 1
        if ((values[mid] ?? 0) < value) a = mid + 1
        else b = mid
      }
      return values.length > 1 ? a / (values.length - 1) : 0
    }
    raw.set(sharp)
    for (let i = 0; i < raw.length; i++) {
      const value = raw[i] ?? -1
      if (value >= 0) {
        // Ciemny panel: pozytyw — jasna skóra gęsto, ciemne włosy i kurtka rzadko.
        const linear = Math.min(1, Math.max(0, (value - lo) / span))
        const light = 0.5 * linear + 0.5 * rank(value)
        this.density[i] = light
        const level =
          light < 0.06 ? 0 : Math.min(this.ramp.length, 1 + Math.floor(light * this.ramp.length))
        this.base[i] = level ? (this.ramp[level - 1] ?? -1) : -1
      } else {
        this.density[i] = 0
        this.base[i] = hash(i, 5, 1) < BG_SHARE ? -2 : -1
      }
    }
  }

  /** Średnia jasność i krycie prostokąta portretu; poza obrazem — brak. */
  private sample(p: PortraitSource, x0: number, y0: number, x1: number, y1: number) {
    const ax = Math.max(0, Math.floor(x0))
    const ay = Math.max(0, Math.floor(y0))
    const bx = Math.min(p.width, Math.ceil(x1))
    const by = Math.min(p.height, Math.ceil(y1))
    if (bx <= ax || by <= ay) return null
    let luma = 0
    let alpha = 0
    let n = 0
    for (let y = ay; y < by; y++) {
      for (let x = ax; x < bx; x++) {
        const k = y * p.width + x
        const a = p.alpha[k] ?? 0
        luma += (p.luma[k] ?? 0) * a
        alpha += a
        n++
      }
    }
    if (!n) return null
    return [alpha > 0 ? luma / alpha : 0, alpha / n] as const
  }

  /** Środek dryfu koła: twarz. */
  private restPoint() {
    return { x: this.face.x + this.face.w * 0.48, y: this.face.y + this.face.h * 0.42 }
  }

  /** Koło zawsze w całości w panelu — krawędź karty nigdy nie tnie go prostą linią. */
  private clamp(point: { x: number; y: number }) {
    const margin = this.radius + 2
    return {
      x: Math.min(this.width - margin, Math.max(margin, point.x)),
      y: Math.min(this.height - margin, Math.max(margin, point.y)),
    }
  }

  /* ——— rysowanie ——— */

  private drawGlyph(atlas: Atlas, glyph: number, i: number, alpha: number) {
    const ctx = this.ctx
    if (!ctx || glyph < 0 || alpha <= 0.01) return
    const x = (i % this.cols) * this.cw
    const y = Math.floor(i / this.cols) * this.ch
    ctx.globalAlpha = Math.min(1, alpha)
    ctx.drawImage(atlas.image, glyph * this.cw, 0, this.cw, this.ch, x, y, this.cw, this.ch)
  }

  /** Komórka w spoczynku: kropka portretu albo przygaszony znak kodu tła (`fade` — przy brzegu koła). */
  private drawBase(i: number, fade = 1) {
    const base = this.base[i] ?? -1
    const dim = (this.dim[i] ?? 1) * fade
    if (base >= 0 && this.dots) {
      this.drawGlyph(this.dots, base, i, (0.34 + FACE_ALPHA * 0.66 * (this.density[i] ?? 1)) * dim)
    } else if (base === -2 && this.code)
      this.drawGlyph(this.code, this.codeChar[i] ?? 0, i, BG_ALPHA * dim)
  }

  private clearCell(i: number) {
    this.ctx?.clearRect(
      (i % this.cols) * this.cw,
      Math.floor(i / this.cols) * this.ch,
      this.cw,
      this.ch
    )
  }

  private drawAll() {
    const ctx = this.ctx
    if (!ctx || !this.dots) return
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const intro = !this.introDone && !this.reduced
    for (let i = 0; i < this.base.length; i++) {
      // Przed wejściem w kadr panel stoi jako rzadki, przygaszony kod — portret ułoży się na oczach widza.
      if (intro) {
        if ((this.base[i] ?? -1) !== -1 && hash(i, 9, 2) < 0.35 && this.code) {
          this.drawGlyph(this.code, this.codeChar[i] ?? 0, i, 0.12 * (this.dim[i] ?? 1))
        }
        this.shown[i] = -3
      } else {
        this.drawBase(i)
        this.shown[i] = this.base[i] ?? -1
      }
    }
    this.lastBox = null
    if (!intro) this.drawLens(this.clock)
  }

  /**
   * Prostokąt koła w komórkach, z początkiem wyrównanym do komórek 2 × 2
   * (parzysty): duże cyfry rysujemy tylko w parach mieszczących się w nim
   * w całości, więc nic nie wystaje poza czyszczony obszar i po przejściu koła
   * nie zostają resztki.
   */
  private lensBox(): [number, number, number, number] {
    const r = this.radius
    const cellW = this.cw / this.dpr
    const cellH = this.ch / this.dpr
    const even = (value: number) => Math.max(0, value - (value % 2))
    return [
      even(Math.floor((this.lens.x - r) / cellW) - 1),
      even(Math.floor((this.lens.y - r) / cellH) - 1),
      Math.min(this.cols - 1, Math.ceil((this.lens.x + r) / cellW) + 1),
      Math.min(this.rows - 1, Math.ceil((this.lens.y + r) / cellH) + 1),
    ]
  }

  /**
   * Koło kodu: w środku cyfry; kolumny „deszczu” z jasną głową i gasnącym
   * śladem, między nimi przygaszony kod. Nad twarzą jasność cyfr idzie za tonem
   * portretu. Krawędź jest ziarnista (losowanie co 90 ms), nie ostra jak cyrkiel.
   */
  private drawLens(time: number) {
    const ctx = this.ctx
    const code = this.code
    if (!ctx || !code) return
    const now = this.lensBox()
    const previous = this.lastBox
    const box: [number, number, number, number] = previous
      ? [
          Math.min(previous[0], now[0]),
          Math.min(previous[1], now[1]),
          Math.max(previous[2], now[2]),
          Math.max(previous[3], now[3]),
        ]
      : now
    ctx.globalAlpha = 1
    ctx.clearRect(
      box[0] * this.cw,
      box[1] * this.ch,
      (box[2] - box[0] + 1) * this.cw,
      (box[3] - box[1] + 1) * this.ch
    )
    const big = this.bigCode
    if (!big) return
    // Koło zgaszone: obszar wraca do portretu i nic więcej nie rysujemy.
    if (this.intensity < 0.02) {
      for (let row = box[1]; row <= box[3]; row++) {
        for (let col = box[0]; col <= box[2]; col++) {
          const i = row * this.cols + col
          this.drawBase(i)
          this.shown[i] = this.base[i] ?? -1
        }
      }
      this.lastBox = null
      return
    }
    // Pojawiając się i gasnąc, koło też rośnie i maleje — nie „wyskakuje” jako tarcza.
    const r = this.radius * (0.6 + 0.4 * this.intensity)
    const cellW = this.cw / this.dpr
    const cellH = this.ch / this.dpr
    const seconds = time / 1000
    // Komórki 2 × 2 w kole i ich udział `e` (0 na obwodzie → 1 od 45% promienia w głąb).
    // Przy brzegu kropki portretu gasną, a cyfry rosną — przejście bez twardej krawędzi.
    const inside = new Map<number, number>()
    // Tylko pary w całości wewnątrz prostokąta (koniec przycięty do parzystej granicy).
    for (let sr = box[1] / 2; 2 * sr + 1 <= box[3]; sr++) {
      for (let sc = box[0] / 2; 2 * sc + 1 <= box[2]; sc++) {
        const d = Math.hypot((2 * sc + 1) * cellW - this.lens.x, (2 * sr + 1) * cellH - this.lens.y)
        const k = 1 - d / r
        if (k <= 0) continue
        const t = Math.min(1, k / 0.45)
        inside.set(sr * this.cols + sc, t * t * (3 - 2 * t) * this.intensity)
      }
    }
    for (let row = box[1]; row <= box[3]; row++) {
      for (let col = box[0]; col <= box[2]; col++) {
        const i = row * this.cols + col
        const e = inside.get(Math.floor(row / 2) * this.cols + Math.floor(col / 2)) ?? 0
        if (e < 0.98) this.drawBase(i, 1 - e)
        this.shown[i] = e > 0 ? -4 : (this.base[i] ?? -1)
      }
    }
    for (const [key, e] of inside) {
      const sr = Math.floor(key / this.cols)
      const sc = key % this.cols
      const i = 2 * sr * this.cols + 2 * sc
      // Ton i przygaszenie: średnia z czterech komórek pod spodem.
      let tone = 0
      let face = 0
      let dim = 0
      for (const j of [i, i + 1, i + this.cols, i + this.cols + 1]) {
        if ((this.base[j] ?? -1) >= 0) {
          tone += this.density[j] ?? 0
          face++
        }
        dim += this.dim[j] ?? 1
      }
      // Deszcz: głowa kolumny przesuwa się w dół, znak zmienia się z każdym krokiem głowy.
      const trail = this.trail[sc] ?? 5
      const span = this.rows / 2 + trail
      const head = ((this.phase[sc] ?? 0) + seconds * (this.speed[sc] ?? 5)) % span
      const behind = head - sr
      const rain = behind >= 0 && behind < trail ? 1 - behind / trail : 0
      const glyph = Math.floor(hash(sc, sr, rain > 0 ? Math.floor(head) : 13) * CODE_GLYPHS.length)
      let alpha = face ? 0.24 + 0.72 * (tone / face) * (0.5 + face / 8) : 0.17
      alpha = Math.max(alpha, rain * 0.9)
      if (behind >= 0 && behind < 1) alpha = 1
      alpha *= e * (dim / 4)
      if (alpha <= 0.01) continue
      ctx.globalAlpha = Math.min(1, alpha)
      ctx.drawImage(
        big.image,
        glyph * big.cw,
        0,
        big.cw,
        big.ch,
        2 * sc * this.cw,
        2 * sr * this.ch,
        big.cw,
        big.ch
      )
    }
    this.lastBox = now
  }

  /* ——— pętla ——— */

  private wake() {
    if (this.frame || !this.visible || this.hidden || !this.base.length) return
    this.last = performance.now()
    this.frame = requestAnimationFrame(this.tick)
  }

  private readonly tick = (now: number) => {
    this.frame = 0
    if (!this.visible || this.hidden) return
    const dt = Math.min(64, now - this.last)
    this.last = now

    if (!this.introDone && !this.reduced && this.introStart >= 0) {
      const elapsed = now - this.introStart
      this.drawIntro(elapsed)
      if (elapsed > INTRO_MS + 500) {
        this.introDone = true
        this.drawAll()
      }
      this.frame = requestAnimationFrame(this.tick)
      return
    }

    // Czas deszczu płynie tylko, gdy ruch jest dozwolony (pauza zamraża kod w kole).
    if (this.auto && !this.reduced) this.clock += dt

    // Siła koła: jest, gdy jest wskaźnik albo dryf; po zjechaniu kursora gaśnie, potem wraca z dryfem.
    const show = this.reduced ? 0 : this.pointer ? 1 : now < this.resumeAt ? 0 : 1
    const fade = 1 - Math.exp(-dt / FADE_TAU)
    this.intensity += (show - this.intensity) * fade
    if (Math.abs(show - this.intensity) < 0.01) this.intensity = show

    const target = this.target(now)
    if (target) {
      const follow = 1 - Math.exp(-dt / FOLLOW_TAU)
      this.lens.x += (target.x - this.lens.x) * follow
      this.lens.y += (target.y - this.lens.y) * follow
    }
    this.drawLens(this.clock)
    if (this.auto && !this.reduced) this.flicker(now)

    const settled =
      this.intensity === show &&
      (!target ||
        (Math.abs(target.x - this.lens.x) < 0.3 && Math.abs(target.y - this.lens.y) < 0.3))
    if ((this.auto && !this.reduced) || !settled) this.frame = requestAnimationFrame(this.tick)
  }

  /** Dokąd zmierza koło: wskaźnik, dryf po twarzy albo nigdzie (pauza bez wskaźnika). */
  private target(now: number) {
    if (this.reduced) return null
    if (this.pointer) return this.pointer
    if (!this.auto || now < this.resumeAt) return null
    const rest = this.restPoint()
    return this.clamp({
      x: rest.x + Math.sin((now / DRIFT.tx) * Math.PI * 2) * this.face.w * DRIFT.ax,
      y: rest.y + Math.sin((now / DRIFT.ty) * Math.PI * 2 + 1) * this.face.h * DRIFT.ay,
    })
  }

  private drawIntro(elapsed: number) {
    for (let i = 0; i < this.base.length; i++) {
      const base = this.base[i] ?? -1
      if (base === -1 && this.shown[i] === -3) continue
      if (elapsed >= (this.due[i] ?? 0)) {
        if (this.shown[i] !== base) {
          this.clearCell(i)
          this.drawBase(i)
          this.shown[i] = base
        }
      } else if (hash(i, Math.floor(elapsed / 60), 6) < 0.3 && this.code) {
        this.clearCell(i)
        this.drawGlyph(
          this.code,
          Math.floor(hash(i, elapsed, 8) * CODE_GLYPHS.length),
          i,
          0.22 * (this.dim[i] ?? 1)
        )
        this.shown[i] = -5
      }
    }
  }

  /** Spoczynek nie stoi martwo: pojedyncze komórki tła zmieniają znak, twarz „oddycha” o stopień rampy. */
  private flicker(now: number) {
    if (now - this.lastFlicker < FLICKER_MS || !this.dots || !this.code) return
    this.lastFlicker = now
    const box = this.lastBox
    const inBox = (i: number) => {
      if (!box) return false
      const col = i % this.cols
      const row = Math.floor(i / this.cols)
      return col >= box[0] && col <= box[2] && row >= box[1] && row <= box[3]
    }
    // Oddech wraca: komórka po chwili znów ma swój stopień rampy.
    this.breathing = this.breathing.filter(({ i, at }) => {
      if (now < at) return true
      if (!inBox(i)) {
        this.clearCell(i)
        this.drawBase(i)
      }
      return false
    })
    const changes = Math.max(1, Math.round(this.base.length * FLICKER_SHARE))
    for (let n = 0; n < changes; n++) {
      const i = Math.floor(Math.random() * this.base.length)
      if (inBox(i)) continue
      const base = this.base[i] ?? -1
      if (base === -1) continue
      this.clearCell(i)
      if (base === -2) {
        this.codeChar[i] = Math.floor(Math.random() * CODE_GLYPHS.length)
        this.drawBase(i)
      } else {
        const level = this.ramp.indexOf(base)
        const swap =
          this.ramp[
            Math.max(0, Math.min(this.ramp.length - 1, level + (Math.random() < 0.5 ? -1 : 1)))
          ]
        this.drawGlyph(this.dots, swap ?? base, i, FACE_ALPHA * (this.dim[i] ?? 1))
        this.breathing.push({ i, at: now + BREATH_MS })
      }
    }
  }
}
