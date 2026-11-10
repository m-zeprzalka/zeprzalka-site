#!/usr/bin/env node
/**
 * Kontrola wyniku `next build` — błędy, których nie złapie TypeScript ani lint,
 * bo widać je dopiero w gotowym HTML-u. Każda reguła tutaj to błąd, który
 * kiedyś naprawdę trafił na produkcję.
 *
 * - karta `summary_large_image` bez `og:image` / `twitter:image` (archiwum
 *   bloga i tagi gubiły obrazek przez płytkie scalanie metadanych),
 * - kotwica (`href="#…"` — spis treści wpisu, link „Przejdź do treści”, wezwania),
 *   której celu nie ma na stronie,
 * - `lang` dokumentu niezgodny z wersją językową adresu,
 * - nie więcej niż jeden canonical i jeden `robots` w nagłówku,
 * - JSON-LD, który nie jest poprawnym JSON-em,
 * - z flagą `--production`: trasy piaskownicy `/demo` w buildzie i pliki piaskownicy
 *   w śladach funkcji (`*.nft.json`) — np. ścieżka `fs` złożona ze zmiennych wciąga cały `src`.
 *
 * Użycie: `pnpm build && pnpm check:build [--production]`
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const APP = path.join(ROOT, ".next/server/app")
const production = process.argv.includes("--production")

if (!fs.existsSync(APP)) {
  console.error("Brak .next/server/app — najpierw `pnpm build`.")
  process.exit(1)
}

/** Wszystkie wyrenderowane strony HTML (bez ekranów systemowych Next). */
function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return htmlFiles(full)
    return entry.name.endsWith(".html") && !entry.name.startsWith("_global-error") ? [full] : []
  })
}

const errors = []
const pages = htmlFiles(APP)

for (const file of pages) {
  const rel = path.relative(APP, file)
  const route =
    "/" +
    rel
      .replace(/\.html$/, "")
      .replace(/^\(pl\)\//, "")
      .replace(/^index$/, "")
  const html = fs.readFileSync(file, "utf8")
  const head = html.slice(0, html.indexOf("</head>"))
  const fail = (msg) => errors.push(`${route}: ${msg}`)

  if (head.includes('name="twitter:card" content="summary_large_image"')) {
    if (!head.includes('property="og:image"')) fail("karta summary_large_image bez og:image")
    if (!head.includes('name="twitter:image"')) fail("karta summary_large_image bez twitter:image")
  }

  const lang = /<html[^>]*\slang="([^"]+)"/.exec(html)?.[1]
  const expected = route === "/en" || route.startsWith("/en/") ? "en" : "pl"
  if (!rel.startsWith("_not-found") && lang !== expected) {
    fail(`lang="${lang}", oczekiwano "${expected}"`)
  }

  if ((head.match(/rel="canonical"/g) ?? []).length > 1) fail("więcej niż jeden canonical")
  if ((head.match(/<meta name="robots"/g) ?? []).length > 1) fail("więcej niż jeden meta robots")

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try {
      JSON.parse(json)
    } catch {
      fail("JSON-LD nie jest poprawnym JSON-em")
    }
  }

  // Kotwice na tej stronie (spis treści wpisu w torze i nad treścią, „Przejdź do treści”,
  // wezwania): każda musi wskazywać istniejący element.
  const body = html.slice(html.indexOf("<body"))
  const ids = new Set([...body.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id))
  for (const [, anchor] of body.matchAll(/<a[^>]*\shref="#([^"]+)"/g)) {
    if (!ids.has(decodeURIComponent(anchor))) fail(`kotwica wskazuje brakujące #${anchor}`)
  }
}

if (production) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(ROOT, ".next/app-path-routes-manifest.json"), "utf8")
  )
  const demoRoutes = Object.values(manifest).filter((route) => route.startsWith("/demo"))
  if (demoRoutes.length > 0)
    errors.push(`build produkcyjny zawiera piaskownicę: ${demoRoutes.join(", ")}`)

  const traces = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return traces(full)
      return entry.name.endsWith(".nft.json") ? [full] : []
    })
  for (const file of traces(APP)) {
    const { files = [] } = JSON.parse(fs.readFileSync(file, "utf8"))
    const demo = files.filter((entry) => /\/src\/(app|components)\/demo\//.test(entry))
    if (demo.length > 0)
      errors.push(`${path.relative(APP, file)}: ślad funkcji z piaskownicą (${demo.length} plików)`)
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `✖ ${error}`).join("\n"))
  const form = new Intl.PluralRules("pl").select(errors.length)
  const noun = form === "one" ? "problem" : form === "few" ? "problemy" : "problemów"
  console.error(`\nBuild: ${errors.length} ${noun} na ${pages.length} stronach.`)
  process.exit(1)
}

console.log(`Build: ${pages.length} stron bez problemów${production ? " (bez /demo)" : ""}.`)
