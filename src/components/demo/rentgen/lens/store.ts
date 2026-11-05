"use client"

/**
 * Wspólny stan „Rentgenu” dla wysp klienckich: tryb strony (projekt / kod)
 * i bieżący kształt soczewki w układzie dokumentu. Silnik soczewki pisze,
 * przełącznik w nagłówku i widoki znaków (WebGL) czytają. Zwykły moduł zamiast
 * kontekstu Reacta — soczewka zmienia się 60 razy na sekundę i nie może
 * przerenderowywać drzewa.
 */

export type Mode = "design" | "code"

/** Zaokrąglony prostokąt w px dokumentu: środek, rozmiar, promień. */
export interface Shape {
  x: number
  y: number
  w: number
  h: number
  r: number
}

let mode: Mode = "design"
const modeListeners = new Set<() => void>()

export const modeStore = {
  get: (): Mode => mode,
  getServer: (): Mode => "design",
  subscribe(listener: () => void) {
    modeListeners.add(listener)
    return () => modeListeners.delete(listener)
  },
  set(next: Mode) {
    if (next === mode) return
    mode = next
    document.querySelector<HTMLElement>("[data-rg-root]")?.setAttribute("data-mode", next)
    modeListeners.forEach((listener) => listener())
  },
}

/**
 * Prośba o zmianę trybu z punktu (środek przełącznika, px dokumentu). Silnik
 * soczewki odpowiada kołem z tego punktu; bez silnika (ograniczony ruch,
 * telefon bez WebGL…) tryb zmienia się od razu.
 */
type ModeRequest = (next: Mode, originX: number, originY: number) => void
let requestHandler: ModeRequest | null = null

export function onModeRequest(handler: ModeRequest | null) {
  requestHandler = handler
}

export function requestMode(next: Mode, originX: number, originY: number) {
  if (requestHandler) requestHandler(next, originX, originY)
  else modeStore.set(next)
}

/** Kształt soczewki (czytany co klatkę przez widoki znaków). `w = 0` — zamknięta. */
export const lens: Shape & { inverted: boolean } = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  r: 0,
  inverted: false,
}

const frameListeners = new Set<() => void>()

/** Powiadomienie po każdej klatce silnika, w której soczewka się zmieniła. */
export function onLensFrame(listener: () => void) {
  frameListeners.add(listener)
  return () => {
    frameListeners.delete(listener)
  }
}

export function emitLensFrame() {
  frameListeners.forEach((listener) => listener())
}
