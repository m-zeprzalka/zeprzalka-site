/** Kotwice sekcji strony głównej — stałe dla obu języków (serwer i klient). */
export const SECTION = {
  start: "start",
  about: "o-mnie",
  skills: "kompetencje",
  work: "portfolio",
  blog: "blog",
  contact: "kontakt",
} as const

/** Kotwica realizacji w portfolio — wyszukiwarka i dowody kompetencji otwierają nią wiersz. */
export const WORK_PREFIX = "realizacja-"
export const workAnchor = (slug: string) => `${WORK_PREFIX}${slug}`
