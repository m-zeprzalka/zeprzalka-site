import type { ReactNode } from "react"
import type { Segment } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"
import { PeekTrigger } from "./peek-trigger"

/**
 * Zdanie z frazami otwierającymi kartę podglądu.
 *
 * `split` rozbija tekst na elementy z indeksem `--i` (słowo albo cała fraza):
 * - `"block"` — słowa jako `inline-block` dla wejścia słowo po słowie
 *   (`enter-stagger`); fraza nie łamie się wtedy w środku;
 * - `"inline"` — zwykłe `span` dla tekstu wypełnianego przewijaniem (`scroll-fill`).
 * Spacje zostają poza elementami, więc łamanie wierszy działa jak w zwykłym tekście.
 */
export function Segments({
  segments,
  icons,
  split,
}: {
  segments: readonly Segment[]
  icons?: Partial<Record<string, ReactNode>>
  split?: "block" | "inline"
}) {
  let index = 0
  const item = (key: string, node: ReactNode) => (
    <span key={key} className={cn(split === "block" && "inline-block")} style={{ "--i": index++ }}>
      {node}
    </span>
  )

  return segments.flatMap((segment, s) => {
    if (segment.peek) {
      const trigger = (
        <PeekTrigger key={s} id={segment.peek} icon={icons?.[segment.peek]}>
          {segment.text}
        </PeekTrigger>
      )
      return split ? [item(`${s}`, trigger)] : [trigger]
    }
    if (!split) return [segment.text]
    return segment.text
      .split(/( +)/)
      .map((part, w) => (part.trim() ? item(`${s}-${w}`, part) : part))
  })
}

/** Ile elementów `--i` powstanie z tekstu (`--n` dla tekstu wypełnianego przewijaniem). */
export function countSegments(segments: readonly Segment[]): number {
  return segments.reduce(
    (total, segment) =>
      total + (segment.peek ? 1 : segment.text.split(/ +/).filter((part) => part.trim()).length),
    0
  )
}
