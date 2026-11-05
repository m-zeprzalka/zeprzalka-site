import { Fragment, type CSSProperties } from "react"
import { SECTION } from "./anchors"
import { Chip } from "./Chip"
import type { PeekWork } from "./PeekBody"
import type { IndeksOneContent } from "./content"
import { Fact } from "./Fact"
import { T } from "./Hero"
import { SectionHead } from "./Section"

/**
 * O mnie: nagłówek odczytywany ze znaków, pod nim dalszy ciąg zdania ze startu — przewijanie
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
  about: IndeksOneContent["about"]
  peeks: IndeksOneContent["peeks"]
  works: Readonly<Record<string, PeekWork>>
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
      className="i1-col scroll-mt-(--i1-header) pt-(--fm-section)"
    >
      <SectionHead id={SECTION.about} title={about.heading} enterAt={T.after} />
      <p
        className="i1-fill text-[1.3125rem] leading-[1.42] font-medium tracking-[-0.02em] text-pretty text-fm-ink sm:text-[1.625rem] sm:leading-[1.36] sm:tracking-[-0.024em] min-[90rem]:text-[1.75rem] min-[105rem]:text-[1.875rem]"
        style={{ "--n": total } as CSSProperties}
      >
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
                  className="i1-chip--quiet i1-fw"
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
                    className="i1-fw"
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

      <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-16 sm:grid-cols-4">
        {about.facts.map((fact) => {
          const peek = peeks[fact.peek]
          return <li key={fact.id}>{peek ? <Fact fact={fact} peek={peek} /> : null}</li>
        })}
      </ul>
    </section>
  )
}
