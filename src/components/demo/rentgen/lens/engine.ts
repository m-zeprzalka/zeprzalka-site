"use client"

import { layoutTwins } from "./measure"
import { easeMove, Spring } from "./spring"
import { emitLensFrame, lens, modeStore, type Mode, type Shape } from "./store"

/**
 * Silnik soczewki. Soczewka żyje w układzie dokumentu — jak lupa położona na
 * papierze: pierścień jest `absolute` w korzeniu strony, a klisze sekcji
 * przycina `clip-path: path()` liczone w ich własnych współrzędnych. Dzięki
 * temu przewijanie niczego nie przelicza; sprężyna tylko dogania kursor.
 *
 * Kształt to zaokrąglony prostokąt {x, y, w, h, r}: koło (wolna soczewka),
 * pigułka wokół przycisku (magnes), pas (skan startowy), koło z przełącznika
 * (zmiana trybu). W trybie „Kod” ścieżka `evenodd` wycina dziurę — soczewka
 * pokazuje wtedy projekt.
 *
 * Klatka liczy się tylko wtedy, gdy coś się rusza; style zapisuje się
 * wyłącznie przy zmianie wartości (bez przeliczania stylów co klatkę).
 */

interface FaceRecord {
  el: HTMLElement
  host: HTMLElement
  x: number
  y: number
  w: number
  h: number
  /** Prostokąt czytany co klatkę (nagłówek `fixed`, karty w ruchomym rzędzie). */
  live: boolean
  /** Widoczna wyłącznie pod soczewką, także w trybie „Kod” (nagłówek). */
  lensOnly: boolean
  visible: boolean
  clip: string
  on: boolean
}

interface Tween {
  from: Shape
  to: Shape
  start: number
  duration: number
  /** Ścieżka z dziurą (klisza widoczna wszędzie poza kształtem). */
  invert: boolean
  variant: "band" | "wipe"
  onEnd: () => void
}

interface Target {
  x: number
  y: number
  w: number
  h: number
  r: number
}

const round = (value: number) => Math.round(value * 10) / 10

/** Ścieżka SVG zaokrąglonego prostokąta (lewy górny róg x, y). */
function roundedRect(x: number, y: number, w: number, h: number, r: number): string {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2))
  const [x0, y0, x1, y1, k] = [round(x), round(y), round(x + w), round(y + h), round(radius)]
  if (k === 0) return `M${x0} ${y0}H${x1}V${y1}H${x0}Z`
  return (
    `M${round(x0 + k)} ${y0}H${round(x1 - k)}A${k} ${k} 0 0 1 ${x1} ${round(y0 + k)}` +
    `V${round(y1 - k)}A${k} ${k} 0 0 1 ${round(x1 - k)} ${y1}H${round(x0 + k)}` +
    `A${k} ${k} 0 0 1 ${x0} ${round(y1 - k)}V${round(y0 + k)}A${k} ${k} 0 0 1 ${round(x0 + k)} ${y0}Z`
  )
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** Promień wolnej soczewki zależny od szerokości okna. */
function baseRadius(coarse: boolean): number {
  const width = window.innerWidth
  if (coarse) return width < 400 ? 66 : width < 768 ? 74 : 84
  if (width < 1024) return 76
  if (width < 1680) return 88
  return 100
}

/** Mały pierścień nad pustym papierem (px) — bez kliszy pod spodem. */
const RING = 22

const radiusCache = new WeakMap<Element, number>()

function radiusOf(element: Element): number {
  let value = radiusCache.get(element)
  if (value === undefined) {
    value = parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0
    radiusCache.set(element, value)
  }
  return value
}

export interface LensCallbacks {
  /** Nazwa i rozmiar elementu pod środkiem soczewki (etykieta pierścienia). */
  onLabel: (name: string, size: string) => void
  /** Wariant pierścienia: zwykły, pas skanera, ukryty (zmiana trybu). */
  onVariant: (variant: "lens" | "band" | "hidden") => void
  /** Dotyk: soczewka schowała się sama (przewinięcie). */
  onSummon?: (shown: boolean) => void
}

