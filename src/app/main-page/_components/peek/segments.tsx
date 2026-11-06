import type { ReactNode } from "react"
import type { Segment } from "@/app/main-page/_lib/types"
import { PeekTrigger } from "./peek-trigger"

/**
 * Zdanie z frazami otwierającymi kartę podglądu. `words` rozbija zwykły tekst
 * na słowa (osobne elementy) — tego potrzebuje tekst wypełniany przewijaniem.
 */
export function Segments({
  segments,
  icons,
  words = false,
  emphasis = true,
}: {
  segments: readonly Segment[]
  icons?: Partial<Record<string, ReactNode>>
  words?: boolean
  emphasis?: boolean
}) {
  return segments.map((segment, index) => {
    if (segment.peek) {
      return (
        <PeekTrigger key={index} id={segment.peek} icon={icons?.[segment.peek]} emphasis={emphasis}>
          {segment.text}
        </PeekTrigger>
      )
    }
    if (!words) return segment.text
    // Spacja zostaje przy słowie — bez niej łamanie wiersza zgubiłoby odstępy.
    return segment.text
      .split(/(?<= )/)
      .map((word, wordIndex) => <span key={`${index}-${wordIndex}`}>{word}</span>)
  })
}
