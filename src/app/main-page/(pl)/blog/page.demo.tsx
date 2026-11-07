import type { Metadata } from "next"
import { BlogPage } from "@/app/main-page/_components/views/blog-page"
import { preview } from "@/app/main-page/_lib/metadata"
import { blogMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = preview(blogMetadata("pl"))

/** Po przepięciu: `src/app/(pl)/blog/page.tsx`. */
export default function Page() {
  return <BlogPage locale="pl" />
}
