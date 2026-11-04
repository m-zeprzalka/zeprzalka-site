/**
 * Postęp sceny po stronie klienta — ta sama oś co view timeline w CSS:
 * na desktopie cała wysoka sekcja (`#tf-track`), na telefonie część
 * z przyklejoną ramą pod hero (`#tf-run`). `null` = brak trybu przewijanego
 * (bez `animation-timeline` albo przy „ogranicz ruch”): scena stoi w stanie końcowym.
 */
export function sceneProgress(): number | null {
  const scrolling =
    CSS.supports("animation-timeline: view()") &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (!scrolling) return null
  const id = window.matchMedia("(min-width: 64rem)").matches ? "tf-track" : "tf-run"
  const element = document.getElementById(id)
  if (!element) return null
  const rect = element.getBoundingClientRect()
  const run = rect.height - window.innerHeight
  if (run <= 0) return 1
  return Math.min(1, Math.max(0, -rect.top / run))
}

/** Progi etapów: Szkic → Projekt → Kod → Produkt (jak w arkuszu). */
const STAGE_AT = [0.24, 0.48, 0.72] as const

export function stageOf(progress: number) {
  return STAGE_AT.filter((threshold) => progress >= threshold).length
}
