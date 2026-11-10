/**
 * Wartości tokenów prosto z arkuszy (`globals.css`, `code.css`) — tabele design systemu
 * nie trzymają kopii liczb, więc zmiana w arkuszu od razu zmienia dokumentację.
 */
import "server-only"
import fs from "node:fs"
import path from "node:path"

/**
 * Arkusz bez komentarzy — tekst w komentarzu nie udaje deklaracji. Ścieżka z samych dosłownych
 * segmentów wprost w `readFileSync`: tylko wtedy Turbopack śledzi ten jeden plik. Ścieżka ze
 * zmiennej (`readFileSync(file)`, `...segmenty`) wciągała do funkcji strony cały projekt —
 * z piaskownicą `/demo` (pilnuje `check:build --production`).
 */
function sheet(name: "globals" | "code"): string {
  const css =
    name === "globals"
      ? fs.readFileSync(path.join(process.cwd(), "src", "app", "globals.css"), "utf8")
      : fs.readFileSync(path.join(process.cwd(), "src", "components", "blog", "code.css"), "utf8")
  return css.replace(/\/\*[\s\S]*?\*\//g, "")
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
export function themeTokens(name: "globals" | "code") {
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
