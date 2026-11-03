import { Fraunces } from "next/font/google"

/**
 * Jedyny krój dodany przez ten wariant. Fraunces jest zmienny na osi
 * optycznej (`opsz` 9–144) — w nagłówkach ustawiamy ją na maksimum, przez co
 * kontrast kresek rośnie i litera zachowuje się jak krój display, a nie
 * powiększony tekst. Kursywa jest osobnym plikiem, bo to prawdziwa kursywa
 * (inne kształty liter), a nie pochylenie.
 *
 * Tekst, etykiety i UI zostają na Geist z globalnego layoutu — jeden dodatkowy
 * krój, nie trzy.
 */
export const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-m4-display",
  display: "swap",
})
