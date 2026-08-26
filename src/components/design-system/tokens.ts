import fs from "fs"
import path from "path"
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
const BLOCK = /(:root|\.dark)\s*\{([^}]*)\}/g
const DECLARATION = /(--[\w-]+)\s*:\s*([^;]+);/g

export const readTokens = cache((): Map<string, TokenSource> => {
  const map = new Map<string, TokenSource>()
  const file = path.join(process.cwd(), "src/app/globals.css")

  let css: string
  try {
    css = fs.readFileSync(file, "utf8")
  } catch {
    return map
  }

  for (const [, selector, body] of css.matchAll(BLOCK)) {
    const scope = selector === ".dark" ? "dark" : "light"
    for (const [, name, value] of body.matchAll(DECLARATION)) {
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
