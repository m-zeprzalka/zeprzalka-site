/**
 * Kotwice strony — wspólne dla serwera (treść, nagłówki, paleta) i klienta
 * (spis sekcji, realizacje otwierane z `#realizacja-…`). Bez importów treści.
 */
export const SECTION = {
  start: "start",
  about: "o-mnie",
  skills: "kompetencje",
  works: "realizacje",
  blog: "blog",
  contact: "kontakt",
} as const

/** Id korzenia — portale Radiksa renderują się do środka, żeby działały tokeny `.fm`. */
export const ROOT_ID = "indeks-1"

const WORK_PREFIX = "realizacja-"

export const workAnchor = (slug: string) => `${WORK_PREFIX}${slug}`

/** Slug realizacji z `#realizacja-…` albo `null`. */
export function workFromHash(hash: string): string | null {
  return hash.startsWith(`#${WORK_PREFIX}`)
    ? decodeURIComponent(hash.slice(WORK_PREFIX.length + 1))
    : null
}
