import { ImageResponse } from "next/og"
import { OG_SIZE, OgCard } from "@/components/og"
import { getPostBySlug } from "@/lib/posts"
import { SITE_TITLE } from "@/lib/site"

export const alt = SITE_TITLE
export const size = OG_SIZE
export const contentType = "image/png"

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Karta wpisu z jego tytułem i kategoriami. Bez tego każdy artykuł
 * udostępniał się z tą samą, ogólną grafiką serwisu.
 */
export default async function OpengraphImage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  return new ImageResponse(
    (
      <OgCard
        eyebrow={(post?.frontmatter.categories || ["Blog"]).slice(0, 3).join(" · ")}
        title={post?.frontmatter.title ?? SITE_TITLE}
        footer={post?.readingTime.replace("min read", "min czytania")}
      />
    ),
    size
  )
}
