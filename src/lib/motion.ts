/** „Ogranicz ruch” — jedno zapytanie dla CSS-owych wyjątków, hooków i kodu imperatywnego. */
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION).matches
}

/**
 * Animacja „przy wejściu w kadr” bez wymuszania układu przy starcie strony.
 *
 * Nie mierzymy elementu (`getBoundingClientRect` w efekcie każdego wystąpienia
 * to osobne przeliczenie układu w czasie hydratacji). Odpowiedź daje pierwszy
 * odczyt IntersectionObservera: element widoczny od razu zostaje w spoczynku —
 * nikt nie widzi, jak znika i wraca; element pod zgięciem dostaje `arm()`
 * (stan wyjściowy animacji), a `play()` rusza, gdy wjedzie w kadr.
 *
 * `threshold` — jaka część elementu musi być w kadrze, żeby animacja ruszyła.
 * Zwraca funkcję sprzątającą. Przy „ogranicz ruch” nie robi nic.
 */
export function observeReveal(
  target: Element,
  { arm, play }: { arm: () => void; play: () => void },
  { rootMargin, threshold = 0 }: { rootMargin?: string; threshold?: number } = {}
): () => void {
  if (prefersReducedMotion()) return () => {}
  let first = true
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return
      if (first) {
        first = false
        if (entry.isIntersecting) observer.disconnect()
        else arm()
        return
      }
      if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
        observer.disconnect()
        play()
      }
    },
    { rootMargin, threshold }
  )
  observer.observe(target)
  return () => observer.disconnect()
}
