/*
 * Silnik nieskończonego slidera: tor z trzema kopiami listy przesuwany
 * `transform`em (kompozytor), a nie natywnym przewijaniem — dzięki temu
 * auto-ruch jest płynny co do ułamka piksela, a pętla nie ma szwu.
 *
 * Stany: auto (stałe tempo, rozpęd i hamowanie wykładnicze), drag (tor idzie
 * za palcem albo myszą 1:1 od pierwszego piksela), inertia (po puszczeniu tor
 * leci dalej i wytraca prędkość jak przewijanie w iOS: v·e^(−t/325 ms)), tween
 * (strzałki, fokus karty). Po każdym geście auto-ruch wraca dopiero po chwili
 * spokoju i rozpędza się łagodnie. Soczewka: karta przy środku ma pełną skalę,
 * boczne lekko się cofają — talia, która przesuwa się przed widzem.
 *
 * Czysty moduł bez Reacta: komponent podaje flagi (pauza, najechanie, okno,
 * widoczność), silnik zapisuje style bezpośrednio — bez renderów w trakcie ruchu.
 */

/** Stała czasowa wygaszania bezwładności (ms) — jak przewijanie w iOS. */
const INERTIA_TAU = 325
/** Prędkość (px/ms), poniżej której bezwładność się kończy. */
const INERTIA_STOP = 0.02
/** Rozpęd i hamowanie auto-ruchu (stała czasowa, ms). */
const SPEED_TAU = 380
/** Spokój po geście, zanim auto-ruch wróci (ms). */
const RESUME_MS = 1200
/** Ruch wskaźnika, od którego gest to przeciągnięcie, a nie klik (px). */
const DRAG_SLOP = 6
/** Okno próbek prędkości przy puszczeniu (ms). */
const SAMPLE_MS = 90
/** Soczewka: ubytek skali na krawędzi kadru. */
const LENS = 0.075
const TWEEN_MS = 620

type Mode = "auto" | "drag" | "inertia" | "tween"

