/*
 * Jedno wideo naraz (wzór: `glif/players.ts`): z odkodowanych kafli gra tylko ten pod kursorem albo
 * najbliżej środka ekranu (wybierany, gdy przewijanie się zatrzyma). Kilka
 * klipów naraz to zbędna praca procesora, baterii i łącza.
 */
type SetActive = (active: boolean) => void

const players = new Map<HTMLElement, SetActive>()
let frame = 0
/** Wybór po przewijaniu dopiero po 700 ms spokoju — szybkie przewijanie nie pobiera klipów po drodze. */
let settle: ReturnType<typeof setTimeout> | undefined
/** Kafel pod kursorem ma pierwszeństwo przed tym najbliżej środka. */
let hovered: HTMLElement | null = null

function elect() {
  frame = 0
  const midX = window.innerWidth / 2
  const midY = window.innerHeight / 2
  let best: HTMLElement | null = hovered && players.has(hovered) ? hovered : null
  let bestDistance = best ? -1 : Infinity
  for (const element of players.keys()) {
    const rect = element.getBoundingClientRect()
    const distance =
      Math.abs(rect.top + rect.height / 2 - midY) + Math.abs(rect.left + rect.width / 2 - midX) / 4
    if (distance < bestDistance) {
      best = element
      bestDistance = distance
    }
  }
  players.forEach((setActive, element) => setActive(element === best))
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(elect)
}

function onScroll() {
  clearTimeout(settle)
  settle = setTimeout(schedule, 700)
}

export function setHovered(element: HTMLElement | null) {
  if (element === null && hovered === null) return
  hovered = element
  schedule()
}

export function addPlayer(element: HTMLElement, setActive: SetActive) {
  if (players.size === 0) window.addEventListener("scroll", onScroll, { passive: true })
  players.set(element, setActive)
  schedule()
}

export function removePlayer(element: HTMLElement) {
  players.delete(element)
  if (players.size === 0) {
    window.removeEventListener("scroll", onScroll)
    clearTimeout(settle)
  }
  schedule()
}
