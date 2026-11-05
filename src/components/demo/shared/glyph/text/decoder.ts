import type { Mode } from "../settings"

/*
 * Dekoder liter w DOM. Litery są w HTML od początku (czytnik ekranu i brak JS
 * dostają zwykły tekst); w stanie zakodowanym litera jest przezroczysta, a nad
 * nią rysuje się glif (`::after`, `data-g`). Szerokość i podział wierszy nie
 * drgną. Każda litera ma miejsce w kolejce danego rodzaju animacji (fala —
 * od lewej, szum — losowo, rozpad — losowo z falą, deszcz — kolumnami), a front
 * przechodzi przez kolejkę z postępem `p` (zawsze w czasie).
 *
 * Stany: brak atrybutów — litera; `data-s="0"` — glif w spoczynku (cichy);
 * `data-s="1"` — pasmo dekodowania (glif miga w tempie `fps`).
 */

export interface DecodeTarget {
  letters: HTMLElement[]
  order: Float32Array
}

/** Szerokość pasma (część kolejki) dla czasu dekodowania — wolniej = szersze pasmo. */
function bandFor(decode: number, count: number) {
  const letters = 6 + (decode / 1000) * 10
  return Math.min(0.6, Math.max(0.04, letters / Math.max(1, count)))
}

function hash(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function collect(root: HTMLElement, mode: Mode): DecodeTarget {
  const letters = [...root.querySelectorAll<HTMLElement>("[data-c]")]
  const n = letters.length
  const order = new Float32Array(n)
  letters.forEach((letter, i) => {
    const position = i / Math.max(1, n - 1)
    const noise = hash(i)
    order[i] =
      mode === "scramble"
        ? noise
        : mode === "dissolve"
          ? noise * 0.55 + position * 0.45
          : mode === "rain"
            ? (letter.offsetLeft / Math.max(1, root.offsetWidth)) * 0.7 + noise * 0.3
            : position * 0.92 + noise * 0.08
  })
  return { letters, order }
}

function pick(glyphs: string) {
  const chars = Array.from(glyphs)
  return chars[Math.floor(Math.random() * chars.length)] ?? "0"
}

/**
 * Ustawia stan liter dla postępu `p` (0 — wszystko zakodowane, 1 — tekst).
 * `tick` — czy w tej klatce glify w paśmie mają się zmienić (tempo `fps`).
 * Zwraca, czy coś jest jeszcze w paśmie.
 */
export function paint(
  target: DecodeTarget,
  glyphs: string,
  decode: number,
  mode: Mode,
  p: number,
  tick: boolean
): boolean {
  const band = bandFor(decode, target.letters.length)
  const front = p * (1 + band)
  let busy = false
  target.letters.forEach((letter, i) => {
    const o = target.order[i] ?? 0
    const r = (front - o) / band
    if (r >= 1) {
      if (letter.dataset.s) {
        delete letter.dataset.s
        delete letter.dataset.g
      }
      return
    }
    if (r <= 0) {
      if (letter.dataset.s !== "0") {
        letter.dataset.s = "0"
        letter.dataset.g = pick(glyphs)
      }
      return
    }
    busy = true
    // Rozpad: w paśmie glif zmienia się rzadziej — reszta miga w tempie.
    if (letter.dataset.s !== "1") {
      letter.dataset.s = "1"
      letter.dataset.g = pick(glyphs)
    } else if (tick && (mode !== "dissolve" || Math.random() < 0.5)) {
      letter.dataset.g = pick(glyphs)
    }
  })
  return busy
}

export function clear(target: DecodeTarget) {
  target.letters.forEach((letter) => {
    delete letter.dataset.s
    delete letter.dataset.g
  })
}
