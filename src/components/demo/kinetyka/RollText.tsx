import type { CSSProperties } from "react"

/**
 * Etykieta z „przewijanymi literami”: każda litera ma pod sobą kopię (cień
 * tekstu), a najechanie na rodzica `.kn-roll-host` przesuwa litery w górę
 * falą (co 12 ms) — kopia wjeżdża na miejsce oryginału. Czysty CSS, tylko
 * mysz. Czytnik dostaje zwykły tekst; litery są `aria-hidden`.
 */
export function RollText({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="kn-roll">
        {Array.from(text).map((char, index) => (
          <span key={index} className="kn-roll-ch" style={{ "--i": index } as CSSProperties}>
            <span>{char === " " ? " " : char}</span>
          </span>
        ))}
      </span>
    </>
  )
}
