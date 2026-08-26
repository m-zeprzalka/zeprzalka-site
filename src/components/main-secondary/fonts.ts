import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google"

/**
 * Fonty wyłącznie dla /main-secondary — ładowane tylko na tej trasie.
 * Body pozostaje na Geist (z layoutu), więc kosztem nowej typografii
 * są dokładnie dwa dodatkowe pliki: display (nagłówki) i akcent (kursywa).
 */
export const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--font-ms-display",
  display: "swap",
})

export const accent = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin", "latin-ext"],
  variable: "--font-ms-accent",
  display: "swap",
})
