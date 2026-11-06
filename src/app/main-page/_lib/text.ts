import type { Segment } from "./types"

/** Zdania akapitu (podział po kropce, wykrzykniku albo pytajniku i spacji). */
export function sentences(text: string): string[] {
  return text
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
}

/**
 * Polska typografia: jednoliterowe spójniki i przyimki („i”, „w”, „z”…) nie
 * zostają na końcu wiersza — sklejamy je twardą spacją z następnym słowem.
 */
export function noOrphans(text: string): string {
  return text.replace(/(^|\s)([aiouwzAIOUWZ])\s+/g, "$1$2 ")
}

/**
 * Dzieli tekst na zwykłe fragmenty i frazy otwierające kartę podglądu.
 * `phrases` to mapa: klucz karty → fraza, dokładnie tak, jak stoi w tekście.
 * Brak frazy w tekście to błąd treści — zatrzymuje build zamiast po cichu
 * zgubić podgląd.
 */
export function segment(text: string, phrases: Record<string, string>): Segment[] {
  const found = Object.entries(phrases)
    .map(([peek, phrase]) => ({
      peek,
      phrase: noOrphans(phrase),
      at: text.indexOf(noOrphans(phrase)),
    }))
    .sort((a, b) => a.at - b.at)

  const missing = found.find((entry) => entry.at < 0)
  if (missing) throw new Error(`main-page: fraza „${missing.phrase}” nie występuje w tekście`)

  const segments: Segment[] = []
  let cursor = 0
  for (const { peek, phrase, at } of found) {
    if (at > cursor) segments.push({ text: text.slice(cursor, at) })
    segments.push({ text: phrase, peek })
    cursor = at + phrase.length
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) })
  return segments
}

/** Ciąg nagłówka sekcji po pauzie zaczyna się małą literą („Kompetencje — umiejętności…”). */
export function lowerFirst(text: string): string {
  return text.charAt(0).toLocaleLowerCase() + text.slice(1)
}
