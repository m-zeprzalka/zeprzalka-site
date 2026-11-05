/** Wczytuje i dekoduje obraz (bez wstawiania do DOM). */
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
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Sprężyna wykładnicza (krytycznie tłumiona) — położenie kursora i siła efektów. */
export function follow(current: number, target: number, dt: number, tau: number) {
  return target + (current - target) * Math.exp(-dt / tau)
}

/** Okres przebiegu w trybie ciągłym (s): dłuższe dekodowanie = spokojniejszy rytm. */
export function passPeriod(decode: number): number {
  return 2.4 + (decode / 1000) * 2.6
}
