/** Identyfikator korzenia koncepcji — portale (menu, paleta, podgląd) renderują się w nim, bo tam żyją tokeny Formy. */
export const ROOT_ID = "b2-root"

/** Kontener portali: korzeń koncepcji (na serwerze brak — portale i tak renderują się tylko w przeglądarce). */
export function portalRoot(): HTMLElement | undefined {
  return typeof document === "undefined"
    ? undefined
    : (document.getElementById(ROOT_ID) ?? undefined)
}

/** Kotwice sekcji — wspólne dla nagłówka, palety ⌘K i sygnetu. */
export const SECTIONS = {
  start: "start",
  portfolio: "portfolio",
  about: "o-mnie",
  skills: "kompetencje",
  video: "wideo",
  blog: "blog",
  contact: "kontakt",
} as const
