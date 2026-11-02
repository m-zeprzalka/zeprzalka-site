import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { BlogIndexView, getBlogPageCount } from "@/components/views/BlogIndexView"
import { blogPageMetadata } from "@/i18n/page-metadata"

interface PageProps {
  params: Promise<{ strona: string }>
}

/** Tylko strony, które istnieją; reszta to 404 bez renderowania na żądanie. */
export const dynamicParams = false

export function generateStaticParams() {
  return Array.from({ length: getBlogPageCount("pl") - 1 }, (_, i) => ({
    strona: String(i + 2),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { strona } = await params
  return blogPageMetadata("pl", Number(strona), {
    pl: getBlogPageCount("pl"),
    en: getBlogPageCount("en"),
  })
}

export default async function BlogArchivePage({ params }: PageProps) {
  const page = Number((await params).strona)
  if (!Number.isInteger(page) || page < 2) notFound()
  return <BlogIndexView locale="pl" page={page} />
}
