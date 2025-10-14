// src/lib/posts.ts
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"
import GithubSlugger from "github-slugger"

const postsDirectory = path.join(process.cwd(), "content/posts")

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  categories: string[]
  tags: string[]
  image: string
  imageCaption?: string
  author: {
    name: string
    title: string
    bio: string
    avatar: string
  }
  featured?: boolean
}

export interface Post {
  slug: string
  content: string
  frontmatter: PostFrontmatter
  readingTime: string
  headings: { id: string; level: number; text: string }[]
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => {
      const slug = name.replace(/\.mdx$/, "")
      return getPostBySlug(slug)
    })
    .filter((post): post is Post => post !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )

  return posts
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Wyciągnij nagłówki z contentu
    const headings = extractHeadings(content)

    return {
      slug,
      content,
      frontmatter: data as PostFrontmatter,
      readingTime: readingTime(content).text,
      headings,
    }
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error)
    return null
  }
}

function extractHeadings(content: string) {
  const headingRegex = /^(#{2})\s+(.+)$/gm
  const headings: { id: string; level: number; text: string }[] = []
  const slugger = new GithubSlugger()
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    // Użyj dokładnie tego samego algorytmu co rehype-slug (github-slugger)
    const id = slugger.slug(text)

    headings.push({ id, level, text })
  }

  return headings
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) =>
    post.frontmatter.categories.some(
      (cat) => cat.toLowerCase().replace(/\s+/g, "-") === category
    )
  )
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((post) => post.frontmatter.featured)
}
