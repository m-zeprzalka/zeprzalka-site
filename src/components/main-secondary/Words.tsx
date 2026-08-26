import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"
import type { TitlePart } from "@/lib/home-content"

interface WordsProps {
  parts: TitlePart[]
  /** Od którego indeksu liczyć opóźnienie (gdy przed nagłówkiem są inne elementy). */
  startIndex?: number
  /** Czy animować wejście (tylko hero — reszta ujawnia się przez <Reveal>). */
  animate?: boolean
}

/**
 * Dzieli nagłówek na słowa (nigdy na litery — czytniki ekranu czytają
 * naturalnie), nadając każdemu indeks do schodkowej animacji wejścia.
 * Fragmenty `accent` dostają semantyczne <em> w kroju akcentowym.
 */
export function Words({ parts, startIndex = 0, animate = false }: WordsProps) {
  let index = startIndex

  return parts.map((part, partIndex) => {
    const words = part.text.split(" ").map((word) => {
      const i = index++
      return (
        <span
          key={i}
          className={cn("inline-block", animate && "ms-enter")}
          style={{ "--i": i } as CSSProperties}
        >
          {word}
        </span>
      )
    })

    const content = words.flatMap((word, i) =>
      i < words.length - 1 ? [word, " "] : [word]
    )

    const separator = partIndex < parts.length - 1 ? " " : null

    return part.accent ? (
      <em key={partIndex} className="ms-accent">
        {content}
        {separator}
      </em>
    ) : (
      <span key={partIndex}>
        {content}
        {separator}
      </span>
    )
  })
}
