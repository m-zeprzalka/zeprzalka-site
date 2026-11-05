import type { Decode } from "../lab/config"

/** Okres przebiegu w trybie ciągłym (s): dłuższe dekodowanie = spokojniejszy rytm. */
export function passPeriod(decode: Decode): number {
  return 2.4 + (decode / 1000) * 2.6
}

export function loadImage(src: string): Promise<HTMLImageElement | null> {
  const image = new Image()
  image.decoding = "async"
  image.src = src
  return image
    .decode()
    .then(() => image)
    .catch(() => null)
}

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/* ——— Przewijanie tylko uruchamia: po 300 ms bezruchu każdy przebieg dokańcza się sam ——— */

let lastScroll = 0
if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => (lastScroll = performance.now()), { passive: true })
}

/** Ile ms minęło od ostatniego przewinięcia strony. */
export function scrollIdle(now = performance.now()) {
  return now - lastScroll
}

/**
 * Postęp sterowany przewijaniem, który nigdy nie zostaje w stanie pośrednim:
 * rośnie z przewijaniem (nie cofa się — odczytany tekst zostaje tekstem), a gdy
 * przewijanie stanie na 300 ms, a element jest w kadrze, dochodzi do 1 w czasie.
 */
export class ScrollSettle {
  value = 0

  /** `raw` — postęp z położenia, `dt` — ms od poprzedniej klatki, `ms` — czas dokończenia. */
  update(raw: number, visible: boolean, dt: number, ms = 1100, now = performance.now()) {
    this.value = Math.max(this.value, Math.min(1, Math.max(0, raw)))
    if (visible && this.value < 1 && scrollIdle(now) > 300) {
      this.value = Math.min(1, this.value + dt / ms)
    }
    return this.value
  }

  /** Czy postęp jeszcze się dokańcza (pętla ma się kręcić). */
  get pending() {
    return this.value < 1
  }
}
