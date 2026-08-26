import { ImageResponse } from "next/og"
import { OG_SIZE, OgCard } from "@/components/og"
import { SITE_TITLE } from "@/lib/site"

export const alt = SITE_TITLE
export const size = OG_SIZE
export const contentType = "image/png"

/** Domyślna karta serwisu — używana wszędzie, gdzie nie ma własnej. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Digital Solutions Architect"
        title="Przekształcam ambitne projekty w produkty cyfrowe"
        footer="Strony · Aplikacje · Design · AI"
      />
    ),
    size
  )
}
