import { MetadataRoute } from "next"
import { getAllPosts, getAllCategorySlugs } from "@/lib/posts"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  // Data ostatniego posta — stabilniejsza niż new Date() przy każdym buildzie
  const newestPostDate = posts.length
    ? new Date(posts[0].frontmatter.date)
    : new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: newestPostDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: newestPostDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      // Strona ofertowa — najwyższa intencja zakupowa po stronie głównej.
      url: `${SITE_URL}/uslugi`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/o-mnie`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/kontakt`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog/kategoria`,
      lastModified: newestPostDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ]

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.updated || post.frontmatter.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const categories: MetadataRoute.Sitemap = getAllCategorySlugs().map(
    (slug) => ({
      url: `${SITE_URL}/blog/kategoria/${slug}`,
      lastModified: newestPostDate,
      changeFrequency: "weekly",
      priority: 0.5,
    })
  )

  // Strony tagów celowo poza sitemapą: ~110 tagów przy 26 wpisach to zbyt
  // rozdrobnione (thin content) strony — pozostają dostępne przez linki.
  return [...staticPages, ...blogPosts, ...categories]
}
