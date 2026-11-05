import { ADVANCE, getAtlas, type Atlas } from "./atlas"

/*
 * Odkodowanie z glifów — sygnaturowy efekt koncepcji. Obraz (albo klatka wideo)
 * leży pod canvasem; canvas zaczyna od „kodu” (glify w kolorach obrazu na
 * papierze) albo od zrzutu poprzedniego widoku i rozpuszcza się falą: komórka
 * tuż przed odsłonięciem miga glifami, potem znika i zostaje prawdziwy obraz.
 *
 * Wydruk glifów liczony jest raz na przejście (dwa warianty do migania) do
 * osobnych bitmap; klatka fali to tylko `clearRect` albo kopia komórki.
 * Po fali canvas oddaje pamięć (0 × 0) — obraz jest już tylko obrazem.
 */

export type Pick = "level" | "random"

export interface GlyphSet {
  family: string
  glyphs: readonly string[]
  /** `level` — glif dobrany do kontrastu z papierem (raster), `random` — dowolny (kod binarny). */
  pick: Pick
}

/**
 * Dwa etapy frontu fali: najpierw kod (migający, np. cyfry binarne), potem
 * raster (półton z gęstością obrazu) — dane → sygnał → obraz.
 */
export interface DecodeStyle {
  code: GlyphSet
  raster: GlyphSet
  /** Szerokość komórki w px CSS (oba kroje mono mają tę samą szerokość znaku). */
  cell: number
  /** Część frontu z rastrem (0 — sam kod). */
  rasterShare?: number
  /** Papier inny niż z CSS (np. zawsze ciemny „ekran”). */
  paper?: string
}

export type Origin = "left" | "right" | "top" | { x: number; y: number }

export interface Wave {
  duration: number
  /** Jak długo komórka miga glifami przed odsłonięciem (ms). */
  front: number
  /** Przenikanie komórki z rastra w obraz (ms) — miękka krawędź fali zamiast schodków. */
  fade?: number
  jitter: number
  delay?: number
  origin: Origin
  /**
   * `decode` — kod rozpuszcza się w obraz (domyślnie); `encode` — odwrotnie:
   * obraz zamienia się w raster z glifów i tak zostaje (pauza wideo).
   */
  mode?: "decode" | "encode"
  /**
   * Stan początkowy: pusty papier, pełny kod, „utajony wydruk” (obraz mocno
   * rozmyty i przygaszony + blady raster — obraz już tam jest, tylko jeszcze
   * nieodczytany; kadr nigdy nie jest pustą dziurą) albo zrzut poprzedniego
   * widoku (rysowany pod bieżącym canvasem, jeśli poprzednia fala jeszcze trwa).
   */
  from:
    | "paper"
    | "code"
    | "latent"
    | "clear"
    | ((ctx: CanvasRenderingContext2D, width: number, height: number) => void)
}

type Source = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement

function sourceSize(source: Source): [number, number] {
  if (source instanceof HTMLImageElement) return [source.naturalWidth, source.naturalHeight]
  if (source instanceof HTMLVideoElement) return [source.videoWidth, source.videoHeight]
  return [source.width, source.height]
}

/** Rysuje źródło jak `object-fit: cover`. */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  source: Source,
  width: number,
  height: number
) {
  const [sw, sh] = sourceSize(source)
  if (!sw || !sh) return
  const scale = Math.max(width / sw, height / sh)
  const dw = sw * scale
  const dh = sh * scale
  ctx.drawImage(source, (width - dw) / 2, (height - dh) / 2, dw, dh)
}

/** Papier pod glifami — kolor z CSS (`--ixn-paper`), zapisany szesnastkowo albo w rgb(). */
function readPaper(canvas: HTMLCanvasElement): string {
  return getComputedStyle(canvas).getPropertyValue("--ixn-paper").trim() || "#f5f5f5"
}

const luminances = new Map<string, number>()

