import {
  Mesh,
  Program,
  RenderTarget,
  Renderer,
  Texture,
  Triangle,
  type OGLRenderingContext,
} from "ogl"
import type { Mode, Variant } from "../lab/config"
import { getAtlas, loadCharsetFont, type Atlas, type Families } from "./atlas"
import { CHARSET_SPECS } from "./charsets"
import { CELL, GLYPH, TONE, VERTEX } from "./shaders"

/*
 * Silnik glifów: JEDEN kontekst WebGL2 na stronę (płótno poza DOM) i dowolnie
 * wiele powierzchni — każda to zwykły `<canvas>` 2D w przepływie strony, więc
 * nic nie „pływa” przy przewijaniu. Klatkę powierzchni liczy wspólny kontekst,
 * a `drawImage` kopiuje ją na jej płótno (GPU → GPU). Shadery kompilują się raz.
 *
 * Pętla jest jedna: renderuje tylko powierzchnie widoczne, które czegoś chcą
 * (ruch, zmiana ustawień), i zasypia, gdy wszystko stoi.
 */

export type SurfaceKind = "portrait" | "media" | "lens" | "mark" | "emblem"

const KIND: Record<SurfaceKind, number> = { portrait: 0, media: 1, lens: 2, mark: 3, emblem: 4 }
const MODE: Record<Mode, number> = { wave: 0, scramble: 1, rain: 2, flow: 3, dissolve: 4, scan: 5 }

export type Source =
  | {
      type: "image"
      image: HTMLImageElement | HTMLCanvasElement
      edge?: HTMLImageElement
      fit: "cover" | "contain"
      /** Wycinek źródła (uv: x0, y0, x1, y1) — kadr na twarz. */
      crop?: [number, number, number, number]
      /** Wygaszenie w dół (uv.y źródła): początek i koniec. */
      fade?: [number, number]
      /** Wygaszenie na boki (uv.x źródła): lewo od–do, prawo od–do. */
      fadeX?: [number, number, number, number]
      /** Poziomy czerni i bieli (0–1); bez nich liczone z obrazu. */
      levels?: [number, number]
      /** Obszar (uv), z którego liczymy poziomy — np. sama twarz, bez włosów i kurtki. */
      levelsRegion?: [number, number, number, number]
      /** Przyciemnienie krawędzi (0–1) — rysy twarzy wychodzą z tonu. */
      edgeBoost?: number
      /** Rozjaśnienie miejscowe (uv: x, y, promień x, promień y) i jego siła. */
      dodge?: [[number, number, number, number], [number, number, number, number]]
      dodgeAmount?: number
    }
  | { type: "video"; video: HTMLVideoElement; poster: HTMLImageElement; levels?: [number, number] }
  | { type: "text"; canvas: HTMLCanvasElement }
  | { type: "sdf"; shape: 0 | 1 | 2 }
  | { type: "none" }

export interface Palette {
  ink: [number, number, number]
  head: [number, number, number]
  /** Tło komórek (media zakrywają obraz papierem; reszta — przezroczyste). */
  paper: [number, number, number, number]
  /** 1 — tusz ciemniejszy od papieru (gęsto tam, gdzie obraz ciemny). */
  polarity: number
}

/** Stan zmieniany co klatkę przez opakowanie powierzchni (React). */
export interface Dynamics {
  progress: number
  loop: number
  intro: number
  lens: [number, number, number, number]
  ripple: [number, number, number, number]
  rotation: Float32Array
  from: [number, number]
}

interface Gpu {
  renderer: Renderer
  gl: OGLRenderingContext
  tone: Mesh
  cell: Mesh
  glyph: Mesh
  blank: Texture
  atlases: Map<Atlas, Texture>
  shapes: Map<Atlas, Texture>
}

const FADE_OFF: [number, number] = [2, 3]
const FADE_X_OFF: [number, number, number, number] = [-2, -1, 2, 3]

let gpu: Gpu | null | undefined
let families: Families | null = null
const surfaces = new Set<Surface>()
let frame = 0

