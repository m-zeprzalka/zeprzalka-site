/**
 * Pozycje palety ⌘K — kształt danych, który serwer podaje paletę (bez importów
 * treści, więc plik może trafić do paczki klienta). Wzór: `indeks/types.ts`.
 */
export type PaletteIcon = "section" | "work" | "post" | "page" | "mail" | "theme" | "external"

export interface PaletteItem {
  id: string
  label: string
  /** Druga kolumna: kategoria, data, skrót. */
  hint?: string
  icon: PaletteIcon
  /** Kotwica na tej stronie (#…), trasa serwisu (/…) albo adres zewnętrzny. */
  href?: string
  /** Akcja zamiast nawigacji. */
  action?: "copy-email" | "theme"
  /** Realizacja — otwiera podgląd zamiast nawigacji. */
  work?: string
  keywords?: string
}

export interface PaletteGroup {
  id: string
  heading: string
  items: readonly PaletteItem[]
}
