import type { CSSProperties } from "react"
import { typo } from "@/components/demo/forma/typo"

/**
 * Nagłówek w skali display — jedyna rzecz, która rusza się na pierwszym
 * ekranie: słowa wyostrzają się z rozmycia co 26 ms (`.tk-word`, ≤ 700 ms
 * całość). Komponent serwerowy, wejście bez JS. Czytnik ekranu dostaje całe
 * zdanie raz, pocięte słowa są przed nim ukryte. Przy „ogranicz ruch” stoi.
 */
export function Headline({ text, className }: { text: string; className?: string }) {
  const words = typo(text).split(" ")
  return (
    <h1 className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={index}>
            <span className="tk-word inline-block" style={{ "--i": index } as CSSProperties}>
              {word}
            </span>
            {index < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </h1>
  )
}
