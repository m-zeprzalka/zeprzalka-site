import { ImageResponse } from "next/og"
import { OG_SIZE, OgCard } from "@/components/og"
import { portfolioItems } from "@/lib/portfolio"
import { fill } from "@/i18n/content/common"
import { getMeta } from "@/i18n/content/meta"

const m = getMeta("pl")

export const alt = m.portfolio.ogAlt
export const size = OG_SIZE
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow={m.og.portfolioEyebrow}
        title={m.og.portfolioTitle}
        footer={fill(m.og.portfolioFooter, { count: portfolioItems.length })}
      />
    ),
    size
  )
}
