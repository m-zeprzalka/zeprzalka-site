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
 * Lookbehind nie zjada spacji przed literą, więc łańcuch „i w domu” sklei się cały.
 * Tak samo liczba z następnym słowem.
 */
export function noOrphans(text: string): string {
  return (
    text
      .replace(/(?<=^|\s)([aiouwz])\s+/giu, "$1\u00A0")
      // Liczba nie odrywa się od jednostki („24 godziny”, „15 lat”, „2900 zł”).
      .replace(/(\d)\s+(?=\p{L})/gu, "$1\u00A0")
  )
}

/** Pierwsze wystąpienie frazy jako całych słów („web” nie trafi w „website”); -1 — brak. */
function wordIndex(text: string, phrase: string): number {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return text.search(new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "u"))
}

/**
 * Dzieli tekst na zwykłe fragmenty i frazy otwierające kartę podglądu.
 * `phrases` to mapa: klucz karty → fraza, dokładnie tak, jak stoi w tekście.
 * Brak frazy w tekście to błąd treści — zatrzymuje build zamiast po cichu
 * zgubić podgląd.
 */
export function segment(text: string, phrases: Record<string, string>): Segment[] {
  const found = Object.entries(phrases)
    .map(([peek, phrase]) => {
      const clean = noOrphans(phrase)
      return { peek, phrase: clean, at: wordIndex(text, clean) }
    })
    .sort((a, b) => a.at - b.at)

  const missing = found.find((entry) => entry.at < 0)
  if (missing) throw new Error(`main-page: fraza „${missing.phrase}” nie występuje w tekście`)

  const segments: Segment[] = []
  let cursor = 0
  for (const { peek, phrase, at } of found) {
    // Nakładające się frazy dałyby zdublowany albo ucięty tekst — błąd treści, nie cicha usterka.
    if (at < cursor) throw new Error(`main-page: fraza „${phrase}” nachodzi na poprzednią`)
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
