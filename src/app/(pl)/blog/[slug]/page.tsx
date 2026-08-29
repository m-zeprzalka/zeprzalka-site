// src/app/(pl)/blog/[slug]/page.tsx
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { PostView } from "@/components/views/PostView"
import { postMetadata } from "@/i18n/page-metadata"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts("pl").map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  return postMetadata("pl", getPostBySlug("pl", slug))
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug("pl", slug)

  if (!post) {
    notFound()
  }

  return <PostView post={post} locale="pl" />
}
