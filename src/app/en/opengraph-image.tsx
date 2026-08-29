import { ImageResponse } from "next/og"
import { OG_SIZE, OgCard } from "@/components/og"
import { SITE_TITLE } from "@/lib/site"
import { getMeta } from "@/i18n/content/meta"

export const alt = SITE_TITLE
export const size = OG_SIZE
export const contentType = "image/png"

export default function OpengraphImage() {
  const og = getMeta("en").og
  return new ImageResponse(
    (
      <OgCard
        eyebrow={og.homeEyebrow}
        title={og.homeTitle}
        footer={og.homeFooter}
      />
    ),
    size
  )
}
