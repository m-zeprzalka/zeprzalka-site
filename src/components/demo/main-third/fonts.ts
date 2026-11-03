import { Archivo } from "next/font/google"

/**
 * Jeden krój zmienny dla całej typografii display wariantu /main-third.
 * Archivo ma oś szerokości (wdth 62–125) — akcent budujemy kontrastem osi
 * (wąskie/szerokie, lekkie/ciężkie), a nie drugim krojem. Jeden plik, jedno
 * pobranie, pełna kontrola nad rytmem nagłówków.
 * Tekst i etykiety zostają na Geist / Geist Mono z globalnego layoutu.
 */
export const display = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-m3-display",
  display: "swap",
})
