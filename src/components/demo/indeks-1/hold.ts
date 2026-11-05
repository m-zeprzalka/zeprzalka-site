/** Górna granica wiersza (pod lepkim nagłówkiem) i dolny oddech pod rozwiniętą treścią. */
const TOP_LIMIT = 80
const BOTTOM_GAP = 24

/**
 * Gdzie ma stanąć wiersz: tam, gdzie był (pod kursorem, pod palcem), chyba
 * że treść pod nim nie zmieściłaby się w oknie — wtedy wiersz podjeżdża
 * dokładnie o tyle, żeby było widać całość — i nigdy nie stoi pod lepkim
 * nagłówkiem (wiersz schowany pod nim zjeżdża w kadr).
 */
export function goalTop(top: number, rowHeight: number, panelHeight: number): number {
  const fit = window.innerHeight - BOTTOM_GAP - rowHeight - panelHeight
  return Math.max(TOP_LIMIT, Math.min(top, fit))
}

const isOpen = (panel: HTMLElement) =>
  panel.hasAttribute("data-open") || panel.getAttribute("data-state") === "open"

/**
 * Wiersz stoi tam, gdzie był: przez cały czas przejścia przewijamy stronę
 * o tyle, o ile wiersz się przesunął (zwijająca się treść nad nim nie
 * „wyciąga” go spod kursora ani spod palca). Potem, jeśli rozwinięta treść
 * wystaje poza okno, strona łagodnie dosuwa ją do kadru — cała karta jest
 * widoczna, także na telefonie po mocnym przewinięciu.
 */
export function holdInPlace(
  element: HTMLElement,
  panel: HTMLElement | null | (() => HTMLElement | null | undefined),
  top: number,
  duration: number
) {
  const end = performance.now() + duration
  const step = () => {
    const delta = element.getBoundingClientRect().top - top
    if (Math.abs(delta) > 0.5) window.scrollBy({ top: delta, behavior: "instant" })
    if (performance.now() < end) {
      requestAnimationFrame(step)
      return
    }
    const target = typeof panel === "function" ? panel() : panel
    if (!target || !isOpen(target)) return
    const now = element.getBoundingClientRect().top
    const goal = goalTop(now, element.offsetHeight, target.offsetHeight)
    if (Math.abs(goal - now) > 0.5) window.scrollBy({ top: now - goal })
  }
  requestAnimationFrame(step)
}
