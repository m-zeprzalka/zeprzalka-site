import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"
import { pl } from "@/components/main-fourth/typography"
import type { TitlePart } from "@/lib/home-content"

interface LinesProps {
  /** Wiersze nagłówka; każdy dostaje własną maskę. */
  lines: TitlePart[][]
  /** Kaskada startuje od tego numeru (hero ma nad sobą jeszcze etykietę). */
  from?: number
  /** Hero animuje się zaraz po wczytaniu; reszta czeka na wejście w kadr. */
  immediate?: boolean
  className?: string
}

/**
 * Nagłówek złożony z bloków-wierszy. Łamanie jest zapisane w treści, więc
 * wypada tam, gdzie kończy się myśl — a nie tam, gdzie skończyła się kolumna.
 * Fragment oznaczony jako `accent` idzie prawdziwą kursywą tego samego kroju.
 */
export function Lines({ lines, from = 0, immediate, className }: LinesProps) {
  return lines.map((parts, index) => (
    <span
      key={index}
      className={cn("m4-line", className)}
      style={{ "--d": `${(from + index) * 55}ms` } as CSSProperties}
    >
      <span className="m4-line-in" data-immediate={immediate ? "" : undefined}>
        {parts.map((part, partIndex) => {
          // Fragmenty sklejają się w jeden wiersz — spacja tylko tam, gdzie
          // poprzedni fragment sam jej nie zawiera.
          const space =
            partIndex > 0 && !/\s$/.test(parts[partIndex - 1].text) ? " " : null
          return part.accent ? (
            <span key={partIndex}>
              {space}
              <em className="m4-em">{pl(part.text)}</em>
            </span>
          ) : (
            <span key={partIndex}>
              {space}
              {pl(part.text)}
            </span>
          )
        })}
        {/* Wiersze są blokami, więc ta spacja nic nie zmienia w składzie —
            ale bez niej czytnik ekranu i wyszukiwarka dostają sklejony tekst. */}
        {index < lines.length - 1 ? " " : null}
      </span>
    </span>
  ))
}
