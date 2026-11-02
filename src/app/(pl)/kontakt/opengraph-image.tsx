import { OG_SIZE, pageOgCard } from "@/components/og"
import { getMeta } from "@/i18n/content/meta"


const card = getMeta("pl").og.cards.contact

export const alt = card.title
export const size = OG_SIZE
export const contentType = "image/png"

export default function OpengraphImage() {
  return pageOgCard(card)
}
