import type { Metadata } from "next"
import { BlogPage } from "@/components/views/blog-page"
import { blogMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = blogMetadata("pl")

/** Pierwsza strona archiwum — statyczna; kolejne pod /blog/strona/[n]. */
export default function Page() {
  return <BlogPage locale="pl" />
}
