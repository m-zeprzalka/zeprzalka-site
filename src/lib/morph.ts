import { prefersReducedMotion } from "@/lib/motion"

/** Nazwa przejścia kadru (CSS: `::view-transition-group(peek-media)` w globals.css). */
const NAME = "peek-media"

/** Bieżące przejście — nowe przerywa poprzednie i przejmuje nazwę oraz `data-instant`. */
let active: { transition: ViewTransition; release: () => void } | null = null

/**
 * Kadr przelatuje z karty na marginesie w miejsce docelowe (View Transitions API):
 * `from` to element, który widać teraz, `update` zmienia stan synchronicznie
 * (`flushSync`) i zwraca element docelowy. Reszta strony zmienia się od razu
 * (bez przenikania całej strony — `::view-transition-*(root)` w globals.css).
 *
 * Zwraca `false`, gdy przejścia nie ma (brak API, „ogranicz ruch”, brak kadru)
 * — wtedy wywołujący zmienia stan zwyczajnie.
 */
export function morph(
  from: HTMLElement | null,
  update: () => HTMLElement | null,
  /** Elementy, które mają zniknąć bez własnych przejść CSS (`data-instant`) — np. karta. */
  instant: readonly (HTMLElement | null)[] = []
): boolean {
  if (!from || !document.startViewTransition || prefersReducedMotion()) return false

  // Dwa kliknięcia szybciej niż przelot: poprzedni kończy się od razu i oddaje
  // nazwę synchronicznie — dwa elementy o tej samej nazwie przerwałyby przejście.
  active?.transition.skipTransition()
  active?.release()

  let target: HTMLElement | null = null
  const release = () => {
    from.style.viewTransitionName = ""
    if (target) target.style.viewTransitionName = ""
    instant.forEach((element) => element?.removeAttribute("data-instant"))
  }
  from.style.viewTransitionName = NAME
  instant.forEach((element) => element?.setAttribute("data-instant", ""))
  const transition = document.startViewTransition(() => {
    from.style.viewTransitionName = ""
    target = update()
    if (target) target.style.viewTransitionName = NAME
  })
  const entry = { transition, release }
  active = entry
  void transition.finished.finally(() => {
    if (active !== entry) return // posprzątało już nowsze przejście
    active = null
    release()
  })
  return true
}
