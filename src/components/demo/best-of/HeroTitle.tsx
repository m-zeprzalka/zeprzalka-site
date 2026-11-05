import { Fragment, type CSSProperties } from "react"
import { typo } from "../forma/typo"

const vars = (values: Record<string, string | number>) => values as CSSProperties

/**
 * Nagłówek hero (wzór: `esencja/HeroTitle.tsx`, pochwalony przez właściciela):
 * słowa wyostrzają się z rozmycia po kolei (co 40 ms, każde 560 ms). Komponent
 * serwerowy — sekwencja to CSS, więc tekst (LCP) nie czeka na JavaScript; słowo
 * w całości (`inline-block`), kerning nietknięty. Czytnik ekranu dostaje całe
 * zdanie raz; pocięta wersja jest ukryta.
 */
export function HeroTitle({
  text,
  className,
  start = 0,
}: {
  text: string
  className?: string
  /** Opóźnienie całej sekwencji w ms. */
  start?: number
}) {
  const words = typo(text).split(" ")

  return (
    <h1 className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" style={vars({ "--bo-t0": `${start}ms` })}>
        {words.map((word, w) => (
          <Fragment key={w}>
            <span className="bo-word" style={vars({ "--w": w })}>
              {word}
            </span>
            {w < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </h1>
  )
}
