import { OG_SIZE, pageOgCard } from "@/components/og"
import { getAllCategorySlugs, getCategoryLabel, getPostsByCategory } from "@/lib/posts"
import { fill } from "@/i18n/content/common"
import { getMeta } from "@/i18n/content/meta"
import { countArticles } from "@/i18n/content/pages"

const card = getMeta("en").og.cards.category

export const alt = card.eyebrow
export const size = OG_SIZE
export const contentType = "image/png"
export const dynamicParams = false

export function generateStaticParams() {
  return getAllCategorySlugs("en").map((category) => ({ category }))
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const slug = decodeURIComponent((await params).category)
  return pageOgCard({
    eyebrow: card.eyebrow,
    title: fill(card.title, { name: getCategoryLabel("en", slug) }),
    footer: fill(card.footer, {
      count: countArticles(getPostsByCategory("en", slug).length, "en"),
    }),
  })
}
