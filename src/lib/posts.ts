import fs from "fs"
import path from "path"
import { cache } from "react"
import matter from "gray-matter"
import readingTime from "reading-time"
import GithubSlugger from "github-slugger"
import { z } from "zod"
import type { Locale, Localized } from "@/i18n/config"
import { slugify } from "@/lib/slug"

export { slugify }

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

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "data musi mieć format YYYY-MM-DD")

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
  /** Ścieżka w `public/` albo pełny adres. */
  image: z.string().regex(/^(\/|https?:\/\/)/, "obraz musi zaczynać się od / albo http"),
  imageCaption: z.string().optional(),
  featured: z.boolean().default(false),
  /**
   * Szkic: wpis istnieje w repozytorium, ale nie trafia na produkcję
   * (ani na listy, ani pod własny adres). Lokalnie (`pnpm dev`) jest widoczny.
   */
  draft: z.boolean().default(false),
})

export type PostFrontmatter = z.infer<typeof frontmatterSchema>

export interface Post {
  slug: string
  locale: Locale
  content: string
  frontmatter: PostFrontmatter
  readingTime: string
  /** Liczba słów — do danych strukturalnych (`wordCount`). */
  wordCount: number
  headings: { id: string; level: number; text: string }[]
}

const showDrafts = process.env.NODE_ENV === "development"

export const getPostBySlug = cache(
  (locale: Locale, slug: string): Post | null => {
    const fullPath = path.join(
      process.cwd(),
      "content",
      POSTS_SUBDIR[locale],
      `${slug}.mdx`
    )

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
      readingTime: stats.text,
      wordCount: stats.words,
      headings: extractHeadings(content),
    }
  }
)

export const getAllPosts = cache((locale: Locale): Post[] => {
  if (!fs.existsSync(path.join(process.cwd(), "content", POSTS_SUBDIR[locale]))) {
    return []
  }

  return fs
    .readdirSync(path.join(process.cwd(), "content", POSTS_SUBDIR[locale]))
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => getPostBySlug(locale, name.replace(/\.mdx$/, "")))
    .filter((post): post is Post => post !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
})

function extractHeadings(content: string) {
  // Bloki kodu są pomijane: `# komentarz` w bashu to nie nagłówek wpisu.
  const withoutCode = content.replace(/^```[\s\S]*?^```/gm, "")
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const headings: { id: string; level: number; text: string }[] = []
  // Ten sam algorytm co rehype-slug (github-slugger) — id muszą się zgadzać z TOC
  const slugger = new GithubSlugger()
  let match

  while ((match = headingRegex.exec(withoutCode)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    headings.push({ id: slugger.slug(text), level, text })
  }

  return headings
}

export function getPostsByCategory(
  locale: Locale,
  categorySlug: string
): Post[] {
  return getAllPosts(locale).filter((post) =>
    post.frontmatter.categories.some((cat) => slugify(cat) === categorySlug)
  )
}

export function getPostsByTag(locale: Locale, tagSlug: string): Post[] {
  return getAllPosts(locale).filter((post) =>
    post.frontmatter.tags.some((tag) => slugify(tag) === tagSlug)
  )
}

export function getFeaturedPosts(locale: Locale): Post[] {
  return getAllPosts(locale).filter((post) => post.frontmatter.featured)
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
        other.frontmatter.categories.filter((c) => categories.has(slugify(c)))
          .length *
          2 +
        other.frontmatter.tags.filter((t) => tags.has(slugify(t))).length,
    }))
    // getAllPosts jest już posortowane od najnowszych — indeks to świeżość.
    .sort((a, b) => b.score - a.score || a.index - b.index)

  return scored.slice(0, limit).map(({ other }) => other)
}

/**
 * Oryginalna nazwa kategorii dla danego slugu. Odtwarzanie jej z adresu
 * („ai" → „ai", „next.js" → „next.js") gubiło wielkość liter i kropki,
 * przez co nagłówek strony kategorii nie zgadzał się z etykietą przy wpisach.
 */
export const getCategoryLabel = cache(
  (locale: Locale, slug: string): string => {
    for (const post of getAllPosts(locale)) {
      for (const category of post.frontmatter.categories) {
        if (slugify(category) === slug) return category
      }
    }
    return slug
  }
)

/** To samo dla tagów. */
export const getTagLabel = cache((locale: Locale, slug: string): string => {
  for (const post of getAllPosts(locale)) {
    for (const tag of post.frontmatter.tags) {
      if (slugify(tag) === slug) return tag
    }
  }
  return slug
})

/** Unikalne slugi kategorii ze wszystkich postów. */
export function getAllCategorySlugs(locale: Locale): string[] {
  const slugs = new Set<string>()
  getAllPosts(locale).forEach((post) =>
    post.frontmatter.categories.forEach((cat) => slugs.add(slugify(cat)))
  )
  return Array.from(slugs)
}

/** Unikalne slugi tagów ze wszystkich postów. */
export function getAllTagSlugs(locale: Locale): string[] {
  const slugs = new Set<string>()
  getAllPosts(locale).forEach((post) =>
    post.frontmatter.tags.forEach((tag) => slugs.add(slugify(tag)))
  )
  return Array.from(slugs)
}

/** Kategorie z liczbą wpisów, od najliczniejszej — dla indeksu kategorii. */
export function getCategoryCounts(
  locale: Locale
): { slug: string; label: string; count: number }[] {
  const counts = new Map<string, { label: string; count: number }>()
  for (const post of getAllPosts(locale)) {
    for (const category of post.frontmatter.categories) {
      const slug = slugify(category)
      const entry = counts.get(slug)
      if (entry) entry.count += 1
      else counts.set(slug, { label: category, count: 1 })
    }
  }
  return [...counts.entries()]
    .map(([slug, entry]) => ({ slug, ...entry }))
    .sort((a, b) => b.count - a.count)
}
