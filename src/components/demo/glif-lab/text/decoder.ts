import type { Mode, Variant } from "../lab/config"
import { TEXT_GLYPHS } from "../engine/charsets"

/*
 * Dekoder liter w DOM. Litery są w HTML od początku (czytnik ekranu i brak JS
 * dostają zwykły tekst); w stanie zakodowanym litera jest przezroczysta, a nad
 * nią rysuje się glif (`::after`, `data-g`). Szerokość i podział wierszy nie
 * drgną. Każda litera ma swoje miejsce w kolejce danego rodzaju animacji
 * (fala — od lewej, szum — losowo, skaner — wierszami, rozpad — losowo z falą),
 * a front przechodzi przez kolejkę z postępem `p` (czas albo przewijanie).
 *
 * Stany: brak atrybutów — litera; `data-s="0"` — glif w spoczynku (cichy);
 * `data-s="1"` — pasmo dekodowania (glif miga w tempie `fps`).
 */

export interface DecodeTarget {
  letters: HTMLElement[]
  order: Float32Array
}

/** Szerokość pasma (część kolejki) dla czasu dekodowania — wolniej = szersze pasmo. */
export function bandFor(decode: number, count: number) {
  const letters = 6 + (decode / 1000) * 10
  return Math.min(0.6, Math.max(0.04, letters / Math.max(1, count)))
}

export function collect(root: HTMLElement, mode: Mode): DecodeTarget {
  const letters = [...root.querySelectorAll<HTMLElement>("[data-c]")]
  const n = letters.length
  const order = new Float32Array(n)
  if (mode === "scan") {
    // Skaner: wiersz po wierszu (z pozycji w układzie), w wierszu lekko od lewej.
    const tops = letters.map((letter) => letter.offsetTop)
    const lines = [...new Set(tops.map((top) => Math.round(top)))].sort((a, b) => a - b)
    letters.forEach((letter, i) => {
      const line = lines.indexOf(Math.round(tops[i] ?? 0))
      const x = letter.offsetLeft / Math.max(1, root.offsetWidth)
      order[i] = (line + x * 0.35) / Math.max(1, lines.length)
    })
  } else {
    letters.forEach((_, i) => {
      const position = i / Math.max(1, n - 1)
      const noise = hash(i)
      order[i] =
        mode === "scramble"
          ? noise
          : mode === "dissolve"
            ? noise * 0.55 + position * 0.45
            : position * 0.92 + noise * 0.08
    })
  }
  return { letters, order }
}

function hash(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function pick(glyphs: string) {
  return glyphs[Math.floor(Math.random() * glyphs.length)] ?? "0"
}

/**
 * Ustawia stan liter dla postępu `p` (0 — wszystko zakodowane, 1 — tekst).
 * `tick` — czy w tej klatce glify w paśmie mają się zmienić (tempo `fps`).
 * Zwraca, czy coś jest jeszcze w paśmie.
 */
export function paint(target: DecodeTarget, variant: Variant, p: number, tick: boolean): boolean {
  const glyphs = TEXT_GLYPHS[variant.charset]
  const band = bandFor(variant.decode, target.letters.length)
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
    // Rozpad: w paśmie glif najpierw cichnie, potem znika — reszta miga.
    if (letter.dataset.s !== "1") {
      letter.dataset.s = "1"
      letter.dataset.g = pick(glyphs)
    } else if (tick && (variant.mode !== "dissolve" || Math.random() < 0.5)) {
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