function createGpu(): Gpu | null {
  if (typeof document === "undefined") return null
  try {
    const canvas = document.createElement("canvas")
    const renderer = new Renderer({
      canvas,
      webgl: 2,
      dpr: 1,
      alpha: true,
      premultipliedAlpha: true,
      depth: false,
      antialias: false,
      width: 4,
      height: 4,
      autoClear: false,
    })
    const gl = renderer.gl
    if (!renderer.isWebgl2) return null
    const geometry = new Triangle(gl)
    const blank = new Texture(gl, {
      image: new Uint8Array([0, 0, 0, 0]),
      width: 1,
      height: 1,
      generateMipmaps: false,
      flipY: false,
    })
    const tone = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: VERTEX,
        fragment: TONE,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uSrc: { value: blank },
          uEdge: { value: blank },
          uKind: { value: 3 },
          uRes: { value: [1, 1] },
          uMap: { value: [0, 0, 1, 1] },
          uSrcSize: { value: [1, 1] },
          uFade: { value: FADE_OFF },
          uFadeX: { value: FADE_X_OFF },
          uHasEdge: { value: 0 },
          uEdgeBoost: { value: 0 },
          uDodge: { value: [0, 0, 1, 1, 0, 0, 1, 1] },
          uDodgeK: { value: 0 },
          uAutoEdge: { value: 0 },
          uAspect: { value: 1 },
          uRot: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) },
          uShape: { value: 0 },
          uTime: { value: 0 },
        },
      }),
    })
    const cell = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: VERTEX,
        fragment: CELL,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTone: { value: blank },
          uShapes: { value: blank },
          uGrid: { value: [1, 1] },
          uCellPx: { value: [8, 13] },
          uOrigin: { value: [0, 0] },
          uRamp: { value: 1 },
          uLines: { value: 1 },
          uDither: { value: 0 },
          uMatch: { value: 0 },
          uRandom: { value: 0 },
          uCurve: { value: [0, 1] },
          uTime: { value: 0 },
          uStep: { value: 0 },
          uFps: { value: 24 },
          uMode: { value: 0 },
          uKind: { value: 0 },
          uProgress: { value: 0 },
          uFrom: { value: [0, 0] },
          uReach: { value: 1 },
          uPolarity: { value: 1 },
          uLevels: { value: [0, 1, 1] },
          uCeil: { value: 1 },
          uDGamma: { value: 1 },
          uSharp: { value: 0 },
          uAlphaTone: { value: 0 },
          uLens: { value: [0, 0, 0, 0] },
          uLensMode: { value: 0 },
          uRipple: { value: [0, 0, 0, 0] },
          uRender: { value: 0 },
          uFlicker: { value: 0 },
          uIntro: { value: 1 },
          uLoop: { value: -1 },
          uEdgeInk: { value: 0 },
          uFloor: { value: 0 },
        },
      }),
    })
    const glyph = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: VERTEX,
        fragment: GLYPH,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uAtlas: { value: blank },
          uCellA: { value: blank },
          uCellB: { value: blank },
          uCell: { value: [8, 13] },
          uColumns: { value: 32 },
          uGrid: { value: [1, 1] },
          uOrigin: { value: [0, 0] },
          uSize: { value: [1, 1] },
          uInk: { value: [0, 0, 0] },
          uHead: { value: [0, 0, 0] },
          uPaper: { value: [0, 0, 0, 0] },
          uPaperOut: { value: 0 },
          uPhoto: { value: 0 },
          uSrc: { value: blank },
          uMap: { value: [0, 0, 1, 1] },
          uLevels: { value: [0, 1, 1] },
          uPolarity: { value: 1 },
          uVeil: { value: 0 },
        },
      }),
    })
    return { renderer, gl, tone, cell, glyph, blank, atlases: new Map(), shapes: new Map() }
  } catch {
    return null
  }
}

function getGpu(): Gpu | null {
  if (gpu === undefined) gpu = createGpu()
  return gpu
}

export function engineAvailable(): boolean {
  return getGpu() !== null
}

export function setFamilies(value: Families) {
  families = value
}

function atlasTexture(g: Gpu, atlas: Atlas): Texture {
  let texture = g.atlases.get(atlas)
  if (!texture) {
    texture = new Texture(g.gl, {
      image: atlas.canvas,
      generateMipmaps: false,
      minFilter: g.gl.NEAREST,
      magFilter: g.gl.NEAREST,
      flipY: false,
    })
    g.atlases.set(atlas, texture)
  }
  return texture
}