/** Jasność koloru papieru (0–1) — liczona raz na kolor (motyw). */
function luminanceOf(color: string): number {
  const hit = luminances.get(color)
  if (hit !== undefined) return hit
  const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true })
  if (!probe) return 1
  probe.fillStyle = color
  probe.fillRect(0, 0, 1, 1)
  const [r = 0, g = 0, b = 0] = probe.getImageData(0, 0, 1, 1).data
  const value = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  luminances.set(color, value)
  return value
}

/** Utajony wydruk: krycie rozmytego obrazu i bladego rastra (obraz → kod → obraz bez pustki). */
const LATENT_IMAGE = 0.34
const LATENT_RASTER = 0.5
/** Rozmycie utajonego obrazu: zmniejszenie tyle razy i powiększenie z wygładzaniem (tanie, bez filtrów). */
const LATENT_BLUR = 18

/**
 * Pole kodu: losowe glify (białe) narysowane raz na krój, komórkę i gęstość
 * ekranu, w zapasowym rozmiarze. Wydruk „kodu” to tylko wycinek pola + kolor
 * obrazu wlany w kształty — zamiast tysiąca `drawImage` na każdą falę.
 * Maska gęstości jest tu zbędna: glif ma kolor obrazu, więc tam, gdzie obraz
 * ma kolor papieru, glif i tak znika.
 */
const FIELD_CELLS = { cols: 120, rows: 48 }
const fields = new Map<string, [HTMLCanvasElement, HTMLCanvasElement]>()

function codeFields(atlas: Atlas, family: string): [HTMLCanvasElement, HTMLCanvasElement] {
  const key = `${family}|${atlas.glyphs.join("")}|${atlas.cw}|${atlas.ch}`
  const hit = fields.get(key)
  if (hit) return hit
  // Krój mono: znak ma dokładnie szerokość komórki, więc cały rząd to jedno `fillText`.
  const make = () => {
    const field = document.createElement("canvas")
    field.width = FIELD_CELLS.cols * atlas.cw
    field.height = FIELD_CELLS.rows * atlas.ch
    const ctx = field.getContext("2d")
    if (!ctx) return field
    ctx.font = `${(atlas.cw / ADVANCE).toFixed(2)}px ${family}`
    ctx.fillStyle = "#fff"
    ctx.textBaseline = "middle"
    for (let row = 0; row < FIELD_CELLS.rows; row++) {
      let line = ""
      for (let col = 0; col < FIELD_CELLS.cols; col++) {
        line += atlas.glyphs[Math.floor(Math.random() * atlas.glyphs.length)] ?? ""
      }
      ctx.fillText(line, 0, row * atlas.ch + atlas.ch / 2, field.width)
    }
    return field
  }
  const pair: [HTMLCanvasElement, HTMLCanvasElement] = [make(), make()]
  fields.set(key, pair)
  return pair
}

