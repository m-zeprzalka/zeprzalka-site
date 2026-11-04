/** Id korzenia koncepcji — portale Radiksa renderują się do środka, żeby działały tokeny `.fm`. */
export const ROOT_ID = "reedycja"

/** Kotwice sekcji strony głównej. */
export const SECTION = {
  start: "start",
  about: "o-mnie",
  skills: "kompetencje",
  works: "portfolio",
  blog: "blog",
  contact: "kontakt",
} as const

export function portalRoot(): HTMLElement | undefined {
  return typeof document === "undefined"
    ? undefined
    : (document.getElementById(ROOT_ID) ?? undefined)
}
