// src/lib/posts.ts
import fs from "fs"
import path from "path"
import { cache } from "react"
import matter from "gray-matter"
import readingTime from "reading-time"
import GithubSlugger from "github-slugger"
import type { Locale, Localized } from "@/i18n/config"

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

export interface PostFrontmatter {
  title: string
  description: string
  /** Data publikacji w formacie YYYY-MM-DD. */
  date: string
  /** Data ostatniej istotnej aktualizacji — trafia do dateModified i mapy strony. */
  updated?: string
  categories: string[]
  tags: string[]
  image: string
  imageCaption?: string
  featured?: boolean
}

export interface Post {
  slug: string
  locale: Locale
  content: string
  frontmatter: PostFrontmatter
  readingTime: string
  headings: { id: string; level: number; text: string }[]
}

/** Jedna, wspólna reguła slugów dla kategorii i tagów (URL-e i filtrowanie). */
export function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "-")
}

export const getPostBySlug = cache(
  (locale: Locale, slug: string): Post | null => {
    try {
      const fullPath = path.join(
        process.cwd(),
        "content",
        POSTS_SUBDIR[locale],
        `${slug}.mdx`
      )

      if (!fs.existsSync(fullPath)) {
        return null
      }

      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      return {
        slug,
        locale,
        content,
        frontmatter: data as PostFrontmatter,
        readingTime: readingTime(content).text,
        headings: extractHeadings(content),
      }
    } catch (error) {
      console.error(`Error loading post ${locale}/${slug}:`, error)
      return null
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
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const headings: { id: string; level: number; text: string }[] = []
  // Ten sam algorytm co rehype-slug (github-slugger) — id muszą się zgadzać z TOC
  const slugger = new GithubSlugger()
  let match

  while ((match = headingRegex.exec(content)) !== null) {
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
    post.frontmatter.categories?.some((cat) => slugify(cat) === categorySlug)
  )
}

export function getPostsByTag(locale: Locale, tagSlug: string): Post[] {
  return getAllPosts(locale).filter((post) =>
    post.frontmatter.tags?.some((tag) => slugify(tag) === tagSlug)
  )
}

export function getFeaturedPosts(locale: Locale): Post[] {
  return getAllPosts(locale).filter((post) => post.frontmatter.featured)
}

/**
 * Oryginalna nazwa kategorii dla danego slugu. Odtwarzanie jej z adresu
 * („ai" → „ai", „next.js" → „next.js") gubiło wielkość liter i kropki,
 * przez co nagłówek strony kategorii nie zgadzał się z etykietą przy wpisach.
 */
export const getCategoryLabel = cache(
  (locale: Locale, slug: string): string => {
    for (const post of getAllPosts(locale)) {
      for (const category of post.frontmatter.categories || []) {
        if (slugify(category) === slug) return category
      }
    }
    return slug
  }
)

/** To samo dla tagów. */
export const getTagLabel = cache((locale: Locale, slug: string): string => {
  for (const post of getAllPosts(locale)) {
    for (const tag of post.frontmatter.tags || []) {
      if (slugify(tag) === slug) return tag
    }
  }
  return slug
})

/** Unikalne slugi kategorii ze wszystkich postów. */
export function getAllCategorySlugs(locale: Locale): string[] {
  const slugs = new Set<string>()
  getAllPosts(locale).forEach((post) =>
    post.frontmatter.categories?.forEach((cat) => slugs.add(slugify(cat)))
  )
  return Array.from(slugs)
}

/** Unikalne slugi tagów ze wszystkich postów. */
export function getAllTagSlugs(locale: Locale): string[] {
  const slugs = new Set<string>()
  getAllPosts(locale).forEach((post) =>
    post.frontmatter.tags?.forEach((tag) => slugs.add(slugify(tag)))
  )
  return Array.from(slugs)
}
