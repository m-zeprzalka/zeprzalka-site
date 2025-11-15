import { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/posts"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  // Mapuj wszystkie posty bloga
  const blogPosts = posts.map((post) => ({
    url: `https://zeprzalka.com/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: "https://zeprzalka.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://zeprzalka.com/blog",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...blogPosts,
  ]
}
