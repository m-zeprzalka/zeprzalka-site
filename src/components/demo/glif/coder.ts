import { ADVANCE, buildAtlas, type Atlas } from "./atlas"
import { luminance, measureRamp, printLevels } from "./print"

/*
 * Koder obrazu: zanim kafel (realizacja, okładka) zostanie zobaczony, leży na
 * nim jego „wydruk z glifów” (monochrom na papierze). Przy pierwszym spojrzeniu
 * wydruk rozpuszcza się falą i obraz zostaje w kolorze na stałe — canvas jest
 * wtedy zwalniany (0×0, bez pamięci i bez rysowania). Najechanie na odkodowany
 * kafel puszcza krótki „przebieg” glifów jako akcent, bez powrotu do szumu.
 *
 * Wydruk liczony jest raz do osobnej bitmapy (papier + glify); w trakcie fali
 * komórka to tylko `clearRect` albo kopia z bitmapy — bez przeliczania obrazu.
 */

const DECODE = { duration: 420, jitter: 110, front: 80 }
/** Przebieg: fala przez kafel w 360 ms, każda komórka zakryta glifem przez 70 ms. */
const SHIMMER = { duration: 360, hold: 70 }

interface PrintAtlas extends Atlas {
  /** Zmierzona rampa wydruku (indeksy glifów od najjaśniejszego). */
  ramp: number[]
}

/** Atlasy (z rampą) współdzielone przez wszystkie kafle o tym samym rozmiarze komórki i kolorze. */
const atlases = new Map<string, PrintAtlas>()

function sharedAtlas(family: string, cellW: number, cellH: number, dpr: number, ink: string) {
  const key = `${family}|${cellW.toFixed(2)}|${dpr}|${ink}`
  let atlas = atlases.get(key)
  if (!atlas) {
    const base = buildAtlas(family, cellW, cellH, dpr, ink)
    atlas = { ...base, ramp: measureRamp(base) }
    atlases.set(key, atlas)
  }
  return atlas
}

/** Szerokość komórki (px): gęściej na dużym kaflu, nie drobniej niż 6 px na telefonie. */
function cellWidth(tileWidth: number): number {
  return tileWidth >= 300 ? Math.min(8.5, Math.max(7, tileWidth / 56)) : 6
}

export interface CoderTheme {
  /** Glify wydruku (ink-2) i papier (fm-fill) — miękki wydruk, kolor dopiero po odkodowaniu. */
  ink: string
  paper: string
  /** Ciemny motyw: jasne glify na ciemnym papierze. */
  dark: boolean
}

type State = "coded" | "decoding" | "decoded" | "shimmer"

export class ImageCoder {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D | null
  private readonly family: string
  private readonly onDecode: () => void
  private image: CanvasImageSource | null = null
  private atlas: PrintAtlas | null = null
  private theme: CoderTheme = { ink: "#525252", paper: "#f4f4f4", dark: false }

  private width = 0
  private height = 0
  private dpr = 1
  private cols = 0
  private rows = 0
  private originX = 0
  private originY = 0
  private deviceWidth = 0
  private deviceHeight = 0

  /** Gotowy wydruk (papier + glify) w pikselach kafla. */
  private print: HTMLCanvasElement | null = null
  /** 1 = komórka jeszcze zakryta (fala) albo pod glifem (przebieg). */
  private covered = new Uint8Array(0)
  private due = new Float64Array(0)
  private state: State = "coded"
  private frame = 0

