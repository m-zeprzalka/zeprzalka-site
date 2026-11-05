/**
 * Sprężyna podążania (krytycznie tłumiona, bez przestrzelenia): karta płynie
 * za kursorem ~300 ms, ale nie pływa. Zapis prosto do `style.transform` —
 * bez renderów Reacta w trakcie ruchu. Zatrzymuje się, gdy dojedzie.
 */
const STIFFNESS = 420
const DAMPING = 2 * Math.sqrt(STIFFNESS) // tłumienie krytyczne

export class Follower {
  private readonly element: HTMLElement
  private x = 0
  private y = 0
  private vx = 0
  private vy = 0
  private tx = 0
  private ty = 0
  private frame = 0
  private last = 0

  constructor(element: HTMLElement) {
    this.element = element
  }

  /** Nowy cel; `jump` — od razu na miejscu (pierwsze pojawienie, ograniczony ruch). */
  to(x: number, y: number, jump = false) {
    this.tx = x
    this.ty = y
    if (jump) {
      this.x = x
      this.y = y
      this.vx = 0
      this.vy = 0
      this.write()
      return
    }
    if (!this.frame) {
      this.last = performance.now()
      this.frame = requestAnimationFrame(this.tick)
    }
  }

  stop() {
    cancelAnimationFrame(this.frame)
    this.frame = 0
  }

  private write() {
    this.element.style.transform = `translate3d(${this.x.toFixed(2)}px, ${this.y.toFixed(2)}px, 0)`
  }

  private readonly tick = (now: number) => {
    // Krok co najwyżej 1/30 s — po przerwie (karta w tle) sprężyna nie „wystrzeliwuje”.
    const dt = Math.min(1 / 30, (now - this.last) / 1000)
    this.last = now
    const ax = -STIFFNESS * (this.x - this.tx) - DAMPING * this.vx
    const ay = -STIFFNESS * (this.y - this.ty) - DAMPING * this.vy
    this.vx += ax * dt
    this.vy += ay * dt
    this.x += this.vx * dt
    this.y += this.vy * dt
    const settled =
      Math.abs(this.x - this.tx) < 0.2 &&
      Math.abs(this.y - this.ty) < 0.2 &&
      Math.abs(this.vx) < 2 &&
      Math.abs(this.vy) < 2
    if (settled) {
      this.x = this.tx
      this.y = this.ty
      this.frame = 0
    } else {
      this.frame = requestAnimationFrame(this.tick)
    }
    this.write()
  }
}
