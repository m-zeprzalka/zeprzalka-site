import type { Metadata } from "next"
import { BlogIndexView } from "@/components/views/BlogIndexView"
import { blogMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = blogMetadata("en")

/** First archive page — static; the rest live under /en/blog/page/[n]. */
export default function BlogPage() {
  return <BlogIndexView locale="en" />
}
