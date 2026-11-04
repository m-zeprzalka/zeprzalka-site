import { GLYPHS, MARK_GLYPHS } from "./alphabet"
import { ADVANCE, buildAtlas, type Atlas } from "./atlas"
import { isFace, sampleBox, type Portrait } from "./portrait"
import { PRINT_STEPS, measureCoverage, measureRamp, nearestByCoverage } from "./print"

/*
 * Pole glifów z hero: portret złożony z glifów. Tony niesie zmierzona rampa
 * (te same kropki i koła co w wydrukach kafli — 10 stopni jasności), więc twarz
 * czyta się jak raster półtonowy. Ruch: niewielki, stały podzbiór komórek (2,5%)
 * na chwilę zamienia glif na znak z logo o tym samym pokryciu (obraz się nie
 * zmienia), kursor rozpycha i miesza glify w promieniu 100 px, kliknięcie puszcza
 * falę. Czysty moduł canvasu bez Reacta — opakowanie (`PortraitField`) podaje mu
 * rozmiar, motyw, widoczność i zdarzenia wskaźnika.
 *
 * Koszt klatki: przejście po tablicach typowanych i rysowanie wyłącznie tego, co
 * się zmieniło — pojedynczych komórek albo prostokąta wokół kursora.
 */

/** Udział komórek twarzy, które w ogóle migają, i co ile ms część z nich się zmienia. */
const JITTER_SHARE = 0.025
const JITTER_MS = 120
/** Wejście: szum układa się w portret falą od środka twarzy. */
const INTRO_MS = 1700
/** Kursor: promień, maksymalne przesunięcie glifu (px), stałe czasowe ciepła i ruchu (ms). */
const RADIUS = 100
const PUSH = 9
const HEAT_TAU = 240
const MOVE_TAU = 70
/** Fala od kliknięcia: px/ms i szerokość pierścienia w px (fala miesza glify, nie rusza ich). */
const RIPPLE_SPEED = 0.85
const RIPPLE_WIDTH = 30

const MARK = MARK_GLYPHS.map((char) => GLYPHS.indexOf(char)).filter((index) => index >= 0)

interface Ripple {
  x: number
  y: number
  start: number
}

export class GlyphField {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D | null
  private readonly family: string
  private portrait: Portrait | null = null
  private atlas: Atlas | null = null
  private ramp: number[] = []
  /** Dla każdego glifu rampy — znak z logo o najbliższym pokryciu (zamiennik migania). */
  private alternate = new Map<number, number>()
  private ink = "#171717"
  private dark = false

  private width = 0
  private height = 0
  private dpr = 1
  private cols = 0
  private rows = 0
  private originX = 0
  private originY = 0

  private target = new Int16Array(0)
  private alpha = new Float32Array(0)
  private face = new Uint8Array(0)
  private shown = new Int16Array(0)
  private heat = new Float32Array(0)
  private offX = new Float32Array(0)
  private offY = new Float32Array(0)
  /** Komórki narysowane „na gorąco” (znak z logo) — po ostygnięciu wracają do swojego glifu. */
  private hot = new Uint8Array(0)
  private settle = new Float32Array(0)
  /** Komórki, które mogą migać (stały podzbiór twarzy) i ich bieżący stan. */
  private jitter = new Int32Array(0)
  private swapped = new Uint8Array(0)

  private auto = true
  private reduced = false
  private visible = false
  private introStart = -1
  private introDone = false
  private frame = 0
  /** Sam spoczynek (miganie) nie potrzebuje 60 klatek — wtedy budzi nas zegar. */
  private timer: ReturnType<typeof setTimeout> | undefined
  private lastTime = 0
  private lastJitter = 0
  private pointer: { x: number; y: number } | null = null
  private ripples: Ripple[] = []
  /** Prostokąt (w komórkach) przerysowany w poprzedniej klatce — do wyczyszczenia śladów. */
  private lastBox: [number, number, number, number] | null = null