function shapeTexture(g: Gpu, atlas: Atlas): Texture {
  let texture = g.shapes.get(atlas)
  if (!texture) {
    texture = new Texture(g.gl, {
      image: atlas.shapes,
      width: Math.max(1, atlas.ramp),
      height: 2,
      generateMipmaps: false,
      minFilter: g.gl.NEAREST,
      magFilter: g.gl.NEAREST,
      flipY: false,
    })
    g.shapes.set(atlas, texture)
  }
  return texture
}

/** Poziomy czerni i bieli obrazu (2. i 98. percentyl luminancji pod maską). */
export function measureLevels(
  image: CanvasImageSource,
  width: number,
  height: number,
  region: [number, number, number, number] = [0, 0, 1, 1]
): [number, number, number] {
  const canvas = document.createElement("canvas")
  const w = 64
  const h = Math.max(1, Math.round((64 * height) / Math.max(1, width)))
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return [0, 1, 0.5]
  ctx.drawImage(image, 0, 0, w, h)
  let data: Uint8ClampedArray
  try {
    data = ctx.getImageData(0, 0, w, h).data
  } catch {
    return [0, 1, 0.5]
  }
  const values: number[] = []
  const [rx0, ry0, rx1, ry1] = region
  for (let i = 0; i < w * h; i++) {
    const x = (i % w) / w
    const y = Math.floor(i / w) / h
    if (x < rx0 || x > rx1 || y < ry0 || y > ry1) continue
    if ((data[i * 4 + 3] ?? 0) < 128) continue
    values.push(
      (0.2126 * (data[i * 4] ?? 0) +
        0.7152 * (data[i * 4 + 1] ?? 0) +
        0.0722 * (data[i * 4 + 2] ?? 0)) /
        255
    )
  }
  if (values.length < 16) return [0, 1, 0.5]
  values.sort((a, b) => a - b)
  const lo = values[Math.floor(values.length * 0.02)] ?? 0
  const hi = values[Math.floor(values.length * 0.98)] ?? 1
  const mid = values[Math.floor(values.length / 2)] ?? 0.5
  return [lo, hi, (mid - lo) / Math.max(0.04, hi - lo)]
}

function sourceSize(source: Source): [number, number] {
  if (source.type === "image") {
    const image = source.image
    return image instanceof HTMLImageElement
      ? [image.naturalWidth || 1, image.naturalHeight || 1]
      : [image.width || 1, image.height || 1]
  }
  if (source.type === "video") {
    const v = source.video
    if (v.videoWidth) return [v.videoWidth, v.videoHeight]
    return [source.poster.naturalWidth || 1, source.poster.naturalHeight || 1]
  }
  if (source.type === "text") return [source.canvas.width || 1, source.canvas.height || 1]
  return [1, 1]
}

export class Surface {
  readonly kind: SurfaceKind
  readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D | null
  variant: Variant
  palette: Palette = { ink: [0.09, 0.09, 0.09], head: [0, 0, 0], paper: [0, 0, 0, 0], polarity: 1 }
  dyn: Dynamics = {
    progress: 0,
    loop: -1,
    intro: 1,
    lens: [0, 0, 0, 0],
    ripple: [0, 0, 0, 0],
    rotation: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
    from: [0, 0],
  }
  /** Ruch automatyczny (czas płynie); bez niego klatka powstaje tylko na żądanie. */
  animate = false
  visible = false
  /** Opakowanie aktualizuje `dyn` przed klatką; zwraca, czy chce kolejnej klatki płynnie (60). */
  private onFrame: ((now: number, dyn: Dynamics) => boolean) | null = null
  gamma = 1
  /** Najwyższa gęstość tuszu (0–1). */
  ceil = 1
  /** Najmniejsza liczba rzędów siatki (znak w stopce na wąskim ekranie). */
  minRows = 0
  /** Mnożnik komórki (portret w zestawach „glif = komórka” — drobniej, więcej kolumn twarzy). */
  cellScale = 1
  /** Krycie niesie ton (nadpisuje wartość zestawu), `null` — jak w zestawie. */
  alphaTone: number | null = null
  /** Przyciemnienie krawędzi rysów (nadpisuje źródło), `null` — jak w źródle. */
  edgeBoost: number | null = null
  /** Krzywa gęstości zestawu (false — ton jak w Braille'u, bez przycinania jasnych partii). */
  curve = true
  /** Glif losowy z tonem w kryciu (nadpisuje zestaw), `null` — jak w zestawie. */
  random: boolean | null = null
  /** Media: krawędzie z gradientu obrazu (siła), ich udział w tuszu i najmniejsze pokrycie. */
  autoEdge = 0
  edgeInk = 0
  floor = 0
  /** Media: spoczynek „obraz” — przygaszony obraz i glify w jego kolorze (0–1). */
  veil = 0
  dgamma = 1
  sharp = 0
  flicker = 0

