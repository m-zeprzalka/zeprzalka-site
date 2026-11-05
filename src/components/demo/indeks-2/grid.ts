/**
 * Miejsca w siatce (`.i2-grid`: 4 / 8 / 12 kolumn) — jedyne źródło prawdy dla
 * wszystkich sekcji i elementów przyklejonych. Tekst: 1–7 (tablet, laptop),
 * od 1280 px 3–8; margines kart: 8–12, od 1280 px 9–12; spis: 1–2 od 1280 px.
 */
export const COL = {
  /** Wąska kolumna tekstu. */
  text: "col-span-full sm:col-[1/8] lg:col-[1/8] xl:col-[3/9]",
  /** Margines — media i karty (tylko od 1024 px). */
  margin: "lg:col-[8/13] xl:col-[9/13]",
  /** Spis sekcji po lewej (od 1280 px). */
  rail: "xl:col-[1/3]",
  /** Tekst + margines — szerokie media (masonry). */
  wide: "col-span-full lg:col-[1/13] xl:col-[3/13]",
} as const