  constructor(canvas: HTMLCanvasElement, family: string) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.family = family
  }

  setPortrait(portrait: Portrait) {
    this.portrait = portrait
    this.rebuild()
  }

  resize(width: number, height: number, dpr: number) {
    if (width === this.width && height === this.height && dpr === this.dpr) return
    this.width = width
    this.height = height
    this.dpr = dpr
    this.rebuild()
  }

  setTheme(ink: string, dark: boolean) {
    if (ink === this.ink && dark === this.dark && this.atlas) return
    this.ink = ink
    this.dark = dark
    this.rebuild()
  }

  setMotion(auto: boolean, reduced: boolean) {
    this.auto = auto
    this.reduced = reduced
    if (reduced) {
      this.introDone = true
      this.heat.fill(0)
      this.offX.fill(0)
      this.offY.fill(0)
      this.swapped.fill(0)
      this.ripples = []
      this.pointer = null
      this.drawAll()
    }
    this.wake()
  }

  setVisible(visible: boolean) {
    this.visible = visible
    if (visible && this.introStart < 0 && !this.introDone && this.target.length) {
      this.introStart = performance.now()
    }
    this.wake()
  }

  pointerMove(x: number, y: number) {
    if (this.reduced) return
    this.pointer = { x, y }
    this.wake()
  }

  pointerLeave() {
    this.pointer = null
    this.wake()
  }

  pointerDown(x: number, y: number) {
    if (this.reduced) return
    this.ripples.push({ x, y, start: performance.now() })
    this.wake()
  }

  destroy() {
    cancelAnimationFrame(this.frame)
    clearTimeout(this.timer)
    this.frame = 0
  }

  /* ——— układ ——— */

  private rebuild() {
    if (!this.portrait || !this.width || !this.height) return
    // Mniej, większych znaków na wąskim ekranie — glif ma być czytelny jako znak, nie szum.
    const cellWidth = Math.min(8, Math.max(5.5, this.width / 74))
    this.atlas = buildAtlas(
      this.family,
      cellWidth,
      (cellWidth / ADVANCE) * 0.96,
      this.dpr,
      this.ink
    )
    const coverage = measureCoverage(this.atlas)
    this.ramp = measureRamp(this.atlas, coverage)
    this.alternate = new Map(
      this.ramp.map((glyph) => [glyph, nearestByCoverage(glyph, MARK_GLYPHS, coverage)])
    )

    const atlas = this.atlas
    const deviceWidth = Math.round(this.width * this.dpr)
    const deviceHeight = Math.round(this.height * this.dpr)
    this.canvas.width = deviceWidth
    this.canvas.height = deviceHeight
    this.cols = Math.floor(deviceWidth / atlas.cw)
    this.rows = Math.floor(deviceHeight / atlas.ch)
    this.originX = Math.floor((deviceWidth - this.cols * atlas.cw) / 2)
    this.originY = Math.floor((deviceHeight - this.rows * atlas.ch) / 2)

    const count = this.cols * this.rows
    this.target = new Int16Array(count).fill(-1)
    this.alpha = new Float32Array(count)
    this.face = new Uint8Array(count)
    this.shown = new Int16Array(count).fill(-2)
    this.heat = new Float32Array(count)
    this.offX = new Float32Array(count)
    this.offY = new Float32Array(count)
    this.hot = new Uint8Array(count)
    this.settle = new Float32Array(count)
    this.swapped = new Uint8Array(count)
    this.lastBox = null
    this.map()
    this.drawAll()
    if (this.visible) this.setVisible(true)
  }

  /** Portret → glif każdej komórki: wygładzona próbka, rozciągnięcie kontrastu, rampa 10 stopni. */
  private map() {
    const p = this.portrait as Portrait
    const atlas = this.atlas as Atlas
    const cellW = atlas.cw / this.dpr
    const cellH = atlas.ch / this.dpr
    const gridW = this.cols * cellW
    const gridH = this.rows * cellH
    const scale = Math.min((gridW * 0.9) / p.box.w, (gridH * 0.92) / p.box.h)
    const offsetX = (gridW - p.box.w * scale) / 2
    const offsetY = (gridH - p.box.h * scale) / 2
    const centerX = gridW / 2
    const centerY = offsetY + p.box.h * scale * 0.42
    const reach = Math.hypot(gridW, gridH) / 2

    const raw = new Float32Array(this.cols * this.rows).fill(-1)
    const faceValues: number[] = []
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const i = row * this.cols + col
        const x0 = p.box.x + (col * cellW - offsetX) / scale
        const y0 = p.box.y + (row * cellH - offsetY) / scale
        const x1 = x0 + cellW / scale
        const y1 = y0 + cellH / scale
        if (isFace(p, (x0 + x1) / 2, (y0 + y1) / 2)) {
          // Próbka o 50% szersza niż komórka: wygładza szum źródłowego portretu ASCII.
          const padX = (x1 - x0) * 0.5
          const padY = (y1 - y0) * 0.5
          const value = sampleBox(p, x0 - padX, y0 - padY, x1 + padX, y1 + padY)
          raw[i] = value
          faceValues.push(value)
        }
        const distance = Math.hypot(
          col * cellW + cellW / 2 - centerX,
          row * cellH + cellH / 2 - centerY
        )
        this.settle[i] = 140 + (distance / reach) * 950 + Math.random() * 420
      }
    }

    faceValues.sort((a, b) => a - b)
    const lo = faceValues[Math.floor(faceValues.length * 0.03)] ?? 0
    const hi = faceValues[Math.floor(faceValues.length * 0.97)] ?? 1
    const span = Math.max(0.05, hi - lo)
    const dust = this.ramp[0] ?? -1
    const jitter: number[] = []

    for (let i = 0; i < raw.length; i++) {
      const value = raw[i] ?? -1
      if (value >= 0) {
        const light = Math.min(1, Math.max(0, (value - lo) / span))
        // Jasny motyw: gęsto tam, gdzie ciemno (tusz na papierze). Ciemny: odwrotnie — pozytyw.
        const density = Math.pow(this.dark ? light : 1 - light, 1.2)
        const level =
          density < 0.05 ? 0 : Math.min(PRINT_STEPS, 1 + Math.floor(density * PRINT_STEPS))
        this.target[i] = level ? (this.ramp[level - 1] ?? -1) : -1
        this.alpha[i] = 1
        this.face[i] = 1
        if (level >= 3 && Math.random() < JITTER_SHARE) jitter.push(i)
      } else {
        // Tło: rzadki pył kropek gęstniejący przy głowie — pole ma granice, kursor ma po czym pisać.
        const col = i % this.cols
        const row = Math.floor(i / this.cols)
        const near = Math.max(
          0,
          1 -
            Math.hypot((col + 0.5) * cellW - centerX, (row + 0.5) * cellH - centerY) /
              (reach * 0.95)
        )
        const isDust = Math.random() < 0.02 + near * near * 0.14
        this.target[i] = isDust ? dust : -1
        this.alpha[i] = 0.35
      }
    }
    this.jitter = Int32Array.from(jitter)
  }

  /* ——— rysowanie ——— */

  private glyphFor(i: number): number {
    const target = this.target[i] ?? -1
    if (target < 0 || !this.swapped[i]) return target
    return this.alternate.get(target) ?? target
  }

  private drawGlyph(i: number, glyph: number, alpha: number) {
    const ctx = this.ctx
    const atlas = this.atlas
    if (!ctx || !atlas || glyph < 0) return
    const x = this.originX + (i % this.cols) * atlas.cw + Math.round((this.offX[i] ?? 0) * this.dpr)
    const y =
      this.originY +
      Math.floor(i / this.cols) * atlas.ch +
      Math.round((this.offY[i] ?? 0) * this.dpr)
    ctx.globalAlpha = alpha
    ctx.drawImage(atlas.image, glyph * atlas.cw, 0, atlas.cw, atlas.ch, x, y, atlas.cw, atlas.ch)
  }

  /** Pojedyncza komórka bez przesunięcia (miganie, wejście). */
  private drawCell(i: number, glyph: number, alpha: number) {
    const ctx = this.ctx
    const atlas = this.atlas
    if (!ctx || !atlas) return
    const x = this.originX + (i % this.cols) * atlas.cw
    const y = this.originY + Math.floor(i / this.cols) * atlas.ch
    ctx.clearRect(x, y, atlas.cw, atlas.ch)
    this.drawGlyph(i, glyph, alpha)
    this.shown[i] = glyph
  }

  private drawAll() {
    const ctx = this.ctx
    if (!ctx || !this.atlas) return
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const intro = !this.introDone && !this.reduced
    for (let i = 0; i < this.target.length; i++) {
      // Przed wejściem w kadr pole stoi jako rzadki szum — portret ułoży się na oczach widza.
      if (intro) {
        if (this.face[i] && Math.random() < 0.3) this.drawGlyph(i, this.ramp[0] ?? -1, 0.25)
      } else this.drawGlyph(i, this.glyphFor(i), this.alpha[i] ?? 1)
      this.shown[i] = -2
    }
  }

  /* ——— pętla ——— */

  private wake() {
    clearTimeout(this.timer)
    this.timer = undefined
    if (this.frame || !this.visible || !this.target.length) return
    this.lastTime = performance.now()
    this.frame = requestAnimationFrame(this.tick)
  }

  private readonly tick = (now: number) => {
    this.frame = 0
    const dt = Math.min(64, now - this.lastTime)
    this.lastTime = now
    const atlas = this.atlas
    if (!atlas || !this.visible) return

    const introElapsed = this.introStart < 0 ? -1 : now - this.introStart
    const intro = !this.introDone && introElapsed >= 0 && !this.reduced
    if (intro) {
      this.drawIntro(introElapsed)
      if (introElapsed > INTRO_MS) {
        this.introDone = true
        this.drawAll()
      }
      this.frame = requestAnimationFrame(this.tick)
      return
    }

    // Miganie: część stałego podzbioru komórek zamienia glif na znak z logo i z powrotem.
    if (this.auto && now - this.lastJitter >= JITTER_MS - 4) {
      this.lastJitter = now
      const changes = Math.max(1, Math.round(this.jitter.length / 4))
      for (let n = 0; n < changes; n++) {
        const i = this.jitter[Math.floor(Math.random() * this.jitter.length)]
        if (i === undefined) continue
        this.swapped[i] = this.swapped[i] ? 0 : 1
        if (!this.inBox(i)) this.drawCell(i, this.glyphFor(i), this.alpha[i] ?? 1)
      }
    }

    const moving = this.stepForces(dt, now)
    if (moving || this.lastBox) this.redrawBox(moving)
    const warm = this.drawHeat()

    if (moving || warm || this.ripples.length || this.pointer) {
      this.frame = requestAnimationFrame(this.tick)
    } else if (this.auto) {
      this.timer = setTimeout(() => this.wake(), JITTER_MS)
    }
  }

  private drawIntro(elapsed: number) {
    for (let i = 0; i < this.target.length; i++) {
      const settled = elapsed >= (this.settle[i] ?? 0)
      if (settled) {
        if (this.shown[i] !== this.target[i])
          this.drawCell(i, this.target[i] ?? -1, this.alpha[i] ?? 1)
      } else if (Math.random() < 0.5) {
        const noisy = this.face[i] || Math.random() < 0.05
        this.drawCell(i, noisy ? (this.ramp[Math.floor(Math.random() * 5)] ?? -1) : -1, 0.3)
      }
    }
  }

  /**
   * Ciepło (mieszanie) wszystkich komórek — od fal i kursora — oraz przesunięcia
   * komórek wokół kursora (tylko tam: fala miesza glify, ale ich nie rusza, więc
   * nie wymaga przerysowania całego pola). Zwraca prostokąt komórek w ruchu
   * wokół kursora (kolumny/wiersze) albo `null`, gdy tam wszystko stoi.
   */
  private stepForces(dt: number, now: number): [number, number, number, number] | null {
    const atlas = this.atlas as Atlas
    const cellW = atlas.cw / this.dpr
    const cellH = atlas.ch / this.dpr
    const ox = this.originX / this.dpr
    const oy = this.originY / this.dpr
    const heatDecay = Math.exp(-dt / HEAT_TAU)
    const follow = 1 - Math.exp(-dt / MOVE_TAU)
    const reach = Math.hypot(this.width, this.height)
    this.ripples = this.ripples.filter((ripple) => (now - ripple.start) * RIPPLE_SPEED < reach)
    const rings = this.ripples.map((ripple) => ({
      x: ripple.x,
      y: ripple.y,
      radius: (now - ripple.start) * RIPPLE_SPEED,
    }))

    for (let i = 0; i < this.target.length; i++) {
      let heat = (this.heat[i] ?? 0) * heatDecay
      if (rings.length) {
        const cx = ox + ((i % this.cols) + 0.5) * cellW
        const cy = oy + (Math.floor(i / this.cols) + 0.5) * cellH
        for (const ring of rings) {
          const gap = Math.abs(Math.hypot(cx - ring.x, cy - ring.y) - ring.radius)
          if (gap < RIPPLE_WIDTH) {
            heat = Math.max(heat, 0.7 * (1 - gap / RIPPLE_WIDTH) * (1 - ring.radius / reach))
          }
        }
      }
      this.heat[i] = heat < 0.02 ? 0 : heat
    }

    // Obszar kursora (z zapasem) plus to, co ruszało się w poprzedniej klatce.
    let region = this.lastBox
    if (this.pointer) {
      const pc0 = Math.max(0, Math.floor((this.pointer.x - ox - RADIUS) / cellW))
      const pc1 = Math.min(this.cols - 1, Math.ceil((this.pointer.x - ox + RADIUS) / cellW))
      const pr0 = Math.max(0, Math.floor((this.pointer.y - oy - RADIUS) / cellH))
      const pr1 = Math.min(this.rows - 1, Math.ceil((this.pointer.y - oy + RADIUS) / cellH))
      region = region
        ? [
            Math.min(region[0], pc0),
            Math.min(region[1], pr0),
            Math.max(region[2], pc1),
            Math.max(region[3], pr1),
          ]
        : [pc0, pr0, pc1, pr1]
    }
    if (!region) return null

    let c0 = this.cols
    let c1 = -1
    let r0 = this.rows
    let r1 = -1
    for (let row = region[1]; row <= region[3]; row++) {
      for (let col = region[0]; col <= region[2]; col++) {
        const i = row * this.cols + col
        let pushX = 0
        let pushY = 0
        let pointerHeat = 0
        if (this.pointer) {
          const dx = ox + (col + 0.5) * cellW - this.pointer.x
          const dy = oy + (row + 0.5) * cellH - this.pointer.y
          const distance = Math.hypot(dx, dy)
          if (distance < RADIUS) {
            pointerHeat = (1 - distance / RADIUS) ** 2
            if (distance > 0.5) {
              pushX = (dx / distance) * PUSH * pointerHeat
              pushY = (dy / distance) * PUSH * pointerHeat
            }
          }
        }
        if (pointerHeat > (this.heat[i] ?? 0)) this.heat[i] = pointerHeat
        const x = (this.offX[i] ?? 0) + (pushX - (this.offX[i] ?? 0)) * follow
        const y = (this.offY[i] ?? 0) + (pushY - (this.offY[i] ?? 0)) * follow
        const still = Math.abs(x) < 0.15 && Math.abs(y) < 0.15
        this.offX[i] = still ? 0 : x
        this.offY[i] = still ? 0 : y
        if (!still || pointerHeat >= 0.02) {
          c0 = Math.min(c0, col)
          c1 = Math.max(c1, col)
          r0 = Math.min(r0, row)
          r1 = Math.max(r1, row)
        }
      }
    }
    return c1 < 0 ? null : [c0, r0, c1, r1]
  }

  /**
   * Komórki ogrzane falą (poza prostokątem kursora): losują znak z logo, a po
   * ostygnięciu wracają do swojego glifu. Rysowane pojedynczo, bez przesunięć.
   * Zwraca, czy coś jest jeszcze ciepłe.
   */
  private drawHeat(): boolean {
    let warm = false
    for (let i = 0; i < this.target.length; i++) {
      const heat = this.heat[i] ?? 0
      if (this.inBox(i)) continue
      if (heat > 0.03) {
        warm = true
        if (Math.random() < heat * 0.5) {
          const glyph = MARK[Math.floor(Math.random() * MARK.length)] ?? -1
          this.drawCell(i, glyph, Math.min(1, Math.max(this.alpha[i] ?? 1, 0.4 + heat)))
          this.hot[i] = 1
        }
      } else if (this.hot[i]) {
        this.hot[i] = 0
        this.drawCell(i, this.glyphFor(i), this.alpha[i] ?? 1)
      }
    }
    return warm
  }

  private inBox(i: number): boolean {
    const box = this.lastBox
    if (!box) return false
    const col = i % this.cols
    const row = Math.floor(i / this.cols)
    return col >= box[0] && col <= box[2] && row >= box[1] && row <= box[3]
  }

  /**
   * Przerysowanie prostokąta wokół kursora: czyszczenie z zapasem na przesunięcie
   * (także obszaru z poprzedniej klatki — bez śladów), potem wszystkie komórki
   * w środku, z przesunięciem; gorące losują znak z logo.
   */
  private redrawBox(moving: [number, number, number, number] | null) {
    const ctx = this.ctx
    const atlas = this.atlas
    if (!ctx || !atlas) return
    const pad = Math.ceil((PUSH * this.dpr) / Math.min(atlas.cw, atlas.ch)) + 1
    const grow = (box: [number, number, number, number]): [number, number, number, number] => [
      Math.max(0, box[0] - pad),
      Math.max(0, box[1] - pad),
      Math.min(this.cols - 1, box[2] + pad),
      Math.min(this.rows - 1, box[3] + pad),
    ]
    const now = moving ? grow(moving) : null
    const previous = this.lastBox
    const box: [number, number, number, number] =
      previous && now
        ? [
            Math.min(previous[0], now[0]),
            Math.min(previous[1], now[1]),
            Math.max(previous[2], now[2]),
            Math.max(previous[3], now[3]),
          ]
        : ((now ?? previous) as [number, number, number, number])

    ctx.globalAlpha = 1
    ctx.clearRect(
      this.originX + box[0] * atlas.cw,
      this.originY + box[1] * atlas.ch,
      (box[2] - box[0] + 1) * atlas.cw,
      (box[3] - box[1] + 1) * atlas.ch
    )
    for (let row = box[1]; row <= box[3]; row++) {
      for (let col = box[0]; col <= box[2]; col++) {
        const i = row * this.cols + col
        const heat = this.heat[i] ?? 0
        let glyph = this.glyphFor(i)
        let alpha = this.alpha[i] ?? 1
        if (heat > 0.03) {
          if (Math.random() < heat * 0.5)
            glyph = MARK[Math.floor(Math.random() * MARK.length)] ?? glyph
          if (glyph < 0 && Math.random() < heat * 0.6) glyph = this.ramp[2] ?? -1
          alpha = Math.min(1, Math.max(alpha, 0.4 + heat))
        }
        this.drawGlyph(i, glyph, alpha)
        this.shown[i] = -2
        // Znak wylosowany w prostokącie wróci do swojego glifu, gdy komórka ostygnie poza nim.
        this.hot[i] = glyph === this.glyphFor(i) ? 0 : 1
      }
    }
    this.lastBox = now
  }
}
