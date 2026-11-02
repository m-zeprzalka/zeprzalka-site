import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { BlogIndexView, getBlogPageCount } from "@/components/views/BlogIndexView"
import { blogPageMetadata } from "@/i18n/page-metadata"

interface PageProps {
  params: Promise<{ page: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return Array.from({ length: getBlogPageCount("en") - 1 }, (_, i) => ({
    page: String(i + 2),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params
  return blogPageMetadata("en", Number(page), {
    pl: getBlogPageCount("pl"),
    en: getBlogPageCount("en"),
  })
}

export default async function BlogArchivePage({ params }: PageProps) {
  const page = Number((await params).page)
  if (!Number.isInteger(page) || page < 2) notFound()
  return <BlogIndexView locale="en" page={page} />
}
