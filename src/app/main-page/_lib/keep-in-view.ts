import { HEADER_OFFSET } from "@/app/main-page/_lib/anchors"

/** Tyle trwa rozwinięcie akordeonu (`animate-expand`, globals.css) z zapasem. */
const EXPAND_MS = 260
/** Wolne miejsce nad dolną krawędzią okna. */
const BOTTOM_GAP = 16

/** Numer bieżącego przytrzymania — nowe (albo przewinięcie przez użytkownika) kończy poprzednie. */
let current = 0

/**
 * Otwierany element akordeonu zostaje tam, gdzie go kliknięto, choć nad nim
 * zwija się poprzedni (kompensacja przewinięcia klatka po klatce), a po
 * rozwinięciu cały mieści się w oknie — na telefonie nie ucina się pół karty.
 * `holdMs` wydłuża przytrzymanie (np. na czas przelotu kadru w portfolio).
 * Przytrzymanie przewija natychmiast (`instant`); dosunięcie — tak, jak każe CSS
 * (płynnie, a przy „ogranicz ruch” od razu). Kolejne kliknięcie albo przewinięcie
 * przez użytkownika kończy poprzednie przytrzymanie — strona nie drga.
 */
export function keepInView(item: HTMLElement, holdMs = EXPAND_MS) {
  const run = ++current
  const start = item.getBoundingClientRect().top
  const until = performance.now() + holdMs
  // Kółko albo dotyk w trakcie: użytkownik przewija sam — oddajemy mu stronę.
  const release = () => {
    if (run === current) current++
  }
  window.addEventListener("wheel", release, { once: true, passive: true })
  window.addEventListener("touchstart", release, { once: true, passive: true })
  const done = () => {
    window.removeEventListener("wheel", release)
    window.removeEventListener("touchstart", release)
  }

  const reveal = () => {
    const box = item.getBoundingClientRect()
    const overflow = box.bottom - (window.innerHeight - BOTTOM_GAP)
    if (overflow <= 0) return
    // Nigdy tak daleko, żeby górna krawędź schowała się pod nagłówkiem.
    window.scrollBy({ top: Math.min(overflow, box.top - HEADER_OFFSET) })
  }

  const hold = () => {
    if (run !== current) return done()
    const drift = item.getBoundingClientRect().top - start
    if (Math.abs(drift) > 0.5) window.scrollBy({ top: drift, behavior: "instant" })
    if (performance.now() < until) return void requestAnimationFrame(hold)
    done()
    reveal()
  }

  requestAnimationFrame(hold)
}
