#!/usr/bin/env node
/**
 * Kontrola klas Tailwinda w kodzie serwisu (bez piaskownicy `/demo`) — to samo,
 * co podpowiedzi „suggestCanonicalClasses” w edytorze, ale dla wszystkich plików naraz:
 * każda klasa z `className`, `cn(…)` i `cva(…)` przechodzi przez kanonizację systemu
 * projektowego (`designSystem.canonicalizeCandidates`). Klasa, która ma krótszy
 * zapis (np. `ease-(--ease-out)` → `ease-out`), to błąd.
 *
 *   node scripts/check-classes.mjs [--fix]
 *
 * `--fix` podmienia klasy w plikach. Wynik ≠ 0 → są klasy do poprawy.
 */
import fs from "node:fs"
import path from "node:path"
import { __unstable__loadDesignSystem } from "tailwindcss"

const SRC = path.join(process.cwd(), "src")
const CSS = path.join(SRC, "app", "globals.css")
/** Katalogi z klasami serwisu; piaskownica ma własny arkusz i własne tokeny. */
const DIRS = ["app", "components", "design-system", "lib"].map((dir) => path.join(SRC, dir))
const SKIP = new Set([path.join(SRC, "app", "demo"), path.join(SRC, "components", "demo")])
const fix = process.argv.includes("--fix")

/**
 * `@import` arkuszy: pliki obok albo paczki z `node_modules` — arkusz paczki to pole
 * `exports["."].style` albo `style` w jej package.json (tak rozwiązuje je Tailwind).
 */
async function loadStylesheet(id, base) {
  let file = path.resolve(base, id)
  if (!id.startsWith(".")) {
    const dir = path.join(process.cwd(), "node_modules", id)
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"))
    file = path.join(dir, manifest.exports?.["."]?.style ?? manifest.style ?? "index.css")
  }
  return { path: file, base: path.dirname(file), content: fs.readFileSync(file, "utf8") }
}

const design = await __unstable__loadDesignSystem(fs.readFileSync(CSS, "utf8"), {
  base: path.dirname(CSS),
  loadStylesheet,
})

function* files(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!SKIP.has(full)) yield* files(full)
    } else if (/\.tsx?$/.test(entry.name)) yield full
  }
}

/** Ciągi znaków w kodzie, które wyglądają na listy klas (literały w cudzysłowach i szablonach). */
const STRING = /"([^"\n]*)"|`([^`]*)`/g
const looksLikeClasses = (text) =>
  /(^|\s)[a-z-]+[:\-[(]/.test(text) && !/[{};<>=]/.test(text.replace(/\[[^\]]*\]|\([^)]*\)/g, ""))

let problems = 0
for (const file of DIRS.flatMap((dir) => [...files(dir)])) {
  let source = fs.readFileSync(file, "utf8")
  let changed = false
  for (const match of source.matchAll(STRING)) {
    const text = match[1] ?? match[2] ?? ""
    if (!looksLikeClasses(text)) continue
    for (const candidate of text.split(/\s+/).filter(Boolean)) {
      if (design.parseCandidate(candidate).length === 0) continue
      const [canonical] = design.canonicalizeCandidates([candidate], { rem: 16 })
      if (!canonical || canonical === candidate) continue
      problems++
      console.log(`${path.relative(process.cwd(), file)}: ${candidate} → ${canonical}`)
      if (fix) {
        source = source.replace(
          new RegExp(
            `(?<=[\\s"\`'])${candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=[\\s"\`'])`,
            "g"
          ),
          canonical
        )
        changed = true
      }
    }
  }
  if (changed) fs.writeFileSync(file, source)
}

console.log(
  problems
    ? `\n${problems} klas do poprawy${fix ? " (poprawione)" : ""}.`
    : "Klasy: wszystkie w zapisie kanonicznym."
)
process.exit(problems && !fix ? 1 : 0)
