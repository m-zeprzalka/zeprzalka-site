/**
 * Polska typografia jako podpis rzemiosła (propozycja dla serwisu):
 * - twarda spacja po jednoliterowych spójnikach i przyimkach, żeby nie wisiały
 *   na końcu wiersza („projekty w / produkty” → „projekty / w produkty”),
 * - półpauza zamiast dywizu między słowami.
 * Tekst źródłowy się nie zmienia — zmienia się wyłącznie jego skład.
 */
export function typo(text: string): string {
  return text.replace(/(^|[\s(„])([aiouwzAIOUWZ])\s+/g, "$1$2 ").replace(/\s-\s/g, " – ")
}
