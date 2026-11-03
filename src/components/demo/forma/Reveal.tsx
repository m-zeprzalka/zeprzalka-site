import type { CSSProperties, ElementType } from "react"
import { typo } from "./typo"

/**
 * Tekst, którego słowa wyostrzają się po kolei (`fm-rise`). Komponent
 * serwerowy: kolejność nadaje `--i`, sekwencja nie czeka na JS, a przy
 * „ogranicz ruch” tekst po prostu stoi. Czytnik ekranu dostaje całe zdanie
 * raz (sr-only), a pocięte słowa są ukryte przed technologiami asystującymi.
 *
 * `parts` dzieli zdanie na części w różnych kolorach (nagłówek dwutonowy).
 */
export function Reveal({
  as: Tag = "span",
  parts,
  className,
  delay = 0,
}: {
  as?: ElementType
  parts: readonly { text: string; className?: string }[]
  className?: string
  /** Opóźnienie całej sekwencji w ms. */
  delay?: number
}) {
  let index = 0
  const full = parts.map((part) => part.text).join(" ")

  return (
    <Tag className={className} style={{ "--fm-delay": `${delay}ms` } as CSSProperties}>
      <span className="sr-only">{full}</span>
      <span aria-hidden="true">
        {parts.map((part, partIndex) => (
          <span key={partIndex} className={part.className}>
            {typo(part.text)
              .split(" ")
              .map((word, wordIndex, words) => (
                <span key={wordIndex}>
                  <span
                    className="fm-rise inline-block"
                    style={{ "--i": index++ } as CSSProperties}
                  >
                    {word}
                  </span>
                  {(wordIndex < words.length - 1 || partIndex < parts.length - 1) && " "}
                </span>
              ))}
          </span>
        ))}
      </span>
    </Tag>
  )
}
