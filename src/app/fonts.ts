import { Geist, Geist_Mono } from "next/font/google"

/*
 * `latin-ext` jest konieczny: ą, ę, ł, ś, ż… leżą poza podstawowym zakresem
 * łacińskim. Bez tego plik z polskimi znakami był wykrywany dopiero po
 * zbudowaniu układu i doczytywany osobno — ogonki pojawiały się z opóźnieniem.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
})

/*
 * Krój mono pojawia się wyłącznie w blokach kodu wpisów, więc nie ma powodu
 * pobierać go z wyprzedzeniem na każdej stronie serwisu.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  preload: false,
})

/** Klasy ze zmiennymi krojów — na `<html>` układów głównych i ekranu `global-error`. */
export const fontVariables = `${geistSans.variable} ${geistMono.variable}`
