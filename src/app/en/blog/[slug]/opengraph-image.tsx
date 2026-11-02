import { OG_SIZE, postOgCard } from "@/components/og"
import { getAllPosts } from "@/lib/posts"
import { SITE_TITLE } from "@/lib/site"

export const alt = SITE_TITLE
export const size = OG_SIZE
export const contentType = "image/png"
/** Karty powstają przy buildzie; nieznany slug to 404, nie renderowanie na żądanie. */
export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts("en").map((post) => ({ slug: post.slug }))
}

/**
 * Karta wpisu z jego tytułem i kategoriami. Bez tego każdy artykuł
 * udostępniał się z tą samą, ogólną grafiką serwisu.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return postOgCard("en", slug)
}
