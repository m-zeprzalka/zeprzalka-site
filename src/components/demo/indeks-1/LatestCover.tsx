"use client"

import { GlyphMedia } from "@/components/demo/shared/glyph"
import { useAfterEntry } from "./hooks"

/**
 * Okładka najnowszego wpisu (telefon i laptop): szkielet z CSS od pierwszego
 * malowania, a powierzchnia silnika glifów montuje się dopiero po wejściu
 * strony — ten sam wygląd szkieletu, bez startu WebGL w trakcie wejścia.
 */
export function LatestCover({ image }: { image: string }) {
  const ready = useAfterEntry()
  return ready ? (
    <GlyphMedia
      poster={image}
      width={16}
      height={9}
      sizes="(min-width: 40rem) 640px, 100vw"
      trigger="view"
      className="rounded-fm-xl"
    />
  ) : (
    <div aria-hidden="true" className="i1-media aspect-video rounded-fm-xl" />
  )
}
