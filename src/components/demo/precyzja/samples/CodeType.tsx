"use client"

import { useEffect, useState } from "react"
import { useInView, useReducedMotion } from "../use-in-view"

type Kind = "kw" | "fn" | "str" | "tag" | "cm" | "pn" | "tx"
type Line = readonly (readonly [Kind, string])[]

/**
 * Kolorowanie składni bez koloru: rolę tokenu niesie waga i jasność,
 * nie barwa — tak samo czytelne w obu motywach.
 */
const CODE: readonly Line[] = [
  [["cm", "// src/app/page.tsx"]],
  [
    ["kw", "export default async function "],
    ["fn", "Page"],
    ["pn", "() {"],
  ],
  [
    ["tx", "  "],
    ["kw", "const "],
    ["tx", "posts = "],
    ["kw", "await "],
    ["fn", "getAllPosts"],
    ["pn", "("],
    ["str", '"pl"'],
    ["pn", ")"],
  ],
  [
    ["tx", "  "],
    ["kw", "return "],
    ["tag", "<Home "],
    ["tx", "posts"],
    ["pn", "={"],
    ["tx", "posts"],
    ["pn", "} "],
    ["tag", "/>"],
  ],
  [["pn", "}"]],
]

/** Pozycja pierwszego znaku każdego tokenu w całym tekście — do wycinania. */
const OFFSETS = CODE.map((line, row) =>
  line.map((_, i) =>
    CODE.slice(0, row)
      .flat()
      .concat(line.slice(0, i))
      .reduce((sum, [, text]) => sum + text.length, 0)
  )
)
const TOTAL = CODE.flat().reduce((sum, [, text]) => sum + text.length, 0)

export function CodeType() {
  const [ref, inView] = useInView<HTMLElement>()
  const reduced = useReducedMotion()
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return
    const id = window.setInterval(() => {
      setTyped((current) => Math.min(TOTAL, current + 2))
    }, 28)
    return () => window.clearInterval(id)
  }, [inView, reduced])

  // Przy ograniczonym ruchu kod stoi od razu w całości.
  const count = reduced ? TOTAL : typed
  const done = count >= TOTAL

  return (
    <figure ref={ref} className="pz-sample">
      <pre className="pz-code" aria-label="Przykładowy kod strony w Next.js">
        <code>
          {CODE.map((line, row) => (
            <span key={row} className="pz-code__line">
              <span className="pz-code__no" aria-hidden="true">
                {row + 1}
              </span>
              {line.map(([kind, text], i) => (
                <span key={i} className={`pz-code--${kind}`}>
                  {text.slice(0, Math.max(0, count - (OFFSETS[row]?.[i] ?? 0)))}
                </span>
              ))}
              {"\n"}
            </span>
          ))}
        </code>
        <span className="pz-code__build" data-done={done || undefined}>
          ○ / <span className="opacity-60">(Static) prerendered as static content</span>
        </span>
      </pre>
      <figcaption className="pz-sample__caption">
        <span>TSX, Next.js 16</span>
        <span>{done ? "build ✓" : "pisze…"}</span>
      </figcaption>
    </figure>
  )
}