export class LensEngine {
  private readonly root: HTMLElement
  private readonly ring: HTMLElement
  private readonly callbacks: LensCallbacks
  readonly coarse: boolean
  private faces: FaceRecord[] = []
  private readonly px = new Spring(0, 0.16, 0.92)
  private readonly py = new Spring(0, 0.16, 0.92)
  private readonly sw = new Spring(0, 0.3, 0.72)
  private readonly sh = new Spring(0, 0.3, 0.72)
  private readonly sr = new Spring(0, 0.3, 0.72)
  private frame = 0
  private last = 0
  private tween: Tween | null = null
  private pointer = { x: 0, y: 0, inside: false, pressed: false }
  /** Pierwszy ruch myszy odrywa soczewkę od „domu” (nagłówek hero). */
  private following = false
  /** Położenie soczewki odłożonej na papier (dom, telefon). */
  private parked: { x: number; y: number } | null = null
  private hidden = false
  private parkedScroll = 0
  private dragging = false
  private dragOffset = { x: 0, y: 0 }
  private labelKey = ""
  private hotKey = ""
  /** Klucze elementów, które mają w kliszy bliźniaka z treścią. */
  private contentKeys = new Set<string>()
  private hot: HTMLElement[] = []
  private ringSize = ""
  private ringOn = false
  private ringRevealing = true
  private variant: "lens" | "band" | "hidden" = "lens"
  private readonly cleanups: (() => void)[] = []
  private measureFrame = 0
  private visibility: IntersectionObserver | null = null
  private sizes: ResizeObserver | null = null

  constructor(root: HTMLElement, ring: HTMLElement, callbacks: LensCallbacks) {
    this.root = root
    this.ring = ring
    this.callbacks = callbacks
    this.coarse = !window.matchMedia("(pointer: fine)").matches
  }

  /* ——— cykl życia ——— */

  start() {
    this.collectFaces()
    this.measure()
    this.bind()
    const fonts = document.fonts?.ready
    if (fonts) void fonts.then(() => this.scheduleMeasure())
  }

  destroy() {
    cancelAnimationFrame(this.frame)
    cancelAnimationFrame(this.measureFrame)
    this.cleanups.forEach((cleanup) => cleanup())
    for (const face of this.faces) {
      face.el.style.clipPath = ""
      face.el.removeAttribute("data-on")
    }
  }

  private collectFaces() {
    const elements = this.root.querySelectorAll<HTMLElement>("[data-rg-face]")
    this.faces = []
    for (const el of elements) {
      // Klisza skanu ma własne przycięcie (CSS); soczewka jej nie dotyka.
      if (el.dataset.rgFace === "scan") continue
      const host = el.closest<HTMLElement>("[data-rg-host]")
      if (!host) continue
      this.faces.push({
        el,
        host,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        live: el.dataset.rgFace === "live",
        lensOnly: el.hasAttribute("data-rg-lens-only"),
        visible: false,
        clip: "",
        on: false,
      })
    }
  }

  private refresh() {
    const known = new Set(this.faces.map((face) => face.el))
    this.collectFaces()
    for (const face of this.faces) {
      if (known.has(face.el)) continue
      this.visibility?.observe(face.host)
      this.sizes?.observe(face.host)
    }
    this.scheduleMeasure()
  }

  /** Prostokąty klisz w px dokumentu + pozycje bliźniaków. */
  measure() {
    const sx = window.scrollX
    const sy = window.scrollY
    for (const face of this.faces) {
      const rect = face.host.getBoundingClientRect()
      face.x = rect.left + sx
      face.y = rect.top + sy
      face.w = rect.width
      face.h = rect.height
    }
    for (const face of this.root.querySelectorAll<HTMLElement>("[data-rg-face]")) layoutTwins(face)
    this.contentKeys = new Set(
      [...this.root.querySelectorAll<HTMLElement>("[data-rg-for]:not([data-kind='block'])")]
        .map((twin) => twin.dataset.rgFor ?? "")
        .filter(Boolean)
    )
    this.kick()
  }

