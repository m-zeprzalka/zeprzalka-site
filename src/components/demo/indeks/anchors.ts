/**
 * Kotwice strony — wspólne dla serwera (treść, nagłówki, paleta) i klienta
 * (realizacje otwierają wiersz na `hashchange`). Bez importów treści, więc
 * moduł może trafić do paczki przeglądarki.
 */
export const SECTION = {
  start: "start",
  skills: "kompetencje",
  works: "realizacje",
  blog: "blog",
  contact: "kontakt",
} as const

const WORK_PREFIX = "realizacja-"

export const workAnchor = (slug: string) => `${WORK_PREFIX}${slug}`

/** Slug realizacji z `#realizacja-…` albo `null`. */
export function workFromHash(hash: string): string | null {
  return hash.startsWith(`#${WORK_PREFIX}`)
    ? decodeURIComponent(hash.slice(WORK_PREFIX.length + 1))
    : null
}
