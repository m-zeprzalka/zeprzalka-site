import { Fragment, type CSSProperties } from "react"
import { SECTION } from "./anchors"
import { Chip } from "./Chip"
import type { IndeksNewContent } from "./content"
import { Fact } from "./Fact"

/**
 * O mnie: dalszy ciąg zdania ze startu w tej samej skali — przewijanie
 * dopełnia go słowo po słowie z szarości w atrament (oś czasu widoku, każde
 * słowo ma swój wycinek zakresu z zakładką, więc atrament płynie falą w tempie
 * przewijania). Czysty CSS; bez wsparcia albo przy „ogranicz ruch” tekst jest od razu pełny.
 * Pod spodem cztery fakty — każdy ma szczegół na marginesie albo w karcie.
 */
export function About({
  about,
  peeks,
  works,
}: {
  about: IndeksNewContent["about"]
  peeks: IndeksNewContent["peeks"]
  works: Readonly<Record<string, { title: string; src: string }>>
}) {
  // Ciągła numeracja słów przez cały akapit (chip liczy się jak jego słowa).
  const counts = about.fill.map((segment) => segment.text.split(/\s+/).filter(Boolean).length)
  const starts = counts.map((_, index) =>
    counts.slice(0, index).reduce((sum, count) => sum + count, 0)
  )
  const total = counts.reduce((sum, count) => sum + count, 0)

  return (
    <section
      id={SECTION.about}
      aria-labelledby={`${SECTION.about}-title`}
      className="ixn-col scroll-mt-(--ixn-header) pt-(--fm-section)"
    >
      <h2 id={`${SECTION.about}-title`} tabIndex={-1} data-anchor-focus className="sr-only">
        {about.heading}
      </h2>
      <p className="ixn-fill text-pretty" style={{ "--n": total } as CSSProperties}>
        {about.fill.map((segment, segmentIndex) => {
          const first = starts[segmentIndex] ?? 0
          if ("peek" in segment) {
            const peek = peeks[segment.peek]
            if (!peek) return segment.text
            return (
              <Fragment key={segmentIndex}>
                <Chip
                  text={segment.text}
                  peekId={segment.peek}
                  peek={peek}
                  work={peek.kind === "work" ? works[peek.slug] : undefined}
                  style={{ "--i": first } as CSSProperties}
                  className="ixn-chip--quiet ixn-fw"
                />
              </Fragment>
            )
          }
          const parts = segment.text.split(/(\s+)/)
          const wordIndex = parts.map(
            (_, partIndex) =>
              parts.slice(0, partIndex).filter((entry) => entry && !/^\s+$/.test(entry)).length
          )
          return (
            <Fragment key={segmentIndex}>
              {parts.map((part, partIndex) =>
                /^\s+$/.test(part) || !part ? (
                  part
                ) : (
                  <span
                    key={partIndex}
                    className="ixn-fw"
                    style={{ "--i": first + (wordIndex[partIndex] ?? 0) } as CSSProperties}
                  >
                    {part}
                  </span>
                )
              )}
            </Fragment>
          )
        })}
      </p>

      <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 sm:mt-16 sm:grid-cols-4">
        {about.facts.map((fact) => {
          const peek = peeks[fact.peek]
          return <li key={fact.id}>{peek ? <Fact fact={fact} peek={peek} /> : null}</li>
        })}
      </ul>
    </section>
  )
}