  private source: Source = { type: "none" }
  private levels: [number, number] = [0, 1]
  /** Mediana tonu (po poziomach): jasny zrzut strony czy ciemny kadr wideo. */
  private median = 0.5
  private width = 0
  private height = 0
  private dpr = 1
  private dirty = true
  private toneDirty = true
  private smooth = false
  private lastStep = -1
  private ready = false
  private srcTexture: Texture | null = null
  private edgeTexture: Texture | null = null
  private target: RenderTarget | null = null
  private cellTarget: RenderTarget | null = null
  private atlas: Atlas | null = null
  private grid: [number, number] = [1, 1]
  private origin: [number, number] = [0, 0]
  private clock = 0
  private lastNow = 0
  private videoFrame = 0
  private frameWants = false
  /** Przesunięcie kroków w czasie — powierzchnie nie liczą się wszystkie w tej samej klatce. */
  private readonly phase = Math.random()
  private parked = false
  private videoWanted = false
  /** Bez źródła nie ma czego rysować (obraz jeszcze się wczytuje, ograniczony ruch). */
  private hasSource = false
  private rendered = false
  private onRendered: (() => void) | null = null

  constructor(kind: SurfaceKind, canvas: HTMLCanvasElement, variant: Variant) {
    this.kind = kind
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.variant = variant
    surfaces.add(this)
    void this.prepare()
  }

  /** Ustawienia renderu (opakowania nie zmieniają pól wprost — wymóg kompilatora Reacta). */
  configure(options: {
    animate?: boolean
    flicker?: number
    gamma?: number
    ceil?: number
    dgamma?: number
    minRows?: number
    sharp?: number
    cellScale?: number
    alphaTone?: number | null
    edgeBoost?: number | null
    curve?: boolean
    random?: boolean | null
    autoEdge?: number
    veil?: number
    edgeInk?: number
    floor?: number
  }) {
    Object.assign(this, options)
    if (options.minRows !== undefined || options.cellScale !== undefined) this.layout()
    if (options.edgeBoost !== undefined || options.autoEdge !== undefined) this.toneDirty = true
    this.invalidate()
  }

  /** Wywołuje `callback` po pierwszej narysowanej klatce (przenikanie ze zdjęciem zastępczym). */
  whenRendered(callback: () => void) {
    if (this.rendered) callback()
    else this.onRendered = callback
  }

  setFrame(callback: ((now: number, dyn: Dynamics) => boolean) | null) {
    this.onFrame = callback
    this.invalidate()
  }

  /** Czas powierzchni w sekundach (stoi, gdy ruch automatyczny jest wyłączony). */
  get time() {
    return this.clock
  }

  get size() {
    return { width: this.width, height: this.height, dpr: this.dpr }
  }

  get cells() {
    return {
      grid: this.grid,
      origin: this.origin,
      cw: this.atlas?.cw ?? 1,
      ch: this.atlas?.ch ?? 1,
    }
  }

  private async prepare() {
    if (!families) return
    this.ready = false
    const charset = this.variant.charset
    await loadCharsetFont(charset, families)
    if (this.variant.charset !== charset) return
    this.ready = true
    this.layout()
    this.invalidate()
  }

  setVariant(variant: Variant) {
    const before = this.variant
    this.variant = variant
    if (before.charset !== variant.charset) {
      void this.prepare()
      return
    }
    if (before.cell !== variant.cell) this.layout()
    this.invalidate()
  }

  setPalette(palette: Palette) {
    this.palette = palette
    this.invalidate()
  }

