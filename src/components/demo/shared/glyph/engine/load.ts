import type * as Engine from "./engine"

/*
 * Leniwe ładowanie silnika (ogl + shadery + atlasy): osobny fragment JS. Start jest
 * odsuwany za wejście strony — domyślnie najwcześniej 1,2 s po wejściu, potem
 * w bezczynności, a GPU rozgrzewa się w krokach (`warmUp`). Strona do tego czasu jest
 * kompletna (warstwy zastępcze w HTML). Konsument może przesunąć start:
 * `deferGlyphEngine(ms)` — wywołane przed pierwszym użyciem (np. w module strony).
 */
let pending: Promise<typeof Engine | null> | null = null
let startAt = 1200

/** Najwcześniejszy start silnika w ms od wejścia na stronę (domyślnie 1200). */
export function deferGlyphEngine(ms: number) {
  startAt = Math.max(0, ms)
}

function idle(): Promise<void> {
  return new Promise((resolve) => {
    if ("requestIdleCallback" in window)
      window.requestIdleCallback(() => resolve(), { timeout: 800 })
    else setTimeout(resolve, 16)
  })
}

export function loadEngine(): Promise<typeof Engine | null> {
  pending ??= (async () => {
    const wait = startAt - performance.now()
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
    await idle()
    // Znaczniki na osi czasu (Performance) — widać, że silnik startuje za wejściem strony.
    performance.mark("gx:engine-start")
    const engine = await import("./engine")
    const ok = await engine.warmUp()
    performance.mark("gx:engine-ready")
    return ok ? engine : null
  })().catch(() => null)
  return pending
}

let queue: Promise<void> = Promise.resolve()

/** Kolejka tworzenia powierzchni: każda w osobnym kroku bezczynności. */
export function nextSlot(): Promise<void> {
  queue = queue.then(idle)
  return queue
}
