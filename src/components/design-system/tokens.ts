import "server-only"
import fs from "node:fs"
import path from "node:path"
import { cache } from "react"

export interface TokenSource {
  light: string
  dark: string
}

/**
 * Źródłem prawdy o tokenach jest `src/app/globals.css`, a nie arkusz wysłany
 * do przeglądarki: Lightning CSS minifikuje kolory do najkrótszego zapisu
 * (`oklch(1 0 0)` → `#fff`), więc odczyt z dokumentu pokazałby postać, której
 * nikt nie edytuje. Plik czytamy raz, przy budowaniu strony.
 */
// `:root` i `.dark` (ta druga w `@media not print`, więc z dowolnym wcięciem).
const BLOCK = /^\s*(:root|\.dark)\s*\{([^}]*)\}/gm
const DECLARATION = /(--[\w-]+)\s*:\s*([^;]+);/g

const readTokens = cache((): Map<string, TokenSource> => {
  const map = new Map<string, TokenSource>()
  // Brak pliku to błąd builda, a nie katalog z kreskami zamiast wartości.
  const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8")

  for (const [, selector, body = ""] of css.matchAll(BLOCK)) {
    const scope = selector === ".dark" ? "dark" : "light"
    for (const [, name = "", value = ""] of body.matchAll(DECLARATION)) {
      const entry = map.get(name) ?? { light: "", dark: "" }
      entry[scope] = value.trim()
      map.set(name, entry)
    }
  }

  return map
})

export function getToken(variable: string): TokenSource {
  return readTokens().get(variable) ?? { light: "", dark: "" }
}