  setSource(source: Source) {
    const g = getGpu()
    this.source = source
    this.hasSource = true
    if (!g) return
    this.disposeSource()
    if (source.type === "image") {
      this.srcTexture = new Texture(g.gl, {
        image: source.image,
        generateMipmaps: true,
        minFilter: g.gl.LINEAR_MIPMAP_LINEAR,
        magFilter: g.gl.LINEAR,
        flipY: false,
        premultiplyAlpha: true,
      })
      if (source.edge) {
        this.edgeTexture = new Texture(g.gl, {
          image: source.edge,
          generateMipmaps: true,
          minFilter: g.gl.LINEAR_MIPMAP_LINEAR,
          flipY: false,
          premultiplyAlpha: true,
        })
      }
      const [w, h] = sourceSize(source)
      const [lo, hi, median] = measureLevels(source.image, w, h, source.levelsRegion)
      this.levels = source.levels ?? [lo, hi]
      this.median = median
    } else if (source.type === "video") {
      this.srcTexture = new Texture(g.gl, {
        image: source.poster,
        generateMipmaps: true,
        minFilter: g.gl.LINEAR_MIPMAP_LINEAR,
        flipY: false,
        premultiplyAlpha: true,
      })
      const [w, h] = sourceSize(source)
      const [lo, hi, median] = measureLevels(source.poster, w, h)
      this.levels = source.levels ?? [lo, hi]
      this.median = median
    } else if (source.type === "text") {
      this.srcTexture = new Texture(g.gl, {
        image: source.canvas,
        generateMipmaps: true,
        minFilter: g.gl.LINEAR_MIPMAP_LINEAR,
        flipY: false,
        premultiplyAlpha: true,
      })
      this.levels = [0, 1]
    } else {
      this.levels = [0, 1]
    }
    this.layout()
    this.toneDirty = true
    this.invalidate()
  }

  /**
   * Uśpienie: odkodowane media nie mają czego rysować — płótno i tekstura źródła
   * oddają pamięć. `wakeUp` przywraca je przy kolejnym kodowaniu.
   */
  park() {
    if (this.parked) return
    this.parked = true
    this.disposeSource()
    this.canvas.width = 0
    this.canvas.height = 0
  }

  wakeUp() {
    if (!this.parked) return
    this.parked = false
    this.setSource(this.source)
    this.layout()
    this.invalidate()
  }

  /** Przełącza źródło wideo: klatki filmu (gdy gra i ma już obraz) albo plakat. */
  useVideoFrames(on: boolean) {
    this.videoWanted = on
    this.invalidate()
  }

  private syncVideo() {
    if (this.source.type !== "video" || !this.srcTexture) return
    const video = this.source.video
    const image = this.videoWanted && video.readyState >= 2 ? video : this.source.poster
    if (this.srcTexture.image !== image) {
      this.srcTexture.image = image
      this.srcTexture.needsUpdate = true
      this.toneDirty = true
      this.dirty = true
    }
  }

  resize(width: number, height: number, dpr: number) {
    if (width === this.width && height === this.height && dpr === this.dpr) return
    this.width = width
    this.height = height
    this.dpr = dpr
    this.layout()
    this.invalidate()
  }

  setVisible(visible: boolean) {
    this.visible = visible
    if (visible) wake()
  }

  /** Następna klatka powstanie mimo braku ruchu (zmiana ustawień, motywu, stanu). */
  invalidate() {
    this.dirty = true
    wake()
  }

  /** Klatka liczona płynnie (60/s) aż do kolejnego wywołania z `false`. */
  setSmooth(smooth: boolean) {
    this.smooth = smooth
    if (smooth) wake()
  }

  private layout() {
    if (!families || !this.ready || !this.width || !this.height) return
    // Komórka w px urządzenia (liczby całkowite — bez szwów między glifami).
    let cell: number = this.variant.cell * this.cellScale
    if (this.minRows) cell = Math.max(3.5, Math.min(cell, this.height / (this.minRows * 1.6)))
    const cw = Math.max(4, Math.round(cell * this.dpr))
    const ch = Math.round(cw * 1.6)
    this.atlas = getAtlas(this.variant.charset, cw, ch, families)
    const W = Math.round(this.width * this.dpr)
    const H = Math.round(this.height * this.dpr)
    if (this.canvas.width !== W || this.canvas.height !== H) {
      this.canvas.width = W
      this.canvas.height = H
    }
    const cols = Math.max(1, Math.floor(W / cw))
    const rows = Math.max(1, Math.floor(H / ch))
    this.grid = [cols, rows]
    this.origin = [Math.floor((W - cols * cw) / 2), Math.floor((H - rows * ch) / 2)]
    const g = getGpu()
    if (!g) return
    // Ton: 2 × 4 pod-komórki na komórkę (kształt glifu, punkty Braille’a, lupa). Bryły
    // liczone w shaderze przy rampie tonalnej wystarczą w 1 × 2 (raymarching co klatkę).
    const spec = CHARSET_SPECS[this.variant.charset]
    const coarseTone = this.source.type === "sdf" && !spec.dither && !spec.match
    const tw = cols * (coarseTone ? 1 : 2)
    const th = rows * (coarseTone ? 2 : 4)
    if (!this.target || this.target.width !== tw || this.target.height !== th) {
      this.disposeTarget()
      this.target = new RenderTarget(g.gl, { width: tw, height: th, depth: false })
    }
    if (!this.cellTarget || this.cellTarget.width !== cols || this.cellTarget.height !== rows) {
      this.disposeCells()
      this.cellTarget = new RenderTarget(g.gl, {
        width: cols,
        height: rows,
        color: 2,
        depth: false,
        minFilter: g.gl.NEAREST,
        magFilter: g.gl.NEAREST,
      })
    }
    this.toneDirty = true
  }

