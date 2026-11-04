import "server-only"
import fs from "node:fs"
import path from "node:path"
import { cache } from "react"
import matter from "gray-matter"
import readingTime from "reading-time"
import { z } from "zod"
import type { Locale, Localized } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { fill } from "@/i18n/format"
import { slugify } from "@/lib/slug"

/**
 * Wpisy leżą w katalogu na język: polskie w `content/posts`, angielskie
 * w `content/en/posts`. Para „ten sam tekst w dwóch językach" nie jest
 * zapisana w plikach, tylko w `src/i18n/blog-map.ts` — jedno miejsce,
 * z którego korzystają `hreflang`, mapa strony i przełącznik języka.
 *
 * Trzymamy tu sam podkatalog, a ścieżkę składamy przy każdym odczycie jako
 * `path.join(process.cwd(), "content", …)`. To nie ozdobnik: gdy Turbopack
 * dostaje gotową zmienną ze ścieżką, przestaje umieć zawęzić śledzenie
 * plików i wrzuca do paczki serwerowej cały projekt razem z `public/`
 * (kilkadziesiąt megabajtów wideo).
 */
const POSTS_SUBDIR: Localized<string> = {
  pl: "posts",
  en: "en/posts",
}

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "data musi mieć format YYYY-MM-DD")

/**
 * Kontrakt frontmattera. Sprawdzany przy każdym odczycie, więc literówka
 * w nazwie pola albo data w złym formacie zatrzymuje build z nazwą pliku —
 * zamiast po cichu wyprodukować wpis bez obrazka czy z datą „Invalid Date".
 */
const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  /** Data publikacji. */
  date: isoDate,
  /** Data ostatniej istotnej aktualizacji — trafia do dateModified i mapy strony. */
  updated: isoDate.optional(),
  categories: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string().min(1)).default([]),
  /** Ścieżka w `public/` — `next/image` nie ma skonfigurowanych domen zewnętrznych. */
  image: z.string().regex(/^\/[^/]/, "obraz musi być ścieżką w public/ (zaczynać się od /)"),
  imageCaption: z.string().optional(),
  featured: z.boolean().default(false),
  /**
   * Szkic: wpis istnieje w repozytorium, ale nie trafia na produkcję
   * (ani na listy, ani pod własny adres). Lokalnie (`pnpm dev`) jest widoczny.
   */
  draft: z.boolean().default(false),
})

type PostFrontmatter = z.infer<typeof frontmatterSchema>

export interface Post {
  slug: string
  locale: Locale
  content: string
  frontmatter: PostFrontmatter
  /** Minuty lektury (zaokrąglone w górę) — formatuje je `formatReadingTime`. */
  readingMinutes: number
  /** Liczba słów — do danych strukturalnych (`wordCount`). */
  wordCount: number
}

const showDrafts = process.env.NODE_ENV === "development"

/**
 * Treść jest statyczna, więc przy buildzie produkcyjnym każdy plik wystarczy
 * sparsować raz na proces. `cache()` z Reacta deduplikuje tylko w obrębie
 * jednego renderu — a stron jest ponad 200, do tego `generateStaticParams`,
 * mapa strony i karty OG, gdzie `cache()` nie działa wcale. W `pnpm dev`
 * zostaje `cache()`, żeby edycja wpisu była widoczna od razu.
 */
function memoize<A extends readonly (string | number)[], R>(fn: (...args: A) => R) {
  if (process.env.NODE_ENV !== "production") return cache(fn)
  const store = new Map<string, R>()
  return (...args: A): R => {
    const key = args.join("\u0000")
    if (store.has(key)) return store.get(key) as R
    const value = fn(...args)
    store.set(key, value)
    return value
  }
}

