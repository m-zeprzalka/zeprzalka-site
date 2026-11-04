/**
 * Kotwice i glify sekcji — wspólne dla serwera i klienta (bez importów treści).
 *
 * Glif to znak sekcji w spisie i w logo: logo pokazuje glif sekcji, którą
 * właśnie czytasz. Znaki z ASCII i Latin-1, więc Geist Mono ma je wszystkie
 * (zestaw matematyczny z obecnego logo bywa pustym prostokątem bez czcionek
 * z symbolami).
 */
export const SECTIONS = ["start", "kompetencje", "realizacje", "blog", "kontakt"] as const
export type SectionId = (typeof SECTIONS)[number]

export const GLYPH: Record<SectionId, string> = {
  start: "*",
  kompetencje: "&",
  realizacje: "#",
  blog: "¶",
  kontakt: "@",
}

/** Znaki, przez które glif „przelatuje” przy zmianie — gęstość jak w grafice ASCII. */
export const SCRAMBLE = Array.from("*&#¶@%+=§~^<>/\\|:?!$±×÷°¤")

const WORK_PREFIX = "realizacja-"

export const workAnchor = (slug: string) => `${WORK_PREFIX}${slug}`

/** Slug realizacji z `#realizacja-…` albo `null`. */
export function workFromHash(hash: string): string | null {
  return hash.startsWith(`#${WORK_PREFIX}`)
    ? decodeURIComponent(hash.slice(WORK_PREFIX.length + 1))
    : null
}

/** Id korzenia — portale Radiksa renderują się do środka, żeby działały tokeny `.fm`. */
export const ROOT_ID = "tryptyk"

/** Id sceny (prawa kolumna) — wiersze realizacji wskazują ją przez `aria-controls`. */
export const STAGE_ID = "tk-scena"

/** Szerokość sceny dla next/image: 21rem (1024–1279) → 26rem (≥ 1600). */
export const STAGE_SIZES = "(min-width: 100rem) 26rem, (min-width: 80rem) 25vw, 21rem"