  /** Wywoływane przez pętlę: czy ta powierzchnia potrzebuje klatki teraz. */
  wants(now: number): boolean {
    if (!this.visible || !this.ready || !this.atlas || !this.width || this.parked) return false
    if (!this.hasSource) return false
    const dt = this.lastNow ? Math.min(0.1, (now - this.lastNow) / 1000) : 0
    this.lastNow = now
    // Czas płynie przy ruchu automatycznym albo w trakcie przejścia (miganie pasma).
    if (this.animate || this.frameWants || this.smooth) this.clock += dt
    this.frameWants = this.onFrame ? this.onFrame(now, this.dyn) : false
    let smooth = this.smooth || this.frameWants
    const step = Math.floor(this.clock * this.variant.fps + this.phase)
    const stepped = this.animate && step !== this.lastStep
    this.syncVideo()
    if (this.source.type === "video" && this.srcTexture?.image === this.source.video) {
      const v = this.source.video
      if (v.readyState >= 2 && !v.paused) {
        this.videoFrame++
        if (this.videoFrame % 2 === 0) {
          this.srcTexture.needsUpdate = true
          this.toneDirty = true
          smooth = true
        }
      }
    }
    if (this.source.type === "sdf" && (this.animate || smooth || this.dirty)) this.toneDirty = true
    return this.dirty || smooth || stepped
  }

  /** Czy pętla ma się dalej kręcić dla tej powierzchni. */
  get busy() {
    return (
      this.visible &&
      this.ready &&
      this.hasSource &&
      !this.parked &&
      (this.animate || this.smooth || this.frameWants || this.dirty)
    )
  }

