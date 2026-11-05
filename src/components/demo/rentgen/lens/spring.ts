/**
 * Sprężyna krytycznie bliska (półjawny Euler z podkrokami ≤ 1/120 s) —
 * niezależna od częstotliwości odświeżania. Parametry jak w Motion:
 * `visualDuration` i tłumienie ζ (1 = bez odbicia).
 */
export class Spring {
  value: number
  velocity = 0
  target: number
  private readonly stiffness: number
  private readonly damping: number

  constructor(value: number, visualDuration: number, zeta: number) {
    this.value = value
    this.target = value
    const omega = (2 * Math.PI) / (1.2 * visualDuration)
    this.stiffness = omega * omega
    this.damping = 2 * zeta * omega
  }

  /** Natychmiast do wartości (bez ruchu). */
  snap(value: number) {
    this.value = value
    this.target = value
    this.velocity = 0
  }

  step(dt: number): boolean {
    let remaining = Math.min(dt, 0.064)
    while (remaining > 0) {
      const h = Math.min(remaining, 1 / 120)
      const force = -this.stiffness * (this.value - this.target) - this.damping * this.velocity
      this.velocity += force * h
      this.value += this.velocity * h
      remaining -= h
    }
    if (Math.abs(this.value - this.target) < 0.05 && Math.abs(this.velocity) < 0.5) {
      this.value = this.target
      this.velocity = 0
      return false
    }
    return true
  }
}

/** Krzywa „ruch po ekranie” Formy: cubic-bezier(0.77, 0, 0.175, 1). */
export function easeMove(t: number): number {
  return cubicBezier(0.77, 0, 0.175, 1, t)
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number, t: number): number {
  // Newton na osi x, potem y(t).
  let u = t
  for (let i = 0; i < 6; i++) {
    const x = bez(x1, x2, u) - t
    const dx = bezD(x1, x2, u)
    if (Math.abs(x) < 1e-5 || dx === 0) break
    u -= x / dx
  }
  u = Math.min(1, Math.max(0, u))
  return bez(y1, y2, u)
}

function bez(a: number, b: number, t: number) {
  return 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t
}

function bezD(a: number, b: number, t: number) {
  return 3 * a * (1 - t) * (1 - t) + 6 * (b - a) * (1 - t) * t + 3 * (1 - b) * t * t
}