  scheduleMeasure() {
    cancelAnimationFrame(this.measureFrame)
    this.measureFrame = requestAnimationFrame(() => this.measure())
  }

  private bind() {
    const on = <K extends keyof WindowEventMap>(
      type: K,
      handler: (event: WindowEventMap[K]) => void,
      options?: AddEventListenerOptions
    ) => {
      window.addEventListener(type, handler, options)
      this.cleanups.push(() => window.removeEventListener(type, handler, options))
    }

    const visibility = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const face = this.faces.find((item) => item.host === entry.target)
          if (face) face.visible = entry.isIntersecting
        }
        this.kick()
      },
      { rootMargin: "25% 0px" }
    )
    for (const face of this.faces) visibility.observe(face.host)
    this.cleanups.push(() => visibility.disconnect())
    this.visibility = visibility

    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const sizes = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => this.measure(), 80)
    })
    for (const face of this.faces) sizes.observe(face.host)
    this.cleanups.push(() => {
      sizes.disconnect()
      clearTimeout(resizeTimer)
    })
    this.sizes = sizes

    // Klisze dochodzące po hydratacji (kopie toru kart) — silnik zbiera je od nowa.
    on("rg-faces" as keyof WindowEventMap, () => this.refresh())

    on(
      "scroll",
      () => {
        // Dotyk: po przewinięciu soczewka się chowa (przywołuje ją przycisk) — nie wisi nad
        // przypadkową treścią.
        if (this.coarse && !this.dragging && !this.hidden && this.parked && !this.tween) {
          const vy = this.py.value - window.scrollY
          if (
            vy < -40 ||
            vy > window.innerHeight + 40 ||
            Math.abs(window.scrollY - this.parkedScroll) > 24
          ) {
            this.hidden = true
            this.callbacks.onSummon?.(false)
          }
        }
        this.kick()
      },
      { passive: true }
    )

    if (!this.coarse) {
      on(
        "pointermove",
        (event) => {
          if (event.pointerType === "touch") return
          this.pointer.x = event.clientX
          this.pointer.y = event.clientY
          this.pointer.inside = true
          if (!this.following && !this.tween) {
            this.following = true
            this.parked = null
          }
          this.kick()
        },
        { passive: true }
      )
      on("pointerdown", (event) => {
        if (event.pointerType !== "mouse" || event.button !== 0) return
        this.pointer.pressed = true
        this.kick()
      })
      on("pointerup", () => {
        this.pointer.pressed = false
        this.kick()
      })
      on("blur", () => {
        this.pointer.inside = false
        this.pointer.pressed = false
        this.kick()
      })
      const leave = (event: MouseEvent) => {
        if (event.relatedTarget) return
        this.pointer.inside = false
        this.kick()
      }
      document.documentElement.addEventListener("mouseleave", leave)
      this.cleanups.push(() => document.documentElement.removeEventListener("mouseleave", leave))
    } else {
      const down = (event: PointerEvent) => {
        if (this.hidden) return
        this.dragging = true
        this.ring.setPointerCapture(event.pointerId)
        this.dragOffset = {
          x: this.px.value - (event.clientX + window.scrollX),
          y: this.py.value - (event.clientY + window.scrollY),
        }
        this.root.setAttribute("data-rg-dragged", "")
        this.kick()
      }
      const move = (event: PointerEvent) => {
        if (!this.dragging) return
        this.parked = {
          x: event.clientX + window.scrollX + this.dragOffset.x,
          y: event.clientY + window.scrollY + this.dragOffset.y,
        }
        this.kick()
      }
      const up = () => {
        this.dragging = false
        this.parkedScroll = window.scrollY
        this.kick()
      }
      this.ring.addEventListener("pointerdown", down)
      this.ring.addEventListener("pointermove", move)
      this.ring.addEventListener("pointerup", up)
      this.ring.addEventListener("pointercancel", up)
      this.cleanups.push(() => {
        this.ring.removeEventListener("pointerdown", down)
        this.ring.removeEventListener("pointermove", move)
        this.ring.removeEventListener("pointerup", up)
        this.ring.removeEventListener("pointercancel", up)
      })
    }
  }

  /* ——— sterowanie z zewnątrz ——— */

  /** Telefon: przywołanie soczewki na środek ekranu albo schowanie. */
  toggleSummon(): boolean {
    const vx = this.px.value - window.scrollX
    const vy = this.py.value - window.scrollY
    const inView = vx > 0 && vx < window.innerWidth && vy > 0 && vy < window.innerHeight
    if (!this.hidden && inView && this.parked) {
      this.hidden = true
    } else {
      this.hidden = false
      const x = window.scrollX + window.innerWidth / 2
      const y = window.scrollY + window.innerHeight * 0.46
      this.parked = { x, y }
      this.parkedScroll = window.scrollY
      this.px.snap(x)
      this.py.snap(y)
      this.sw.snap(0)
      this.sh.snap(0)
      this.sr.snap(0)
    }
    this.kick()
    return !this.hidden
  }

  /** Jednorazowy skan startowy: pas kodu przejeżdża przez ekran od góry do dołu. */
  sweep(onEnd: () => void) {
    const width = document.documentElement.clientWidth
    const top = window.scrollY + 56
    const bottom = window.scrollY + window.innerHeight
    const band = Math.min(180, window.innerHeight * 0.22)
    this.startTween({
      from: { x: width / 2, y: top - band / 2, w: width + 2, h: band, r: 0 },
      to: { x: width / 2, y: bottom + band / 2, w: width + 2, h: band, r: 0 },
      duration: 1300,
      invert: false,
      variant: "band",
      onEnd,
    })
  }

  /** Zmiana trybu kołem z punktu (środek przełącznika, px dokumentu). */
  switchMode(next: Mode, ox: number, oy: number) {
    if (this.tween) return
    const vx = ox - window.scrollX
    const vy = oy - window.scrollY
    const reach =
      Math.hypot(Math.max(vx, window.innerWidth - vx), Math.max(vy, window.innerHeight - vy)) + 24
    const circle = (radius: number): Shape => ({
      x: ox,
      y: oy,
      w: radius * 2,
      h: radius * 2,
      r: radius,
    })
    this.startTween({
      from: circle(0),
      to: circle(reach),
      duration: next === "code" ? 720 : 560,
      invert: next === "design",
      variant: "wipe",
      onEnd: () => {
        modeStore.set(next)
        this.resetFaces()
        // Po zmianie soczewka rośnie od zera w miejscu kursora.
        this.sw.snap(0)
        this.sh.snap(0)
        this.sr.snap(0)
        if (this.pointer.inside) {
          this.px.snap(this.pointer.x + window.scrollX)
          this.py.snap(this.pointer.y + window.scrollY)
        }
      },
    })
  }

  private startTween(tween: Omit<Tween, "start">) {
    this.tween = { ...tween, start: performance.now() }
    this.setVariant(tween.variant === "band" ? "band" : "hidden")
    this.kick()
  }

  private resetFaces() {
    for (const face of this.faces) {
      face.el.style.clipPath = ""
      face.clip = ""
      face.el.removeAttribute("data-on")
      face.on = false
    }
  }

  /* ——— klatka ——— */

  kick() {
    if (this.frame) return
    this.last = performance.now()
    this.frame = requestAnimationFrame(this.tick)
  }

  private readonly tick = (now: number) => {
    this.frame = 0
    const dt = Math.max(0, (now - this.last) / 1000)
    this.last = now
    const mode = modeStore.get()
    let moving = false
    let shape: Shape
    let invert = mode === "code"

    const tween = this.tween
    if (tween) {
      const t = Math.min(1, (now - tween.start) / tween.duration)
      const e = easeMove(t)
      shape = {
        x: lerp(tween.from.x, tween.to.x, e),
        y: lerp(tween.from.y, tween.to.y, e),
        w: lerp(tween.from.w, tween.to.w, e),
        h: lerp(tween.from.h, tween.to.h, e),
        r: lerp(tween.from.r, tween.to.r, e),
      }
      invert = tween.invert
      moving = true
      if (t >= 1) {
        this.tween = null
        this.setVariant("lens")
        tween.onEnd()
      }
    } else {
      const target = this.target()
      // Zamknięta soczewka nie wędruje przez stronę — pojawia się od razu w nowym miejscu.
      if (this.sw.value < 2 && target.w > 0) {
        this.px.snap(target.x)
        this.py.snap(target.y)
      }
      this.px.target = target.x
      this.py.target = target.y
      this.sw.target = target.w
      this.sh.target = target.h
      this.sr.target = target.r
      for (const spring of [this.px, this.py, this.sw, this.sh, this.sr]) {
        if (spring.step(dt)) moving = true
      }
      shape = {
        x: this.px.value,
        y: this.py.value,
        w: Math.max(0, this.sw.value),
        h: Math.max(0, this.sh.value),
        r: Math.max(0, this.sr.value),
      }
    }

    this.write(shape, invert)
    lens.x = shape.x
    lens.y = shape.y
    lens.w = shape.w
    lens.h = shape.h
    lens.r = shape.r
    lens.inverted = invert
    emitLensFrame()
    if (moving || this.faces.some((face) => face.live && face.visible && face.on)) {
      this.frame = requestAnimationFrame(this.tick)
    }
  }

  /** Cel sprężyn: magnes, wolne koło, nacisk, zamknięcie. */
  private target(): Target {
    const coarse = this.coarse
    const radius = baseRadius(coarse)
    const closed = { x: this.px.value, y: this.py.value, w: 0, h: 0, r: 0 }
    if (coarse) {
      const spot = this.parked
      if (!spot || this.hidden) return closed
      const size = radius * 2 * (this.dragging ? 1.12 : 1)
      return { x: spot.x, y: spot.y, w: size, h: size, r: size / 2 }
    }
    // Mysz: soczewka pojawia się dopiero po pierwszym ruchu kursora.
    if (!this.following) return closed

    const x = this.pointer.x + window.scrollX
    const y = this.pointer.y + window.scrollY
    if (!this.pointer.inside) return { x: this.px.value, y: this.py.value, w: 0, h: 0, r: 0 }

    const hit = document.elementFromPoint(this.pointer.x, this.pointer.y)
    this.updateLabel(hit)
    const quiet = hit?.closest("[data-rg-quiet], input, textarea, select")
    if (quiet) return { x, y, w: 0, h: 0, r: 0 }

    const magnet = hit?.closest("[data-rg-magnet]")
    if (magnet) {
      const rect = magnet.getBoundingClientRect()
      const pad = 8
      const cx = rect.left + rect.width / 2 + window.scrollX
      const cy = rect.top + rect.height / 2 + window.scrollY
      const w = rect.width + pad * 2
      const h = rect.height + pad * 2
      const squeeze = this.pointer.pressed ? 0.96 : 1
      return {
        // Lekkie „przyklejenie”: środek idzie za kursorem o 12% jego odchylenia.
        x: cx + (x - cx) * 0.12,
        y: cy + (y - cy) * 0.12,
        w: w * squeeze,
        h: h * squeeze,
        r: Math.min(radiusOf(magnet) + pad, h / 2),
      }
    }
    // Nad pustym papierem (bez bliźniaka) — tylko mały pierścień, nigdy pełne czarne koło.
    if (!this.overContent(hit)) return { x, y, w: RING, h: RING, r: RING / 2 }
    const size = radius * 2 * (this.pointer.pressed ? 1.6 : 1)
    return { x, y, w: size, h: size, r: size / 2 }
  }

  /** Czy pod kursorem leży element, który ma w kliszy bliźniaka z treścią (albo karta). */
  private overContent(hit: Element | null): boolean {
    if (!hit) return false
    if (hit.closest("[data-rg-host^='card-']")) return true
    const keyed = hit.closest<HTMLElement>("[data-rg-key]")
    if (!keyed?.dataset.rgKey || !this.contentKeys.has(keyed.dataset.rgKey)) return false
    // Wielkie pismo (znak w stopce): treścią jest tylko pas liter, nie puste pole nad nimi.
    const ink = keyed.dataset.rgInk
    if (ink) {
      const [top = 0, bottom = 1] = ink.split(",").map(Number)
      const rect = keyed.getBoundingClientRect()
      const size = parseFloat(getComputedStyle(keyed).fontSize) || rect.height
      const y = this.pointer.y - rect.top
      return y >= top * size && y <= bottom * size
    }
    return true
  }

  private updateLabel(hit: Element | null) {
    const named = hit?.closest<HTMLElement>("[data-rg-name]")
    const name = named?.dataset.rgName ?? ""
    const size = named ? `${Math.round(named.offsetWidth)} × ${Math.round(named.offsetHeight)}` : ""
    const key = `${name}|${size}`
    if (key !== this.labelKey) {
      this.labelKey = key
      this.callbacks.onLabel(name, size)
    }
    // Etykiety wymiarów i klasy w kliszy — tylko dla elementu pod kursorem (jedna warstwa naraz).
    const hotKey = hit?.closest<HTMLElement>("[data-rg-key]")?.dataset.rgKey ?? ""
    if (hotKey === this.hotKey) return
    this.hotKey = hotKey
    for (const twin of this.hot) twin.removeAttribute("data-hot")
    this.hot = hotKey
      ? [...this.root.querySelectorAll<HTMLElement>(`[data-rg-for="${CSS.escape(hotKey)}"]`)]
      : []
    for (const twin of this.hot) twin.setAttribute("data-hot", "")
  }

  private setVariant(variant: "lens" | "band" | "hidden") {
    if (variant === this.variant) return
    this.variant = variant
    this.callbacks.onVariant(variant)
  }

  private write(shape: Shape, invert: boolean) {
    const visible = shape.w > 0.5 && shape.h > 0.5
    // Mały pierścień nie odsłania kliszy (żadnej ciemnej kropki pod kursorem).
    const revealing = shape.w > RING + 6
    // Pierścień: pozycja transformacją, rozmiar tylko przy zmianie.
    this.ring.style.transform = `translate3d(${round(shape.x - shape.w / 2)}px, ${round(shape.y - shape.h / 2)}px, 0)`
    const size = `${round(shape.w)}|${round(shape.h)}|${round(shape.r)}`
    if (size !== this.ringSize) {
      this.ringSize = size
      this.ring.style.width = `${round(shape.w)}px`
      this.ring.style.height = `${round(shape.h)}px`
      this.ring.style.borderRadius = `${round(shape.r)}px`
    }
    if (visible !== this.ringOn) {
      this.ringOn = visible
      this.ring.toggleAttribute("data-on", visible)
    }
    if (revealing !== this.ringRevealing) {
      this.ringRevealing = revealing
      this.ring.toggleAttribute("data-small", !revealing)
    }

    for (const face of this.faces) {
      if (!face.visible) continue
      if (face.live) {
        const rect = face.host.getBoundingClientRect()
        face.x = rect.left + window.scrollX
        face.y = rect.top + window.scrollY
        face.w = rect.width
        face.h = rect.height
      }
      const lx = shape.x - shape.w / 2 - face.x
      const ly = shape.y - shape.h / 2 - face.y
      const hit = revealing && lx < face.w && ly < face.h && lx + shape.w > 0 && ly + shape.h > 0
      let on: boolean
      let clip: string
      // Klisza nagłówka jest tylko „pod soczewką” — w trybie „Kod” nie zasłania przełącznika.
      if (!invert || face.lensOnly) {
        on = hit
        clip = hit ? `path("${roundedRect(lx, ly, shape.w, shape.h, shape.r)}")` : ""
      } else {
        on = true
        clip = hit
          ? `path(evenodd, "M0 0H${round(face.w)}V${round(face.h)}H0Z${roundedRect(lx, ly, shape.w, shape.h, shape.r)}")`
          : ""
      }
      if (on !== face.on) {
        face.on = on
        face.el.toggleAttribute("data-on", on)
      }
      if (clip !== face.clip) {
        face.clip = clip
        face.el.style.clipPath = clip
      }
    }
  }
}
