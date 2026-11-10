import type { Metadata } from "next"
import { BlogPage } from "@/components/views/blog-page"
import { blogMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = blogMetadata("en")

/** First archive page — static; the rest live under /en/blog/page/[n]. */
export default function Page() {
  return <BlogPage locale="en" />
}
