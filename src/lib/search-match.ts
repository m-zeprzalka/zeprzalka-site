/**
 * Dopasowanie w ⌘K — zamiast rozmytego `defaultFilter` z cmdk, który na „css” zostawiał
 * 47 z 57 pozycji (litery w dowolnej kolejności w opisach), a „CSS od podstaw” stało piąte.
 */

/** Napis do porównań: małe litery, bez znaków diakrytycznych („ł” NFD nie rozkłada — osobno). */
export function fold(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/ł/g, "l")
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * Trafność pozycji dla zapytania; 0 — nie pasuje. Każde słowo zapytania musi się znaleźć:
 * w nazwie (początek nazwy 4 > początek słowa 3 > środek słowa 2) albo w podpowiedzi i opisie
 * (1, tylko od początku słowa — opis jest długi, a środek słowa łapałby prawie wszystko).
 * Bez zapytania pasuje wszystko po równo (kolejność z danych).
 */
export function matchScore(query: string, label: string, extra: readonly string[] = []): number {
  const terms = fold(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return 1
  const name = fold(label)
  const rest = fold(extra.join(" "))
  let score = 0
  for (const term of terms) {
    const wordStart = new RegExp(`(?:^|[^\\p{L}\\p{N}])${escape(term)}`, "u")
    if (name.startsWith(term)) score += 4
    else if (wordStart.test(name)) score += 3
    else if (name.includes(term)) score += 2
    else if (wordStart.test(rest)) score += 1
    else return 0
  }
  return score
}