export const getPostBySlug = memoize((locale: Locale, slug: string): Post | null => {
  const fullPath = path.join(process.cwd(), "content", POSTS_SUBDIR[locale], `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"))
  const parsed = frontmatterSchema.safeParse(data)

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(całość)"}: ${issue.message}`)
      .join("\n")
    throw new Error(
      `Niepoprawny frontmatter w content/${POSTS_SUBDIR[locale]}/${slug}.mdx:\n${issues}`
    )
  }

  if (parsed.data.draft && !showDrafts) {
    return null
  }

  const stats = readingTime(content)

  return {
    slug,
    locale,
    content,
    frontmatter: parsed.data,
    // Ta sama reguła co `stats.text` z reading-time („5 min read”).
    readingMinutes: Math.ceil(Number(stats.minutes.toFixed(2))),
    wordCount: stats.words,
  }
})

export const getAllPosts = memoize((locale: Locale): Post[] => {
  if (!fs.existsSync(path.join(process.cwd(), "content", POSTS_SUBDIR[locale]))) {
    return []
  }

  return fs
    .readdirSync(path.join(process.cwd(), "content", POSTS_SUBDIR[locale]))
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => getPostBySlug(locale, name.replace(/\.mdx$/, "")))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
})

/**
 * Data ostatniej zmiany w grupie wpisów: `updated`, a gdy jej brak — data
 * publikacji; najnowsza z grupy. Dla mapy strony (`lastmod`) i kanału RSS.
 */
export function latestUpdate(posts: readonly Post[]): Date | undefined {
  const newest = posts
    .map((post) => post.frontmatter.updated ?? post.frontmatter.date)
    .sort()
    .at(-1)
  return newest ? new Date(newest) : undefined
}

/**
 * Wpisy powiązane: wspólna kategoria waży więcej niż wspólny tag, remis
 * rozstrzyga świeżość. Gdy podobnych tekstów jest mniej niż `limit`, lista
 * dopełnia się najnowszymi — czytelnik zawsze dostaje kolejny krok,
 * a wyszukiwarka sieć linków wewnętrznych między wpisami.
 */
export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const categories = new Set(post.frontmatter.categories.map(slugify))
  const tags = new Set(post.frontmatter.tags.map(slugify))

  const scored = getAllPosts(post.locale)
    .filter((other) => other.slug !== post.slug)
    .map((other, index) => ({
      other,
      index,
      score:
        other.frontmatter.categories.filter((c) => categories.has(slugify(c))).length * 2 +
        other.frontmatter.tags.filter((t) => tags.has(slugify(t))).length,
    }))
    // getAllPosts jest już posortowane od najnowszych — indeks to świeżość.
    .sort((a, b) => b.score - a.score || a.index - b.index)

  return scored.slice(0, limit).map(({ other }) => other)
}

export type TaxonomyField = "categories" | "tags"

export interface Term {
  slug: string
  /** Oryginalna nazwa z frontmattera („Next.js”, „AI”) — adres jej nie odtworzy. */
  label: string
  posts: Post[]
}

/**
 * Kategorie i tagi to ta sama logika na dwóch polach frontmattera — jeden
 * indeks liczony raz zamiast siedmiu bliźniaczych funkcji. Kolejność terminów
 * to kolejność pierwszego wystąpienia (wpisy są od najnowszych).
 */
const getTaxonomy = memoize((locale: Locale, field: TaxonomyField): Map<string, Term> => {
  const terms = new Map<string, Term>()
  for (const post of getAllPosts(locale)) {
    for (const label of post.frontmatter[field]) {
      const slug = slugify(label)
      const term = terms.get(slug) ?? { slug, label, posts: [] }
      if (!term.posts.includes(post)) term.posts.push(post)
      terms.set(slug, term)
    }
  }
  return terms
})

export function getTerms(locale: Locale, field: TaxonomyField): Term[] {
  return [...getTaxonomy(locale, field).values()]
}

export function getTerm(locale: Locale, field: TaxonomyField, slug: string): Term | undefined {
  return getTaxonomy(locale, field).get(slug)
}

/** „5 min czytania” / „5 min read” — wzorzec w `common.readingTime`. */
export function formatReadingTime(minutes: number, locale: Locale): string {
  return fill(getCommon(locale).readingTime, { minutes })
}