  render() {
    const g = getGpu()
    const atlas = this.atlas
    const target = this.target
    if (!g || !atlas || !target || !this.ctx) return
    const W = this.canvas.width
    const H = this.canvas.height
    this.dirty = false
    this.lastStep = Math.floor(this.clock * this.variant.fps + this.phase)
    const spec = CHARSET_SPECS[this.variant.charset]
    const [cols, rows] = this.grid
    const gridW = cols * atlas.cw
    const gridH = rows * atlas.ch
    const map = this.mapping(gridW, gridH)

    if (this.toneDirty) {
      this.toneDirty = false
      const u = g.tone.program.uniforms
      const kind = this.source.type
      u.uKind.value =
        kind === "image" || kind === "video" ? 0 : kind === "text" ? 1 : kind === "sdf" ? 2 : 3
      u.uSrc.value = this.srcTexture ?? g.blank
      u.uEdge.value = this.edgeTexture ?? g.blank
      u.uHasEdge.value = this.edgeTexture ? 1 : 0
      const image = this.source.type === "image" ? this.source : null
      u.uEdgeBoost.value = this.edgeBoost ?? image?.edgeBoost ?? 0
      u.uAutoEdge.value = this.autoEdge
      u.uDodge.value = image?.dodge ? image.dodge.flat() : [0, 0, 1, 1, 0, 0, 1, 1]
      u.uDodgeK.value = image?.dodge ? (image.dodgeAmount ?? 0.3) : 0
      u.uRes.value = [target.width, target.height]
      u.uMap.value = map
      u.uSrcSize.value = sourceSize(this.source)
      u.uFade.value = this.source.type === "image" && this.source.fade ? this.source.fade : FADE_OFF
      u.uFadeX.value = image?.fadeX ?? FADE_X_OFF
      u.uAspect.value = gridW / gridH
      u.uRot.value = this.dyn.rotation
      u.uShape.value = this.source.type === "sdf" ? this.source.shape : 0
      u.uTime.value = this.clock
      g.renderer.bindFramebuffer(target)
      g.renderer.setViewport(target.width, target.height)
      g.tone.draw()
    }

    const cells = this.cellTarget
    if (!cells) return
    const c = g.cell.program.uniforms
    c.uTone.value = target.texture
    c.uShapes.value = spec.match ? shapeTexture(g, atlas) : g.blank
    c.uGrid.value = this.grid
    c.uCellPx.value = [atlas.cw, atlas.ch]
    c.uOrigin.value = this.origin
    c.uRamp.value = atlas.ramp
    c.uLines.value = atlas.lines
    c.uDither.value = spec.dither ? 1 : 0
    c.uMatch.value = spec.match ? 1 : 0
    c.uRandom.value = (this.random ?? spec.random) ? 1 : 0
    c.uCurve.value = this.curve ? spec.curve : [0, 1]
    c.uTime.value = this.clock
    c.uStep.value = Math.floor(this.clock * this.variant.fps + this.phase)
    c.uFps.value = this.variant.fps
    c.uMode.value = MODE[this.variant.mode]
    c.uKind.value = KIND[this.kind]
    c.uProgress.value = this.dyn.progress
    c.uFrom.value = this.dyn.from
    c.uReach.value = this.reach()
    c.uPolarity.value = this.polarity()
    c.uLevels.value = [this.levels[0], this.levels[1], this.gamma]
    c.uCeil.value = this.ceil
    c.uDGamma.value = this.dgamma
    c.uSharp.value = this.sharp
    c.uAlphaTone.value = this.alphaTone ?? spec.alphaTone
    c.uLens.value = this.dyn.lens
    c.uLensMode.value =
      this.variant.cursor === "loupe" ? 0 : this.variant.cursor === "reveal" ? 1 : 2
    c.uRipple.value = this.dyn.ripple
    c.uRender.value = this.variant.render === "tone" ? 0 : this.variant.render === "contour" ? 1 : 2
    c.uFlicker.value = this.flicker
    c.uIntro.value = this.dyn.intro
    c.uLoop.value = this.dyn.loop
    c.uEdgeInk.value = this.edgeInk
    c.uFloor.value = this.floor
    g.renderer.bindFramebuffer(cells)
    g.renderer.setViewport(cols, rows)
    g.cell.draw()

    if (g.renderer.width < W || g.renderer.height < H) {
      g.renderer.setSize(Math.max(W, g.renderer.width), Math.max(H, g.renderer.height))
    }
    const u = g.glyph.program.uniforms
    u.uAtlas.value = atlasTexture(g, atlas)
    u.uCellA.value = cells.textures[0]
    u.uCellB.value = cells.textures[1]
    u.uCell.value = [atlas.cw, atlas.ch]
    u.uColumns.value = atlas.columns
    u.uGrid.value = this.grid
    u.uOrigin.value = this.origin
    u.uSize.value = [W, H]
    u.uInk.value = this.palette.ink
    u.uHead.value = this.palette.head
    u.uPaper.value = this.palette.paper
    u.uPaperOut.value = this.kind === "media" ? 1 : 0
    u.uPhoto.value = this.kind === "portrait" && this.variant.cursor === "reveal" ? 1 : 0
    u.uSrc.value = this.srcTexture ?? g.blank
    u.uMap.value = map
    u.uLevels.value = [this.levels[0], this.levels[1], this.gamma]
    u.uPolarity.value = this.polarity()
    // Zasłona: na jasnym papierze 58% krycia, na ciemnym 38% (obraz nie szarzeje).
    const [pr, pg, pb] = this.palette.paper
    const darkPaper = 0.2126 * pr + 0.7152 * pg + 0.0722 * pb < 0.5
    u.uVeil.value = this.kind === "media" ? this.veil * (darkPaper ? 0.62 : 0.42) : 0

    g.renderer.bindFramebuffer()
    g.renderer.setViewport(W, H)
    g.gl.clearColor(0, 0, 0, 0)
    g.gl.clear(g.gl.COLOR_BUFFER_BIT)
    g.glyph.draw()
    this.ctx.globalCompositeOperation = "copy"
    this.ctx.drawImage(
      g.gl.canvas as HTMLCanvasElement,
      0,
      g.gl.canvas.height - H,
      W,
      H,
      0,
      0,
      W,
      H
    )
    if (!this.rendered) {
      this.rendered = true
      this.onRendered?.()
      this.onRendered = null
    }
  }

