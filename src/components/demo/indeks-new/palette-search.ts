import type { PaletteGroup, PaletteItem } from "./types"

/**
 * Wyszukiwanie w palecie: bez wielkości liter i polskich znaków („zeprzalka”
 * znajdzie „Zeprzałka”). Normalizujemy znak po znaku, więc indeksy w tekście
 * znormalizowanym odpowiadają oryginałowi i można podświetlić trafienie.
 */
function fold(text: string): string {
  let out = ""
  for (const char of text.toLowerCase()) {
    const base = char === "ł" ? "l" : char.normalize("NFD").replace(/\p{Diacritic}/gu, "")
    out += base.length === char.length ? base : char
  }
  return out
}

export interface Match {
  item: PaletteItem
  /** Zakres trafienia w etykiecie — do podświetlenia. */
  range?: readonly [number, number]
}

export interface MatchGroup {
  group: PaletteGroup
  matches: Match[]
  /** Wszystkie trafienia w grupie (lista może pokazywać mniej). */
  total: number
}

/** Bez zapytania długie grupy pokazują próbkę — pełna lista otwiera się po wpisaniu. */
const PREVIEW = 4
const ALWAYS_FULL = new Set(["sections", "actions"])

export function searchPalette(groups: readonly PaletteGroup[], query: string): MatchGroup[] {
  const tokens = fold(query).trim().split(/\s+/).filter(Boolean)

  return groups
    .map((group) => {
      if (tokens.length === 0) {
        const items = ALWAYS_FULL.has(group.id) ? group.items : group.items.slice(0, PREVIEW)
        return { group, matches: items.map((item) => ({ item })), total: group.items.length }
      }
      const heading = fold(group.heading)
      const matches = group.items.flatMap((item): Match[] => {
        const label = fold(item.label)
        const haystack = `${label} ${fold(item.hint ?? "")} ${fold(item.keywords ?? "")} ${heading}`
        if (!tokens.every((token) => haystack.includes(token))) return []
        const first = tokens[0] ?? ""
        const at = label.indexOf(first)
        return [{ item, range: at >= 0 ? [at, at + first.length] : undefined }]
      })
      // Trafienia od początku etykiety idą na górę grupy.
      matches.sort((a, b) => Number(b.range?.[0] === 0) - Number(a.range?.[0] === 0))
      return { group, matches, total: matches.length }
    })
    .filter((entry) => entry.matches.length > 0)
}
