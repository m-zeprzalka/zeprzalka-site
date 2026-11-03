#!/usr/bin/env node
/**
 * Kontrola treści bloga — uruchamiana przez `pnpm check:content`
 * (i w CI przed buildem).
 *
 * Pilnuje reguł, które wcześniej żyły tylko w docs/SEO.md i rozjeżdżały
 * się przy każdym nowym wpisie:
 *
 *   BŁĘDY (zatrzymują CI):
 *   - obraz z frontmattera nie istnieje w public/,
 *   - kategoria albo tag bez pary PL↔EN w src/i18n/blog-map.ts
 *     (bez niej przełącznik języka i hreflang nie zadziałają),
 *   - para w POST_SLUGS wskazuje nieistniejący plik,
 *   - wpis bez pary w POST_SLUGS (brak hreflang i przełącznika),
 *   - slug spoza [a-z0-9-].
 *
 *   OSTRZEŻENIA (do poprawy, nie blokują):
 *   - tytuł dłuższy niż 60 znaków (sufiks z nazwiskiem serwis pomija sam),
 *   - opis spoza 120–160 znaków,
 *   - więcej niż 2 kategorie albo więcej niż 5 tagów,
 *   - data publikacji w przyszłości bez `draft: true`.
 *
 * Walidację typów pól (data YYYY-MM-DD, wymagane pola) robi zod
 * w src/lib/posts.ts już przy buildzie.
 */
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

// Node 24 usuwa typy z plików .ts — reguła slugów jest jedna, wspólna z serwisem.
import { slugify } from "../src/lib/slug.ts"

const ROOT = path.resolve(import.meta.dirname, "..")
const DIRS = { pl: "content/posts", en: "content/en/posts" }

const errors = []
const warnings = []
const err = (file, msg) => errors.push(`${file}: ${msg}`)
const warn = (file, msg) => warnings.push(`${file}: ${msg}`)

/** Pary `{ pl: "…", en: "…" }` z jednej stałej w blog-map.ts. */
function readPairs(source, constName) {
  const start = source.indexOf(`export const ${constName}`)
  if (start === -1) throw new Error(`Brak ${constName} w blog-map.ts`)
  // Od „= [" (po adnotacji typu, która też zawiera nawiasy) do „]" na początku wiersza.
  const open = source.indexOf("= [", start)
  const end = source.indexOf("\n]", open)
  const block = source.slice(open, end)
  return [...block.matchAll(/\{\s*pl:\s*"([^"]+)",\s*en:\s*"([^"]+)"\s*,?\s*\}/g)].map(
    ([, pl, en]) => ({ pl, en })
  )
}

const blogMap = fs.readFileSync(path.join(ROOT, "src/i18n/blog-map.ts"), "utf8")
const postPairs = readPairs(blogMap, "POST_SLUGS")
const categoryPairs = readPairs(blogMap, "CATEGORY_LABELS")
const tagPairs = readPairs(blogMap, "TAG_LABELS")

const today = new Date().toISOString().slice(0, 10)

for (const [locale, dir] of Object.entries(DIRS)) {
  const files = fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith(".mdx"))

  for (const file of files) {
    const rel = `${dir}/${file}`
    const slug = file.replace(/\.mdx$/, "")
    const { data } = matter(fs.readFileSync(path.join(ROOT, dir, file), "utf8"))

    if (!/^[a-z0-9-]+$/.test(slug)) err(rel, `slug „${slug}" — dozwolone tylko a-z, 0-9 i myślnik`)

    if (!postPairs.some((pair) => pair[locale] === slug)) {
      err(rel, "brak pary w POST_SLUGS (src/i18n/blog-map.ts)")
    }

    // Sufiks „| Michał Zeprzałka" serwis pomija sam, gdy razem przekroczyłyby
    // 60 znaków (src/i18n/page-metadata.ts) — ostrzegamy, gdy za długi jest
    // już sam tytuł, bo wtedy Google utnie go w wynikach.
    const title = String(data.title ?? "")
    if (title.length > 60) {
      warn(rel, `tytuł ${title.length} zn. > 60 — zostanie ucięty w wynikach Google`)
    }

    const description = String(data.description ?? "")
    if (description.length < 120 || description.length > 160) {
      warn(rel, `opis ${description.length} zn. — cel: 120–160`)
    }

    const image = String(data.image ?? "")
    if (image.startsWith("/") && !fs.existsSync(path.join(ROOT, "public", image))) {
      err(rel, `obraz ${image} nie istnieje w public/`)
    }
    if (image.endsWith(".svg")) {
      warn(rel, "okładka w SVG — next/image jej nie optymalizuje, użyj WebP")
    }

    // Adres kategorii i tagu powstaje z nazwy (ta sama funkcja co w serwisie).
    // Polska litera albo znak spoza ASCII dałby adres, który trzeba kodować w URL-u.
    const slugOf = slugify
    const checkSlug = (kind, label) => {
      if (!/^[a-z0-9.-]+$/.test(slugOf(label))) {
        err(
          rel,
          `${kind} „${label}" daje adres „${slugOf(label)}" — dozwolone a-z, 0-9, kropka i myślnik`
        )
      }
    }

    const categories = Array.isArray(data.categories) ? data.categories : []
    if (categories.length > 2) warn(rel, `${categories.length} kategorie — reguła: maks. 2`)
    for (const category of categories) {
      checkSlug("kategoria", category)
      if (!categoryPairs.some((pair) => pair[locale] === category)) {
        err(rel, `kategoria „${category}" bez pary w CATEGORY_LABELS`)
      }
    }

    const tags = Array.isArray(data.tags) ? data.tags : []
    if (tags.length > 5) warn(rel, `${tags.length} tagów — reguła: maks. 5`)
    for (const tag of tags) {
      checkSlug("tag", tag)
      if (!tagPairs.some((pair) => pair[locale] === tag)) {
        err(rel, `tag „${tag}" bez pary w TAG_LABELS (nowy tag zakładamy dla min. 3 wpisów)`)
      }
    }

    if (String(data.date) > today && !data.draft) {
      warn(rel, `data ${data.date} jest w przyszłości — wpis pojawi się od razu (użyj draft: true)`)
    }
  }
}

for (const pair of postPairs) {
  for (const [locale, dir] of Object.entries(DIRS)) {
    if (!fs.existsSync(path.join(ROOT, dir, `${pair[locale]}.mdx`))) {
      err("src/i18n/blog-map.ts", `POST_SLUGS: brak pliku ${dir}/${pair[locale]}.mdx`)
    }
  }
}

for (const line of warnings) console.warn(`⚠ ${line}`)
for (const line of errors) console.error(`✖ ${line}`)
console.log(
  `\nTreść: ${errors.length} błędów, ${warnings.length} ostrzeżeń ` +
    `(${postPairs.length} par wpisów, ${categoryPairs.length} kategorii, ${tagPairs.length} tagów).`
)
process.exit(errors.length ? 1 : 0)