export class GlyphDecoder {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D | null
  /** Kod (dwa warianty do migania) i raster. */
  private readonly prints: [HTMLCanvasElement, HTMLCanvasElement, HTMLCanvasElement]
  private atlas: Atlas | null = null
  private rasterAtlas: Atlas | null = null
  private width = 0
  private height = 0
  private dpr = 1
  private dw = 0
  private dh = 0
  private cols = 0
  private rows = 0
  private ox = 0
  private oy = 0
  private paper = "#f5f5f5"
  private due = new Float64Array(0)
  private revealed = new Uint8Array(0)
  private frame = 0
  private front = 0
  private fade = 0
  private encoding = false
  private rasterShare = 0.38
  private resolve: (() => void) | null = null
  /** Bufory próbkowania (wielokrotnego użytku — bez alokacji przy każdej fali). */
  private readonly third = document.createElement("canvas")
  private readonly small = document.createElement("canvas")
  /** Źródło w rozmiarze wydruku, wlewane w glify trzech wydruków (jeden `drawCover` zamiast trzech). */
  private readonly fill = document.createElement("canvas")
  /**
   * Utajony wydruk w rozmiarze kadru: papier + rozmyty, przygaszony obraz + blady
   * raster. Jest tłem komórek frontu fali, więc front nigdy nie wycina w kadrze
   * „dziur” w kolorze papieru — także w ciemnym motywie.
   */
  private readonly latent = document.createElement("canvas")
  private readonly tiny = document.createElement("canvas")

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.prints = [
      document.createElement("canvas"),
      document.createElement("canvas"),
      document.createElement("canvas"),
    ]
  }

  resize(width: number, height: number, dpr: number) {
    this.width = width
    this.height = height
    this.dpr = dpr
  }

  /**
   * Przejście do obrazu `source`. Zwraca obietnicę spełnioną po fali (albo
   * przy przerwaniu — wtedy kolejne `play` zaczyna od tego, co widać).
   */
  play(source: Source, style: DecodeStyle, wave: Wave): Promise<void> {
    const ctx = this.ctx
    if (!ctx || !this.width || !this.height) return Promise.resolve()

    // Zrzut bieżącego stanu (fala w toku), zanim canvas zmieni rozmiar.
    let current: HTMLCanvasElement | null = null
    if (typeof wave.from === "function" && this.canvas.width > 0) {
      current = document.createElement("canvas")
      current.width = this.canvas.width
      current.height = this.canvas.height
      current.getContext("2d")?.drawImage(this.canvas, 0, 0)
    }
    this.stop()

    this.paper = style.paper ?? readPaper(this.canvas)
    this.rasterShare = style.rasterShare ?? 0.38
    this.layout(style)
    const paperLum = luminanceOf(this.paper)
    const levels = this.sample(source, paperLum)
    // Źródło w rozmiarze wydruku — raz, potem trzy wydruki biorą z niego kolor.
    this.fill.width = this.dw
    this.fill.height = this.dh
    const fctx = this.fill.getContext("2d")
    if (fctx) drawCover(fctx, source, this.dw, this.dh)
    this.renderPrint(this.prints[0], this.atlas, style.code, levels, 0)
    this.renderPrint(this.prints[1], this.atlas, style.code, levels, 1)
    this.renderPrint(this.prints[2], this.rasterAtlas, style.raster, levels, 0)
    this.renderLatent()

    this.canvas.width = this.dw
    this.canvas.height = this.dh
    if (wave.from === "clear") {
      ctx.clearRect(0, 0, this.dw, this.dh)
    } else if (wave.from === "latent") {
      ctx.drawImage(this.latent, 0, 0)
    } else if (typeof wave.from === "string") {
      ctx.fillStyle = this.paper
      ctx.fillRect(0, 0, this.dw, this.dh)
      if (wave.from === "code") ctx.drawImage(this.prints[0], 0, 0)
    } else {
      wave.from(ctx, this.dw, this.dh)
      if (current) ctx.drawImage(current, 0, 0, this.dw, this.dh)
    }

    this.schedule(wave)
    this.front = wave.front
    this.fade = wave.fade ?? 90
    this.encoding = wave.mode === "encode"
    return new Promise((resolve) => {
      this.resolve = resolve
      this.frame = requestAnimationFrame(this.tick)
    })
  }

  /** Natychmiastowy koniec: canvas znika, zostaje obraz. */
  release() {
    this.stop()
    this.canvas.width = 0
    this.canvas.height = 0
  }

  destroy() {
    this.release()
    for (const print of [
      ...this.prints,
      this.fill,
      this.third,
      this.small,
      this.latent,
      this.tiny,
    ]) {
      print.width = 0
      print.height = 0
    }
  }

  private stop() {
    cancelAnimationFrame(this.frame)
    this.frame = 0
    this.resolve?.()
    this.resolve = null
  }

  private layout(style: DecodeStyle) {
    this.atlas = getAtlas(style.code.family, style.code.glyphs, style.cell, this.dpr)
    this.rasterAtlas = getAtlas(style.raster.family, style.raster.glyphs, style.cell, this.dpr)
    const { cw, ch } = this.atlas
    this.dw = Math.max(1, Math.round(this.width * this.dpr))
    this.dh = Math.max(1, Math.round(this.height * this.dpr))
    // Siatka mieści się w całości i stoi pośrodku: równy margines, żadnych uciętych glifów.
    const margin = Math.max(cw / 2, 3 * this.dpr)
    this.cols = Math.max(1, Math.floor((this.dw - 2 * margin) / cw))
    this.rows = Math.max(1, Math.floor((this.dh - 2 * margin) / ch))
    this.ox = Math.round((this.dw - this.cols * cw) / 2)
    this.oy = Math.round((this.dh - this.rows * ch) / 2)
    const count = this.cols * this.rows
    if (this.due.length !== count) {
      this.due = new Float64Array(count)
      this.revealed = new Uint8Array(count)
    }
  }

  /**
   * Gęstość każdej komórki: kontrast obrazu z papierem (0–1). Biel zrzutu
   * strony na jasnym papierze zostaje pusta, a na ciemnym staje się kodem —
   * obraz czyta się w obu motywach bez osobnych reguł.
   */
  private sample(source: Source, paperLum: number): Float32Array {
    const count = this.cols * this.rows
    const out = new Float32Array(count)
    const atlas = this.atlas
    if (!atlas) return out
    const half = this.third
    half.width = Math.max(1, Math.round(this.dw / 3))
    half.height = Math.max(1, Math.round(this.dh / 3))
    const small = this.small
    small.width = this.cols
    small.height = this.rows
    const hctx = half.getContext("2d")
    const sctx = small.getContext("2d", { willReadFrequently: true })
    if (!hctx || !sctx) return out
    hctx.imageSmoothingQuality = "high"
    drawCover(hctx, source, half.width, half.height)
    sctx.imageSmoothingQuality = "high"
    sctx.drawImage(
      half,
      this.ox / 3,
      this.oy / 3,
      (this.cols * atlas.cw) / 3,
      (this.rows * atlas.ch) / 3,
      0,
      0,
      this.cols,
      this.rows
    )
    let data: Uint8ClampedArray
    try {
      data = sctx.getImageData(0, 0, this.cols, this.rows).data
    } catch {
      return out
    }
    for (let i = 0; i < count; i++) {
      const lum =
        (0.2126 * (data[i * 4] ?? 0) +
          0.7152 * (data[i * 4 + 1] ?? 0) +
          0.0722 * (data[i * 4 + 2] ?? 0)) /
        255
      out[i] = Math.min(1, Math.abs(lum - paperLum) * 1.35)
    }
    return out
  }

  /**
   * Wydruk: białe glify, potem obraz wlany w ich kształt (`source-in`).
   * Kod (`random`) to wycinek gotowego pola; raster (`level`) dobiera glif
   * do gęstości każdej komórki.
   */
  private renderPrint(
    print: HTMLCanvasElement,
    atlas: Atlas | null,
    set: GlyphSet,
    levels: Float32Array,
    variant: 0 | 1
  ) {
    if (!atlas) return
    print.width = this.dw
    print.height = this.dh
    const ctx = print.getContext("2d")
    if (!ctx) return
    const gridW = this.cols * atlas.cw
    const gridH = this.rows * atlas.ch
    if (set.pick === "random" && this.cols <= FIELD_CELLS.cols && this.rows <= FIELD_CELLS.rows) {
      const field = codeFields(atlas, set.family)[variant]
      // Przesunięcie wycinka losowe co falę — kod nigdy nie powtarza się w tym samym miejscu.
      const sx = Math.floor(Math.random() * (FIELD_CELLS.cols - this.cols + 1)) * atlas.cw
      const sy = Math.floor(Math.random() * (FIELD_CELLS.rows - this.rows + 1)) * atlas.ch
      ctx.drawImage(field, sx, sy, gridW, gridH, this.ox, this.oy, gridW, gridH)
    } else {
      // Raster: glif dobrany do gęstości komórki; cały rząd jednym `fillText`
      // (krój mono — znak ma szerokość komórki, pusta komórka to spacja).
      const ramp = atlas.glyphs
        .map((_, index) => index)
        .sort((a, b) => (atlas.coverage[a] ?? 0) - (atlas.coverage[b] ?? 0))
      ctx.font = `${(atlas.cw / ADVANCE).toFixed(2)}px ${set.family}`
      ctx.fillStyle = "#fff"
      ctx.textBaseline = "middle"
      for (let row = 0; row < this.rows; row++) {
        let line = ""
        for (let col = 0; col < this.cols; col++) {
          const i = row * this.cols + col
          const density = levels[i] ?? 0
          if (density < 0.07) {
            line += " "
            continue
          }
          if (set.pick === "random") {
            line += atlas.glyphs[Math.floor(Math.random() * atlas.glyphs.length)] ?? " "
            continue
          }
          // Wariant 1 bierze sąsiedni glif z rampy — miganie nie zmienia jasności obrazu.
          const step = Math.min(ramp.length - 1, Math.floor(Math.pow(density, 0.85) * ramp.length))
          const shift = variant === 0 ? 0 : i % 2 ? 1 : -1
          line +=
            atlas.glyphs[ramp[Math.max(0, Math.min(ramp.length - 1, step + shift))] ?? 0] ?? " "
        }
        ctx.fillText(line, this.ox, this.oy + row * atlas.ch + atlas.ch / 2, gridW)
      }
    }
    // Kolor obrazu wlany w kształt glifów (bez filtrów canvasu — są kosztowne).
    ctx.globalCompositeOperation = "source-in"
    ctx.drawImage(this.fill, 0, 0)
    ctx.globalCompositeOperation = "source-over"
  }

  /** Utajony wydruk: papier, obraz zmniejszony i powiększony z wygładzaniem (rozmycie), blady raster. */
  private renderLatent() {
    const latent = this.latent
    latent.width = this.dw
    latent.height = this.dh
    const ctx = latent.getContext("2d")
    const tiny = this.tiny
    tiny.width = Math.max(4, Math.round(this.dw / LATENT_BLUR))
    tiny.height = Math.max(3, Math.round(this.dh / LATENT_BLUR))
    const tctx = tiny.getContext("2d")
    if (!ctx || !tctx) return
    tctx.imageSmoothingQuality = "high"
    tctx.drawImage(this.fill, 0, 0, tiny.width, tiny.height)
    ctx.fillStyle = this.paper
    ctx.fillRect(0, 0, this.dw, this.dh)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"
    ctx.globalAlpha = LATENT_IMAGE
    ctx.drawImage(tiny, 0, 0, this.dw, this.dh)
    ctx.globalAlpha = LATENT_RASTER
    ctx.drawImage(this.prints[2], 0, 0)
    ctx.globalAlpha = 1
  }

  /** Prostokąt komórki; brzegowe obejmują margines — odsłonięcie sięga krawędzi. */
  private cellRect(i: number): [number, number, number, number] {
    const atlas = this.atlas as Atlas
    const col = i % this.cols
    const row = Math.floor(i / this.cols)
    const x = this.ox + col * atlas.cw
    const y = this.oy + row * atlas.ch
    const x0 = col === 0 ? 0 : x
    const y0 = row === 0 ? 0 : y
    const x1 = col === this.cols - 1 ? this.dw : x + atlas.cw
    const y1 = row === this.rows - 1 ? this.dh : y + atlas.ch
    return [x0, y0, x1 - x0, y1 - y0]
  }

  private schedule(wave: Wave) {
    const start = performance.now() + (wave.delay ?? 0) + wave.front
    const cols = this.cols
    const rows = this.rows
    for (let i = 0; i < this.due.length; i++) {
      const u = ((i % cols) + 0.5) / cols
      const v = (Math.floor(i / cols) + 0.5) / rows
      let t: number
      if (wave.origin === "left") t = u
      else if (wave.origin === "right") t = 1 - u
      else if (wave.origin === "top") t = v
      else {
        const px = wave.origin.x / Math.max(1, this.width)
        const py = wave.origin.y / Math.max(1, this.height)
        const reach = Math.max(
          Math.hypot(px, py),
          Math.hypot(1 - px, py),
          Math.hypot(px, 1 - py),
          Math.hypot(1 - px, 1 - py)
        )
        t = Math.hypot(u - px, (v - py) * (this.height / Math.max(1, this.width))) / reach
      }
      this.due[i] = start + t * wave.duration + Math.random() * wave.jitter
      this.revealed[i] = 0
    }
  }

  private paintGlyph(i: number, raster: boolean, alpha = 1) {
    const ctx = this.ctx
    if (!ctx) return
    const [x, y, w, h] = this.cellRect(i)
    if (alpha < 1) {
      ctx.clearRect(x, y, w, h)
      ctx.globalAlpha = alpha
    }
    // Tło komórki to utajony wydruk, nie gładki papier — front fali nie wycina dziur.
    ctx.drawImage(this.latent, x, y, w, h, x, y, w, h)
    const print = raster ? this.prints[2] : this.prints[Math.random() < 0.5 ? 0 : 1]
    ctx.drawImage(print, x, y, w, h, x, y, w, h)
    ctx.globalAlpha = 1
  }

  private readonly tick = (now: number) => {
    this.frame = 0
    const ctx = this.ctx
    if (!ctx) return
    let pending = false
    const rasterFrom = this.front * this.rasterShare
    for (let i = 0; i < this.due.length; i++) {
      if (this.revealed[i] === 1) continue
      pending = true
      const left = (this.due[i] ?? 0) - now
      if (this.encoding) {
        // Odwrotnie: migający kod, potem raster obrazu, który zostaje.
        if (left <= 0) {
          this.revealed[i] = 1
          this.paintGlyph(i, true)
        } else if (left <= this.front && Math.random() < 0.45) {
          this.paintGlyph(i, false)
        }
        continue
      }
      if (left <= -this.fade) {
        this.revealed[i] = 1
        ctx.clearRect(...this.cellRect(i))
      } else if (left <= -this.fade / 2) {
        // Miękka krawędź w dwóch krokach (65% → 30% krycia), każdy rysowany raz:
        // komórka gaśnie w obraz zamiast znikać w jednej klatce.
        if (this.revealed[i] !== 4) {
          this.revealed[i] = 4
          this.paintGlyph(i, this.rasterShare > 0, 0.3)
        }
      } else if (left <= 0) {
        if (this.revealed[i] !== 3) {
          this.revealed[i] = 3
          this.paintGlyph(i, this.rasterShare > 0, 0.65)
        }
      } else if (left <= rasterFrom) {
        // Druga część frontu: raster obrazu (stały) — sygnał tuż przed obrazem.
        if (this.revealed[i] !== 2) {
          this.revealed[i] = 2
          this.paintGlyph(i, true)
        }
      } else if (left <= this.front && Math.random() < 0.35) {
        // Pierwsza część frontu: migający kod.
        this.paintGlyph(i, false)
      }
    }
    if (pending) {
      this.frame = requestAnimationFrame(this.tick)
      return
    }
    // Po odkodowaniu canvas oddaje pamięć; zakodowany kadr zostaje na ekranie.
    if (!this.encoding) {
      this.canvas.width = 0
      this.canvas.height = 0
    }
    this.resolve?.()
    this.resolve = null
  }
}
