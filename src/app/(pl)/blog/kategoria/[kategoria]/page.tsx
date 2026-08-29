import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllCategorySlugs, getCategoryLabel, getPostsByCategory } from "@/lib/posts"
import { CategoryView } from "@/components/views/CategoryView"
import { categoryMetadata } from "@/i18n/page-metadata"

interface PageProps {
  params: Promise<{ kategoria: string }>
}

export async function generateStaticParams() {
  return getAllCategorySlugs("pl").map((kategoria) => ({ kategoria }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kategoria } = await params
  const slug = decodeURIComponent(kategoria)
  return categoryMetadata("pl", slug, getCategoryLabel("pl", slug))
}

export default async function KategoriaPage({ params }: PageProps) {
  const { kategoria } = await params
  const slug = decodeURIComponent(kategoria)
  const posts = getPostsByCategory("pl", kategoria)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <CategoryView
      locale="pl"
      label={getCategoryLabel("pl", slug)}
      posts={posts}
    />
  )
}
