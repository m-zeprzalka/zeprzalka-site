import type { Metadata } from "next"
import { BlogIndexView } from "@/components/views/BlogIndexView"
import { blogMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = blogMetadata("pl")

/** Pierwsza strona archiwum — statyczna; kolejne pod /blog/strona/[n]. */
export default function BlogPage() {
  return <BlogIndexView locale="pl" />
}
