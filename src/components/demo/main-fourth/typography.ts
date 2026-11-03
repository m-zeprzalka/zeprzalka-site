/**
 * Polska typografia: spójniki i przyimki jednoliterowe (a, i, o, u, w, z)
 * nie mogą zostawać na końcu wiersza. Zamiast zwykłej spacji wstawiamy po
 * nich spację nierozdzielającą, więc słowo przechodzi do następnego wiersza
 * razem z nimi — niezależnie od szerokości ekranu.
 *
 * Działa na warstwie prezentacji: dane w `home-content.ts` zostają czystym
 * tekstem, a złamania liczy przeglądarka.
 */
const ORPHAN = /(^|[\s(„"'])([aiouwzAIOUWZ])[ \t]+/g

export function pl(text: string): string {
  return text.replace(ORPHAN, "$1$2 ")
}
