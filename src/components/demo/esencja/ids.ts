/** Identyfikator korzenia koncepcji — portale (menu, podgląd) renderują się w nim, bo tam żyją tokeny Formy. */
export const ROOT_ID = "es-root"

/** Kontener portali: korzeń koncepcji (na serwerze — brak; portale i tak renderują się tylko w przeglądarce). */
export function portalRoot(): HTMLElement | undefined {
  return typeof document === "undefined"
    ? undefined
    : (document.getElementById(ROOT_ID) ?? undefined)
}
