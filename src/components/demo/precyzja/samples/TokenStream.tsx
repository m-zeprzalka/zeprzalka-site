"use client"

import { useEffect, useState } from "react"
import { useInView, useReducedMotion } from "../use-in-view"

/**
 * Próbka „AI”: zdanie z hero generowane token po tokenie, pod każdym
 * prawdopodobieństwo wyboru. Pętla zatrzymuje się poza kadrem i przy
 * ograniczonym ruchu (wtedy od razu całe zdanie).
 */
const TOKENS: readonly (readonly [string, number])[] = [
  ["Prze", 0.62],
  ["kształ", 0.91],
  ["cam", 0.99],
  [" ambit", 0.48],
  ["ne", 0.98],
  [" projek", 0.83],
  ["ty", 0.97],
  [" w", 0.71],
  [" produk", 0.88],
  ["ty", 0.99],
  [" cyfro", 0.76],
  ["we", 0.99],
  [".", 0.95],
]

export function TokenStream() {
  const [ref, inView] = useInView<HTMLElement>("0px")
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return
    // Pełne zdanie stoi ~2 s, potem generowanie zaczyna się od nowa.
    const id = window.setInterval(() => {
      setStep((current) => (current >= TOKENS.length + 14 ? 0 : current + 1))
    }, 140)
    return () => window.clearInterval(id)
  }, [inView, reduced])

  const shown = reduced ? TOKENS.length : Math.min(step, TOKENS.length)

  const average = TOKENS.slice(0, shown).reduce((sum, [, p]) => sum + p, 0) / Math.max(shown, 1)

  return (
    <figure ref={ref} className="pz-sample">
      <div className="pz-tokens" aria-hidden="true">
        {TOKENS.map(([token, p], i) => (
          <span
            key={i}
            className="pz-token"
            data-on={i < shown || undefined}
            data-next={i === shown || undefined}
          >
            <span className="pz-token__text">{token.replace(" ", " ")}</span>
            <span className="pz-token__p">
              <span style={{ transform: `scaleX(${p})` }} />
              {p.toFixed(2)}
            </span>
          </span>
        ))}
      </div>
      <figcaption className="pz-sample__caption">
        <span>
          {String(shown).padStart(2, "0")}/{TOKENS.length} tokenów
        </span>
        <span>śr. p = {shown ? average.toFixed(2) : "—"}</span>
      </figcaption>
    </figure>
  )
}
