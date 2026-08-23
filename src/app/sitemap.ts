import { MetadataRoute } from "next"
import { getAllPosts, getAllCategorySlugs } from "@/lib/posts"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zeprzalka.com"
  const posts = getAllPosts()

  // Data ostatniego posta — stabilniejsza niż new Date() przy każdym buildzie
  const newestPostDate = posts.length
    ? new Date(posts[0].frontmatter.date)
    : new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: newestPostDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: newestPostDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/o-mnie`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/kontakt`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog/kategoria`,
      lastModified: newestPostDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ]

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const categories: MetadataRoute.Sitemap = getAllCategorySlugs().map(
    (slug) => ({
      url: `${siteUrl}/blog/kategoria/${slug}`,
      lastModified: newestPostDate,
      changeFrequency: "weekly",
      priority: 0.5,
    })
  )

  // Strony tagów celowo poza sitemapą: ~110 tagów przy 26 wpisach to zbyt
  // rozdrobnione (thin content) strony — pozostają dostępne przez linki.
  return [...staticPages, ...blogPosts, ...categories]
}
