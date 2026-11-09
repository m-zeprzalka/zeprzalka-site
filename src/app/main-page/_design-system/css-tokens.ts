/**
 * Wartości tokenów prosto z arkuszy (`globals.css`, `code.css`) — tabele design systemu
 * nie trzymają kopii liczb, więc zmiana w arkuszu od razu zmienia dokumentację.
 */
import "server-only"
import fs from "node:fs"
import path from "node:path"

const SHEETS = {
  globals: ["globals.css"],
  code: ["_components", "blog", "code.css"],
} as const

/** Arkusz bez komentarzy — tekst w komentarzu nie udaje deklaracji. */
function sheet(name: keyof typeof SHEETS): string {
  const file = path.join(process.cwd(), "src", "app", "main-page", ...SHEETS[name])
  return fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "")
}

/** Deklaracje `--nazwa: wartość;` z tekstu — pierwsze wystąpienie każdej nazwy. */
function declarations(css: string): Map<string, string> {
  const found = new Map<string, string>()
  for (const [, name = "", value = ""] of css.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
    if (!found.has(name)) found.set(name, value.replace(/\s+/g, " ").trim())
  }
  return found
}

/** Treść pierwszego bloku o danym selektorze (bez zagnieżdżeń — tak wyglądają bloki tokenów). */
function block(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return css.match(new RegExp(`${escaped}\\s*\\{([^{}]*)\\}`))?.[1] ?? ""
}

/** Tokeny jasnego (`:root`) i ciemnego (`.dark`) motywu z arkusza. */
export function themeTokens(name: keyof typeof SHEETS) {
  const css = sheet(name)
  return {
    light: declarations(block(css, ":root")),
    dark: declarations(block(css, ".dark")),
  }
}

/** Wszystkie deklaracje z prefiksem (`--animate-`, `--enter-`…) w kolejności z arkusza. */
export function declared(prefix: string): { name: string; value: string }[] {
  return [...declarations(sheet("globals"))]
    .filter(([name]) => name.startsWith(prefix))
    .map(([name, value]) => ({ name, value }))
}

/**
 * Nadpisania tokenów na progach: bloki `@media (min-width: …) { :root { … } }` z globals.css,
 * w kolejności z arkusza (kolumna, odstęp toru, margines strony).
 */
export function mediaOverrides(): { query: string; tokens: Map<string, string> }[] {
  const css = sheet("globals")
  return [...css.matchAll(/@media\s*\(([^)]*)\)\s*\{\s*:root\s*\{([^{}]*)\}\s*\}/g)].map(
    ([, query = "", body = ""]) => ({ query: query.trim(), tokens: declarations(body) })
  )
}

/** Pierwsza liczba milisekund w wartości („enter 720ms …” → 720). */
export const ms = (value: string | undefined) => Number(value?.match(/(\d+)ms/)?.[1] ?? 0)