export type SliderFlag = "paused" | "hover" | "focus" | "covered" | "visible" | "hidden"

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export class SliderEngine {
  private readonly viewport: HTMLElement
  private readonly track: HTMLElement
  private readonly onDragging: (dragging: boolean) => void
  private readonly inset: () => number
  /** Karta najbliżej środka toru (`data-active`) — na dotyku rozwija pigułkę „Podgląd”. */
  private active: HTMLElement | null = null
  private cards: HTMLElement[] = []
  private centers: number[] = []
  private scales: number[] = []
  private copyWidth = 0
  private viewWidth = 0
  private side = 0
  private cardWidth = 0
  private step = 0

  private offset = 0
  private base: number
  private speed = 0
  private velocity = 0
  private mode: Mode = "auto"
  private tween: { from: number; to: number; start: number } | null = null
  private resumeAt = 0
  private flags: Record<SliderFlag, boolean> = {
    paused: false,
    hover: false,
    focus: false,
    covered: false,
    visible: false,
    hidden: false,
  }

  private drag: {
    id: number
    lastX: number
    moved: number
    samples: [number, number][]
  } | null = null
  private guardClick = false
  private dragging = false

  private frame = 0
  private last = 0
  private timer: ReturnType<typeof setTimeout> | undefined
  private readonly resize: ResizeObserver
  private readonly io: IntersectionObserver
  private started = false

  constructor(
    viewport: HTMLElement,
    track: HTMLElement,
    {
      speed,
      inset,
      onDragging,
    }: {
      speed: number
      /** Odległość kolumny kontenera od krawędzi toru (px) — tam kończy się wygaszenie. */
      inset: () => number
      onDragging: (dragging: boolean) => void
    }
  ) {
    this.viewport = viewport
    this.track = track
    this.base = speed / 1000
    this.inset = inset
    this.onDragging = onDragging

    this.resize = new ResizeObserver(() => this.measure())
    this.resize.observe(viewport)
    const firstCopy = track.firstElementChild
    if (firstCopy) this.resize.observe(firstCopy)
    this.io = new IntersectionObserver(([entry]) => this.set("visible", !!entry?.isIntersecting))
    this.io.observe(viewport)

    viewport.addEventListener("pointerdown", this.onDown)
    viewport.addEventListener("pointermove", this.onMove)
    viewport.addEventListener("pointerup", this.onUp)
    viewport.addEventListener("pointercancel", this.onCancel)
    viewport.addEventListener("click", this.onClick, true)
    viewport.addEventListener("wheel", this.onWheel, { passive: false })
    viewport.addEventListener("dragstart", this.onDragStart)
    document.addEventListener("visibilitychange", this.onVisibility)
    this.measure()
  }

  destroy() {
    cancelAnimationFrame(this.frame)
    clearTimeout(this.timer)
    this.resize.disconnect()
    this.io.disconnect()
    const v = this.viewport
    v.removeEventListener("pointerdown", this.onDown)
    v.removeEventListener("pointermove", this.onMove)
    v.removeEventListener("pointerup", this.onUp)
    v.removeEventListener("pointercancel", this.onCancel)
    v.removeEventListener("click", this.onClick, true)
    v.removeEventListener("wheel", this.onWheel)
    v.removeEventListener("dragstart", this.onDragStart)
    document.removeEventListener("visibilitychange", this.onVisibility)
    this.track.style.transform = ""
    this.active?.removeAttribute("data-active")
    for (const card of this.cards) card.style.scale = ""
  }

  /** Tempo auto-ruchu w px/s (0 = bez auto-ruchu, np. „ogranicz ruch”). */
  setSpeed(speed: number) {
    this.base = speed / 1000
    this.wake()
  }

  set(flag: SliderFlag, value: boolean) {
    if (this.flags[flag] === value) return
    this.flags[flag] = value
    // Okno podglądu: tor staje od razu — morf powrotny musi trafić w kartę;
    // po zamknięciu rusza dopiero, gdy kadr wyląduje.
    if (flag === "covered" && value) this.speed = 0
    if (flag === "covered" && !value) this.resumeAt = performance.now() + 900
    if (flag === "focus" && !value) this.normalize()
    this.wake()
  }

  /** Następna / poprzednia karta wyśrodkowana (strzałki). */
  stepBy(direction: 1 | -1) {
    const nearest = this.nearestCenter()
    if (nearest < 0) return
    // Środek sąsiedniej karty (w układzie toru) staje na środku kadru.
    const center = (this.centers[nearest] ?? 0) + direction * this.step
    this.tweenTo(center - this.copyWidth - this.viewWidth / 2)
  }

  /** Karta z fokusem w całości w kadrze (z zapasem na wygaszenie krawędzi). */
  reveal(card: HTMLElement) {
    const index = this.cards.indexOf(card)
    if (index < 0) return
    const x = (this.centers[index] ?? 0) - (this.copyWidth + this.offset)
    const margin = this.cardWidth / 2 + this.side
    if (x >= margin && x <= this.viewWidth - margin) return
    this.tweenTo(this.offset + x - this.viewWidth / 2)
  }

  /* ——— pomiar i rysowanie ——— */

  private measure() {
    const copy = this.track.firstElementChild as HTMLElement | null
    if (!copy) return
    this.copyWidth = copy.offsetWidth
    this.viewWidth = this.viewport.clientWidth
    this.side = this.inset()
    this.cards = [...this.track.querySelectorAll<HTMLElement>("[data-slide]")].map(
      (slide) => slide.firstElementChild as HTMLElement
    )
    this.centers = this.cards.map((card) => {
      const slide = card.parentElement as HTMLElement
      return slide.offsetLeft + slide.offsetWidth / 2
    })
    this.scales = this.cards.map(() => 1)
    this.cardWidth = (this.cards[0]?.parentElement as HTMLElement | undefined)?.offsetWidth ?? 0
    this.step = (this.centers[1] ?? 0) - (this.centers[0] ?? 0)
    if (!this.started && this.copyWidth > 0) {
      // Start: pierwsza karta listy na środku kadru.
      const count = this.cards.length / 3
      const first = this.centers[count] ?? 0
      this.offset = first - this.copyWidth - this.viewWidth / 2
      this.started = true
    }
    this.normalize()
    this.render()
  }

  private normalize() {
    if (!this.copyWidth || this.flags.focus || this.mode === "tween") return
    while (this.offset >= this.copyWidth) this.offset -= this.copyWidth
    while (this.offset < 0) this.offset += this.copyWidth
  }

  private render() {
    const shift = this.copyWidth + this.offset
    this.track.style.transform = `translate3d(${(-shift).toFixed(2)}px,0,0)`
    const half = this.viewWidth / 2
    // Zasięg soczewki: kolumna kontenera (poza nią karty i tak gasną w wygaszeniu).
    const reach = half - this.side + this.cardWidth / 2
    let nearest: HTMLElement | null = null
    let nearestDistance = Infinity
    for (let i = 0; i < this.cards.length; i++) {
      const x = (this.centers[i] ?? 0) - shift
      if (x < -this.cardWidth || x > this.viewWidth + this.cardWidth) continue
      const distance = Math.abs(x - half)
      const card = this.cards[i]
      if (card && distance < nearestDistance) {
        nearest = card
        nearestDistance = distance
      }
      const d = Math.min(1, distance / reach)
      const scale = 1 - LENS * d ** 1.6
      if (Math.abs(scale - (this.scales[i] ?? 1)) < 0.0004) continue
      this.scales[i] = scale
      if (card) card.style.scale = scale.toFixed(4)
    }
    if (nearest !== this.active) {
      this.active?.removeAttribute("data-active")
      nearest?.setAttribute("data-active", "")
      this.active = nearest
    }
  }

  private nearestCenter() {
    const shift = this.copyWidth + this.offset
    let best = -1
    let distance = Infinity
    for (let i = 0; i < this.centers.length; i++) {
      const d = Math.abs((this.centers[i] ?? 0) - shift - this.viewWidth / 2)
      if (d < distance) {
        distance = d
        best = i
      }
    }
    return best
  }

  private tweenTo(target: number) {
    this.mode = "tween"
    this.velocity = 0
    this.speed = 0
    this.tween = { from: this.offset, to: target, start: performance.now() }
    this.wake()
  }

  /* ——— pętla ——— */

  private get autoAllowed() {
    const f = this.flags
    return this.base > 0 && !f.paused && !f.hover && !f.focus && !f.covered
  }

  private wake() {
    clearTimeout(this.timer)
    if (this.frame || !this.flags.visible || this.flags.hidden) return
    this.last = performance.now()
    this.frame = requestAnimationFrame(this.tick)
  }

  private readonly tick = (now: number) => {
    this.frame = 0
    const dt = Math.min(48, now - this.last)
    this.last = now

    if (this.mode === "inertia") {
      this.offset -= this.velocity * dt
      this.velocity *= Math.exp(-dt / INERTIA_TAU)
      if (Math.abs(this.velocity) < INERTIA_STOP) this.settle(now)
    } else if (this.mode === "tween" && this.tween) {
      const t = Math.min(1, (now - this.tween.start) / TWEEN_MS)
      this.offset = this.tween.from + (this.tween.to - this.tween.from) * easeInOut(t)
      if (t >= 1) {
        this.tween = null
        this.settle(now, 1800)
      }
    } else if (this.mode === "auto") {
      const target = this.autoAllowed && now >= this.resumeAt ? this.base : 0
      this.speed += (target - this.speed) * (1 - Math.exp(-dt / SPEED_TAU))
      if (target === 0 && this.speed < 0.0004) this.speed = 0
      this.offset += this.speed * dt
    }
    this.normalize()
    this.render()

    if (!this.flags.visible || this.flags.hidden) return
    const moving =
      this.mode !== "auto" || this.speed > 0 || (this.autoAllowed && now >= this.resumeAt)
    if (moving) this.frame = requestAnimationFrame(this.tick)
    else if (this.autoAllowed) {
      // Czekamy na koniec spokoju po geście — budzi nas zegar, nie pętla.
      this.timer = setTimeout(() => this.wake(), Math.max(0, this.resumeAt - now) + 16)
    }
  }

  private settle(now: number, pause = RESUME_MS) {
    this.mode = "auto"
    this.velocity = 0
    this.speed = 0
    this.resumeAt = now + pause
  }

  /* ——— gesty ——— */

  private readonly onDown = (event: PointerEvent) => {
    if (this.drag || (event.pointerType === "mouse" && event.button !== 0)) return
    this.drag = {
      id: event.pointerId,
      lastX: event.clientX,
      moved: 0,
      samples: [[event.timeStamp, event.clientX]],
    }
    this.mode = "drag"
    this.tween = null
    this.velocity = 0
    this.speed = 0
    this.guardClick = false
    this.wake()
  }

  private readonly onMove = (event: PointerEvent) => {
    const drag = this.drag
    if (!drag || drag.id !== event.pointerId) return
    const dx = event.clientX - drag.lastX
    drag.lastX = event.clientX
    drag.moved += Math.abs(dx)
    this.offset -= dx
    drag.samples.push([event.timeStamp, event.clientX])
    while (drag.samples.length > 2 && event.timeStamp - (drag.samples[0]?.[0] ?? 0) > SAMPLE_MS) {
      drag.samples.shift()
    }
    if (drag.moved > DRAG_SLOP && !this.dragging) {
      this.dragging = true
      this.onDragging(true)
      // Przechwycenie dopiero przy prawdziwym przeciąganiu — klik w kartę zostaje klikiem.
      this.viewport.setPointerCapture(event.pointerId)
    }
    this.wake()
  }

  private readonly onUp = (event: PointerEvent) => {
    const drag = this.drag
    if (!drag || drag.id !== event.pointerId) return
    this.drag = null
    const first = drag.samples[0]
    const last = drag.samples[drag.samples.length - 1]
    const span = first && last ? last[0] - first[0] : 0
    const velocity =
      first && last && span > 0 && event.timeStamp - last[0] < 60 ? (last[1] - first[1]) / span : 0
    this.guardClick = drag.moved > DRAG_SLOP
    this.endDrag()
    if (Math.abs(velocity) > 0.08) {
      this.mode = "inertia"
      this.velocity = Math.max(-4, Math.min(4, velocity))
    } else this.settle(performance.now())
    this.wake()
  }

  private readonly onCancel = (event: PointerEvent) => {
    const drag = this.drag
    if (!drag || drag.id !== event.pointerId) return
    this.drag = null
    this.endDrag()
    this.settle(performance.now())
    this.wake()
  }

  private endDrag() {
    if (!this.dragging) return
    this.dragging = false
    this.onDragging(false)
  }

  /** Klik po przeciągnięciu nie otwiera karty. */
  private readonly onClick = (event: MouseEvent) => {
    if (!this.guardClick) return
    this.guardClick = false
    event.preventDefault()
    event.stopPropagation()
  }

  /** Poziomy gest gładzika przesuwa tor; pionowy zostaje stronie. */
  private readonly onWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
    event.preventDefault()
    this.mode = "auto"
    this.tween = null
    this.speed = 0
    this.offset += event.deltaX
    this.resumeAt = performance.now() + RESUME_MS
    this.normalize()
    this.render()
    this.wake()
  }

  private readonly onDragStart = (event: DragEvent) => event.preventDefault()

  private readonly onVisibility = () => this.set("hidden", document.hidden)
}
