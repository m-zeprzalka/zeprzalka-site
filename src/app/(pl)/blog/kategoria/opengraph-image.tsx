import { OG_SIZE, pageOgCard } from "@/components/og"
import { getMeta } from "@/i18n/content/meta"
import { getAllPosts } from "@/lib/posts"
import { fill } from "@/i18n/content/common"
import { countArticles } from "@/i18n/content/pages"

const card = getMeta("pl").og.cards.categories

export const alt = card.title
export const size = OG_SIZE
export const contentType = "image/png"

export default function OpengraphImage() {
  return pageOgCard({
    ...card,
    footer: fill(card.footer, { count: countArticles(getAllPosts("pl").length, "pl") }),
  })
}
