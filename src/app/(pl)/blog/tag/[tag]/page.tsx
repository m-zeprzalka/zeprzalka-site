import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllTagSlugs, getPostsByTag, getTagLabel } from "@/lib/posts"
import { TagView } from "@/components/views/TagView"
import { tagMetadata } from "@/i18n/page-metadata"

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  return getAllTagSlugs("pl").map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  const slug = decodeURIComponent(tag)
  return tagMetadata("pl", slug, getTagLabel("pl", slug))
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  const slug = decodeURIComponent(tag)
  const taggedPosts = getPostsByTag("pl", tag.toLowerCase())

  if (taggedPosts.length === 0) {
    notFound()
  }

  return (
    <TagView locale="pl" label={getTagLabel("pl", slug)} posts={taggedPosts} />
  )
}
