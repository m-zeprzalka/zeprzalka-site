// src/lib/posts.ts
import fs from "fs"
import path from "path"
import { cache } from "react"
import matter from "gray-matter"
import readingTime from "reading-time"
import GithubSlugger from "github-slugger"

const postsDirectory = path.join(process.cwd(), "content/posts")

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
  content: string
  frontmatter: PostFrontmatter
  readingTime: string
  headings: { id: string; level: number; text: string }[]
}

/** Jedna, wspólna reguła slugów dla kategorii i tagów (URL-e i filtrowanie). */
export function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "-")
}

export const getPostBySlug = cache((slug: string): Post | null => {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      frontmatter: data as PostFrontmatter,
      readingTime: readingTime(content).text,
      headings: extractHeadings(content),
    }
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error)
    return null
  }
})

export const getAllPosts = cache((): Post[] => {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => getPostBySlug(name.replace(/\.mdx$/, "")))
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

export function getPostsByCategory(categorySlug: string): Post[] {
  return getAllPosts().filter((post) =>
    post.frontmatter.categories?.some((cat) => slugify(cat) === categorySlug)
  )
}

export function getPostsByTag(tagSlug: string): Post[] {
  return getAllPosts().filter((post) =>
    post.frontmatter.tags?.some((tag) => slugify(tag) === tagSlug)
  )
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((post) => post.frontmatter.featured)
}

/**
 * Oryginalna nazwa kategorii dla danego slugu. Odtwarzanie jej z adresu
 * („ai" → „ai", „next.js" → „next.js") gubiło wielkość liter i kropki,
 * przez co nagłówek strony kategorii nie zgadzał się z etykietą przy wpisach.
 */
export const getCategoryLabel = cache((slug: string): string => {
  for (const post of getAllPosts()) {
    for (const category of post.frontmatter.categories || []) {
      if (slugify(category) === slug) return category
    }
  }
  return slug
})

/** To samo dla tagów. */
export const getTagLabel = cache((slug: string): string => {
  for (const post of getAllPosts()) {
    for (const tag of post.frontmatter.tags || []) {
      if (slugify(tag) === slug) return tag
    }
  }
  return slug
})

/** Unikalne slugi kategorii ze wszystkich postów. */
export function getAllCategorySlugs(): string[] {
  const slugs = new Set<string>()
  getAllPosts().forEach((post) =>
    post.frontmatter.categories?.forEach((cat) => slugs.add(slugify(cat)))
  )
  return Array.from(slugs)
}

/** Unikalne slugi tagów ze wszystkich postów. */
export function getAllTagSlugs(): string[] {
  const slugs = new Set<string>()
  getAllPosts().forEach((post) =>
    post.frontmatter.tags?.forEach((tag) => slugs.add(slugify(tag)))
  )
  return Array.from(slugs)
}
