import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllCategorySlugs, getCategoryLabel, getPostsByCategory } from "@/lib/posts"
import { CategoryView } from "@/components/views/CategoryView"
import { categoryMetadata } from "@/i18n/page-metadata"

interface PageProps {
  params: Promise<{ category: string }>
}

/** Wszystkie adresy powstają przy buildzie — nieznany to od razu 404. */
export const dynamicParams = false

export async function generateStaticParams() {
  return getAllCategorySlugs("en").map((category) => ({ category }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const slug = decodeURIComponent(category)
  return categoryMetadata("en", slug, getCategoryLabel("en", slug), getPostsByCategory("en", slug).length)
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const slug = decodeURIComponent(category)
  const posts = getPostsByCategory("en", category)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <CategoryView
      locale="en"
      label={getCategoryLabel("en", slug)}
      posts={posts}
    />
  )
}
