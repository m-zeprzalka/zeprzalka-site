/**
 * Kotwice strony — wspólne dla serwera (treść, paleta) i klienta (spis,
 * towarzysz). Bez importów treści.
 */
export const SECTION = {
  start: "start",
  about: "o-mnie",
  skills: "kompetencje",
  works: "realizacje",
  blog: "blog",
  contact: "kontakt",
} as const

export type SectionId = (typeof SECTION)[keyof typeof SECTION]

/** Id korzenia — portale Radiksa renderują się do środka, żeby działały tokeny `.fm`. */
export const ROOT_ID = "indeks-2"