  constructor(canvas: HTMLCanvasElement, family: string, onDecode: () => void = () => {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.family = family
    this.onDecode = onDecode
  }

  get decoded() {
    return this.state !== "coded"
  }

  setImage(image: CanvasImageSource) {
    this.image = image
    this.rebuild()
  }

  resize(width: number, height: number, dpr: number) {
    if (width === this.width && height === this.height && dpr === this.dpr) return
    this.width = width
    this.height = height
    this.dpr = dpr
    this.rebuild()
  }

  setTheme(theme: CoderTheme) {
    const same =
      theme.ink === this.theme.ink &&
      theme.paper === this.theme.paper &&
      theme.dark === this.theme.dark
    this.theme = theme
    if (!same || !this.atlas) this.rebuild()
  }

  /** Odsłania obraz falą od punktu (x, y) w px kafla — raz i na stałe; `instant` — bez fali. */
  decode(x: number, y: number, instant = false) {
    if (this.state !== "coded") return
    this.onDecode()
    if (instant || !this.covered.length) {
      this.release()
      return
    }
    this.state = "decoding"
    this.schedule(x, y, DECODE.duration, DECODE.jitter, DECODE.front)
    this.covered.fill(1)
    this.frame = requestAnimationFrame(this.tick)
  }

  /** Krótki przebieg glifów przez odkodowany kafel (akcent po najechaniu). */
  shimmer(x: number, y: number) {
    if (this.state !== "decoded") return
    this.layout()
    if (!this.atlas || !this.covered.length) return
    this.canvas.width = this.deviceWidth
    this.canvas.height = this.deviceHeight
    this.state = "shimmer"
    this.schedule(x, y, SHIMMER.duration, 30, 0)
    this.covered.fill(0)
    this.frame = requestAnimationFrame(this.tick)
  }

  destroy() {
    cancelAnimationFrame(this.frame)
    this.frame = 0
  }

  /* ——— układ i wydruk ——— */

  private layout() {
    if (!this.width || !this.height) return
    const cellW = cellWidth(this.width)
    this.atlas = sharedAtlas(this.family, cellW, (cellW / ADVANCE) * 0.96, this.dpr, this.theme.ink)
    const { cw, ch } = this.atlas
    this.deviceWidth = Math.round(this.width * this.dpr)
    this.deviceHeight = Math.round(this.height * this.dpr)
    // Siatka mieści się w kaflu w całości i stoi pośrodku: równy margines (≥ pół komórki), żadnych uciętych rzędów.
    const margin = Math.max(cw / 2, 4 * this.dpr)
    this.cols = Math.max(1, Math.floor((this.deviceWidth - 2 * margin) / cw))
    this.rows = Math.max(1, Math.floor((this.deviceHeight - 2 * margin) / ch))
    this.originX = Math.round((this.deviceWidth - this.cols * cw) / 2)
    this.originY = Math.round((this.deviceHeight - this.rows * ch) / 2)
    const count = this.cols * this.rows
    if (this.covered.length !== count) {
      this.covered = new Uint8Array(count)
      this.due = new Float64Array(count)
    }
  }

  private rebuild() {
    // Odkodowany kafel nie ma już czego rysować — wymiary przydadzą się tylko przebiegowi.
    if (this.state !== "coded" || !this.image || !this.width || !this.height) return
    this.layout()
    this.print = this.renderPrint()
    if (!this.print || !this.ctx) return
    this.canvas.width = this.deviceWidth
    this.canvas.height = this.deviceHeight
    this.ctx.drawImage(this.print, 0, 0)
  }

  /** Obraz → wydruk: próbka wycinka pod siatką, tonowanie (`print.ts`), glify na papierze. */
  private renderPrint(): HTMLCanvasElement | null {
    const atlas = this.atlas
    const image = this.image
    if (!atlas || !image || atlas.ramp.length === 0) return null
    const count = this.cols * this.rows

    // Najpierw cały obraz w pikselach kafla (połowa rozdzielczości), potem wycinek pod siatką.
    // `naturalWidth` obrazu z `srcset` jest korygowany gęstością i nie odpowiada pikselom pliku.
    const full = document.createElement("canvas")
    full.width = Math.max(1, Math.round(this.deviceWidth / 2))
    full.height = Math.max(1, Math.round(this.deviceHeight / 2))
    const fullCtx = full.getContext("2d")
    const sample = document.createElement("canvas")
    sample.width = this.cols
    sample.height = this.rows
    const sampleCtx = sample.getContext("2d", { willReadFrequently: true })
    if (!fullCtx || !sampleCtx) return null
    fullCtx.imageSmoothingQuality = "high"
    fullCtx.drawImage(image, 0, 0, full.width, full.height)
    sampleCtx.imageSmoothingQuality = "high"
    sampleCtx.drawImage(
      full,
      this.originX / 2,
      this.originY / 2,
      (this.cols * atlas.cw) / 2,
      (this.rows * atlas.ch) / 2,
      0,
      0,
      this.cols,
      this.rows
    )
    let data: Uint8ClampedArray
    try {
      data = sampleCtx.getImageData(0, 0, this.cols, this.rows).data
    } catch {
      return null // obraz z innej domeny — zostaje sam obraz
    }
    const levels = printLevels(luminance(data, count), this.cols, this.rows, this.theme.dark)

    const print = document.createElement("canvas")
    print.width = this.deviceWidth
    print.height = this.deviceHeight
    const ctx = print.getContext("2d")
    if (!ctx) return null
    ctx.fillStyle = this.theme.paper
    ctx.fillRect(0, 0, print.width, print.height)
    for (let i = 0; i < count; i++) {
      const level = levels[i] ?? 0
      const glyph = level ? (atlas.ramp[level - 1] ?? -1) : -1
      if (glyph < 0) continue
      const x = this.originX + (i % this.cols) * atlas.cw
      const y = this.originY + Math.floor(i / this.cols) * atlas.ch
      ctx.drawImage(atlas.image, glyph * atlas.cw, 0, atlas.cw, atlas.ch, x, y, atlas.cw, atlas.ch)
    }
    return print
  }

  /** Prostokąt komórki; brzegowe obejmują margines — papier i odsłonięcie sięgają krawędzi kafla. */
  private cellRect(i: number): [number, number, number, number] {
    const atlas = this.atlas as PrintAtlas
    const col = i % this.cols
    const row = Math.floor(i / this.cols)
    const x = this.originX + col * atlas.cw
    const y = this.originY + row * atlas.ch
    const x0 = col === 0 ? 0 : x
    const y0 = row === 0 ? 0 : y
    const x1 = col === this.cols - 1 ? this.deviceWidth : x + atlas.cw
    const y1 = row === this.rows - 1 ? this.deviceHeight : y + atlas.ch
    return [x0, y0, x1 - x0, y1 - y0]
  }

  /** Losowy gęsty glif na papierze — front fali i przebieg. */
  private paintGlyph(i: number) {
    const ctx = this.ctx
    const atlas = this.atlas
    if (!ctx || !atlas) return
    const [x, y, w, h] = this.cellRect(i)
    ctx.fillStyle = this.theme.paper
    ctx.fillRect(x, y, w, h)
    const ramp = atlas.ramp
    const glyph = ramp[ramp.length - 1 - Math.floor(Math.random() * (ramp.length / 2))] ?? -1
    if (glyph < 0) return
    const gx = this.originX + (i % this.cols) * atlas.cw
    const gy = this.originY + Math.floor(i / this.cols) * atlas.ch
    ctx.drawImage(atlas.image, glyph * atlas.cw, 0, atlas.cw, atlas.ch, gx, gy, atlas.cw, atlas.ch)
  }

  private schedule(x: number, y: number, duration: number, jitter: number, front: number) {
    const atlas = this.atlas as PrintAtlas
    const now = performance.now()
    const cellW = atlas.cw / this.dpr
    const cellH = atlas.ch / this.dpr
    const ox = this.originX / this.dpr
    const oy = this.originY / this.dpr
    const reach = Math.max(
      Math.hypot(x, y),
      Math.hypot(this.width - x, y),
      Math.hypot(x, this.height - y),
      Math.hypot(this.width - x, this.height - y)
    )
    for (let i = 0; i < this.due.length; i++) {
      const cx = ox + ((i % this.cols) + 0.5) * cellW
      const cy = oy + (Math.floor(i / this.cols) + 0.5) * cellH
      this.due[i] =
        now + front + (Math.hypot(cx - x, cy - y) / reach) * duration + Math.random() * jitter
    }
  }

  /** Koniec: canvas oddaje pamięć, wydruk znika — obraz jest już tylko obrazem. */
  private release() {
    cancelAnimationFrame(this.frame)
    this.frame = 0
    this.state = "decoded"
    this.print = null
    this.canvas.width = 0
    this.canvas.height = 0
  }

  private readonly tick = (now: number) => {
    this.frame = 0
    const ctx = this.ctx
    if (!ctx) return
    let pending = false
    for (let i = 0; i < this.due.length; i++) {
      const due = this.due[i] ?? 0
      if (this.state === "decoding") {
        if (!this.covered[i]) continue
        if (now >= due) {
          this.covered[i] = 0
          ctx.clearRect(...this.cellRect(i))
        } else {
          pending = true
          // Front fali: komórka tuż przed odsłonięciem miga glifem — widać „dekodowanie”.
          if (now >= due - DECODE.front && Math.random() < 0.4) this.paintGlyph(i)
        }
      } else if (now < due) {
        pending = true
      } else if (now < due + SHIMMER.hold) {
        pending = true
        if (!this.covered[i]) {
          this.covered[i] = 1
          this.paintGlyph(i)
        }
      } else if (this.covered[i] === 1) {
        this.covered[i] = 2
        ctx.clearRect(...this.cellRect(i))
      }
    }
    if (pending) this.frame = requestAnimationFrame(this.tick)
    else this.release()
  }
}
