import type { Metadata } from "next"
import { BlogIndexView } from "@/components/views/BlogIndexView"
import { blogMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = blogMetadata("en")

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page } = await searchParams
  return <BlogIndexView locale="en" page={page} />
}