  /**
   * Polaryzacja wydruku: glify trafiają w ton MNIEJSZOŚCIOWY obrazu. Jasny zrzut
   * strony — glify tam, gdzie ciemno; ciemny kadr wideo — tam, gdzie jasno.
   * Wydruk jest wtedy lekki w obu motywach, a nie ścianą znaków.
   */
  private polarity() {
    // Maska tekstu niesie pokrycie liter — gęsto zawsze tam, gdzie litera.
    if (this.kind === "mark") return 0
    if (this.kind !== "media") return this.palette.polarity
    if (this.median > 0.58) return 1
    if (this.median < 0.42) return 0
    return this.palette.polarity
  }

  /** Odległość od początku fali do najdalszego rogu siatki (w szerokościach komórki). */
  private reach() {
    const atlas = this.atlas
    if (!atlas) return 1
    const [cols, rows] = this.grid
    const k = atlas.ch / atlas.cw
    const x = this.dyn.from[0]
    const y = this.dyn.from[1] * k
    const w = cols
    const h = rows * k
    return Math.max(
      Math.hypot(x, y),
      Math.hypot(w - x, y),
      Math.hypot(x, h - y),
      Math.hypot(w - x, h - y)
    )
  }

  /** Mapa obszaru siatki na uv źródła (object-fit: cover/contain). */
  private mapping(gridW: number, gridH: number): [number, number, number, number] {
    const W = this.canvas.width
    const H = this.canvas.height
    const [sw, sh] = sourceSize(this.source)
    const crop = this.source.type === "image" ? (this.source.crop ?? [0, 0, 1, 1]) : [0, 0, 1, 1]
    const [cx0 = 0, cy0 = 0, cx1 = 1, cy1 = 1] = crop
    const iw = sw * (cx1 - cx0)
    const ih = sh * (cy1 - cy0)
    const fit = this.source.type === "image" ? this.source.fit : "cover"
    const scale = fit === "contain" ? Math.min(W / iw, H / ih) : Math.max(W / iw, H / ih)
    const rw = iw * scale
    const rh = ih * scale
    const rx = (W - rw) / 2
    const ry = (H - rh) / 2
    const [ox, oy] = this.origin
    // uv obszaru siatki w kadrze, potem kadr w uv całego źródła.
    const u0 = (ox - rx) / rw
    const v0 = (oy - ry) / rh
    const kx = cx1 - cx0
    const ky = cy1 - cy0
    return [cx0 + u0 * kx, cy0 + v0 * ky, (gridW / rw) * kx, (gridH / rh) * ky]
  }

  private disposeSource() {
    const g = getGpu()
    if (!g) return
    if (this.srcTexture) g.gl.deleteTexture(this.srcTexture.texture)
    if (this.edgeTexture) g.gl.deleteTexture(this.edgeTexture.texture)
    this.srcTexture = null
    this.edgeTexture = null
  }

  private disposeCells() {
    const g = getGpu()
    if (!g || !this.cellTarget) return
    g.gl.deleteFramebuffer(this.cellTarget.buffer)
    this.cellTarget.textures.forEach((texture) => g.gl.deleteTexture(texture.texture))
    this.cellTarget = null
  }

  private disposeTarget() {
    const g = getGpu()
    if (!g || !this.target) return
    g.gl.deleteFramebuffer(this.target.buffer)
    this.target.textures.forEach((texture) => g.gl.deleteTexture(texture.texture))
    this.target = null
  }

  destroy() {
    surfaces.delete(this)
    this.disposeSource()
    this.disposeTarget()
    this.disposeCells()
    this.onFrame = null
    this.canvas.width = 0
    this.canvas.height = 0
  }
}

/* ——— pętla ——— */

function wake() {
  if (frame || typeof window === "undefined") return
  frame = requestAnimationFrame(tick)
}

function tick(now: number) {
  frame = 0
  if (document.hidden) return
  let busy = false
  for (const surface of surfaces) {
    if (surface.wants(now)) surface.render()
    if (surface.busy) busy = true
  }
  if (busy) frame = requestAnimationFrame(tick)
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) wake()
  })
}
