"use client"

import { GlyphWordmark } from "@/components/demo/shared/glyph"
import { useAfterEntry } from "./hooks"

/**
 * „Zeprzałka” ze znaków w stopce — montowany po wejściu strony (silnik glifów
 * nie startuje w trakcie „harmonijki”). Do tego czasu stoi puste pudełko
 * w tej samej proporcji (4,6 : 1), więc nic nie skacze.
 */
export function FooterMark({ text }: { text: string }) {
  const ready = useAfterEntry()
  return ready ? (
    <GlyphWordmark text={text} className="text-fm-ink" />
  ) : (
    <div aria-hidden="true" className="aspect-[4.6/1] w-full" />
  )
}
