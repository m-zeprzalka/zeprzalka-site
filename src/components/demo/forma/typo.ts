/**
 * Polski skład: twarda spacja po jednoliterowych spójnikach i przyimkach
 * („projekty w / produkty” → „projekty / w produkty”) i półpauza zamiast
 * dywizu między słowami. Tekst źródłowy się nie zmienia, tylko jego skład.
 */
export function typo(text: string): string {
  return text.replace(/(^|[\s(„])([aiouwzAIOUWZ])\s+/g, "$1$2 ").replace(/\s-\s/g, " – ")
}
