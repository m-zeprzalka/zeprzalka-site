import localFont from "next/font/local"

/*
 * Kroje sygnetu logo: podzbiory z 165 znakami (licencja obok, `fonts/LICENSE.md`).
 * Własna metryka zamiast krojów systemowych: znak nie zmienia wysokości wiersza
 * i nie zamienia się w pusty prostokąt na systemie bez danego glifu.
 * `display: block` — przez ułamek sekundy pusto, ale nigdy cudzy krój.
 */
const symbols = localFont({
  src: "./fonts/logo-symbols.woff2",
  variable: "--font-logo-symbols",
  display: "block",
})

const math = localFont({
  src: "./fonts/logo-math.woff2",
  variable: "--font-logo-math",
  display: "block",
})

/** Zmienne krojów logo — na `<html>` obok zmiennych Geist. */
export const logoFontVariables = `${symbols.variable} ${math.variable}`
