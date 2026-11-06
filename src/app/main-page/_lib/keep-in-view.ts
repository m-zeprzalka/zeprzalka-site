/** Tyle trwa rozwinięcie akordeonu (`animate-accordion-down` z tw-animate-css). */
const EXPAND_MS = 260
/** Wolne miejsce pod przyklejonym nagłówkiem i nad dolną krawędzią okna. */
const TOP_GAP = 80
const BOTTOM_GAP = 16

/**
 * Otwierany element akordeonu zostaje tam, gdzie go kliknięto, choć nad nim
 * zwija się poprzedni (kompensacja przewinięcia klatka po klatce), a po
 * rozwinięciu cały mieści się w oknie — na telefonie nie ucina się pół karty.
 * Przewijamy natychmiast (`instant`), bo CSS strony ma płynne przewijanie.
 */
export function keepInView(item: HTMLElement) {
  const start = item.getBoundingClientRect().top
  const until = performance.now() + EXPAND_MS

  const hold = () => {
    const drift = item.getBoundingClientRect().top - start
    if (Math.abs(drift) > 0.5) window.scrollBy({ top: drift, behavior: "instant" })
    if (performance.now() < until) requestAnimationFrame(hold)
    else reveal()
  }

  const reveal = () => {
    const box = item.getBoundingClientRect()
    const overflow = box.bottom - (window.innerHeight - BOTTOM_GAP)
    if (overflow <= 0) return
    // Nigdy tak daleko, żeby górna krawędź schowała się pod nagłówkiem.
    window.scrollBy({ top: Math.min(overflow, box.top - TOP_GAP), behavior: "smooth" })
  }

  requestAnimationFrame(hold)
}
