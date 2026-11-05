import { Fragment, type CSSProperties } from "react"
import { typo } from "../forma/typo"

/**
 * Podział tekstu na słowa i znaki po stronie serwera — sekwencje liter
 * (CSS) startują z pierwszym malowaniem, bez czekania na JavaScript i bez
 * skoku układu. Słowa nie łamią się w środku (`kn-word`), czytnik dostaje
 * cały tekst raz (`sr-only`), a kopia w znakach jest `aria-hidden`.
 */
export function words(text: string): string[] {
  return typo(text).split(" ").filter(Boolean)
}

/**
 * Opóźnienia znaków z krzywą (wykładnik < 1): pierwsze znaki wchodzą rzadziej,
 * kolejne coraz gęściej — fala, nie metronom (równy stagger czyta się jak
 * maszyna).
 */
export function charDelays(count: number, { start = 0, spread = 1000, power = 0.8 } = {}) {
  return Array.from({ length: count }, (_, index) =>
    Math.round(start + spread * Math.pow(count > 1 ? index / (count - 1) : 0, power))
  )
}

export function SplitChars({
  text,
  start,
  spread,
  power,
  wordClassName,
}: {
  text: string
  start?: number
  spread?: number
  power?: number
  wordClassName?: string
}) {
  const list = words(text)
  const total = list.reduce((sum, word) => sum + Array.from(word).length, 0)
  const delays = charDelays(total, { start, spread, power })
  let index = 0

  return (
    <>
      <span className="sr-only">{typo(text)}</span>
      <span aria-hidden="true">
        {list.map((word, w) => (
          <Fragment key={w}>
            <span className={wordClassName ?? "kn-word"}>
              {Array.from(word).map((char, c) => (
                <span
                  key={c}
                  className="kn-ch"
                  style={{ "--d": `${delays[index++]}ms` } as CSSProperties}
                >
                  {char}
                </span>
              ))}
            </span>
            {w < list.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </>
  )
}
