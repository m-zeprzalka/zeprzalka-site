import { Fragment, type CSSProperties } from "react"
import { cn } from "@/components/demo/forma/cn"
import { SECTION } from "./anchors"
import { Chip } from "./Chip"
import type { Indeks2Content } from "./content"
import { Facts } from "./Facts"
import { COL } from "./grid"
import { SectionHead } from "./SectionHead"

/**
 * O mnie: dalszy ciąg zdania ze startu, wypełniany przewijaniem słowo po słowie
 * z szarości w atrament (oś czasu widoku, czysty CSS — jedyny „scrub” strony,
 * zostaje na prośbę właściciela). Chipy w tekście otwierają karty jak na
 * starcie. Pod spodem cztery liczby.
 */
export function About({
  about,
  labels,
}: {
  about: Indeks2Content["about"]
  labels: { since: string }
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
      className="pt-(--i2-section)"
    >
      <div className="i2-grid">
        <div className={COL.text}>
          <SectionHead id={`${SECTION.about}-title`} title={about.heading} />
          <p
            className="i2-fill mt-8 text-[1.3125rem] leading-[1.42] font-medium tracking-[-0.02em] text-pretty text-fm-ink sm:mt-10 sm:text-[1.625rem] sm:leading-[1.36] xl:text-[1.5rem] 2xl:text-[1.625rem] min-[105rem]:text-[1.875rem]"
            style={{ "--n": total } as CSSProperties}
          >
            {about.fill.map((segment, segmentIndex) => {
              const first = starts[segmentIndex] ?? 0
              if ("card" in segment) {
                return (
                  <Chip
                    key={segmentIndex}
                    text={segment.text}
                    card={segment.card}
                    style={{ "--i": first } as CSSProperties}
                    className="i2-fw text-inherit"
                  />
                )
              }
              const parts = segment.text.split(/(\s+)/)
              let word = 0
              return (
                <Fragment key={segmentIndex}>
                  {parts.map((part, partIndex) =>
                    /^\s+$/.test(part) || !part ? (
                      part
                    ) : (
                      <span
                        key={partIndex}
                        className="i2-fw"
                        style={{ "--i": first + word++ } as CSSProperties}
                      >
                        {part}
                      </span>
                    )
                  )}
                </Fragment>
              )
            })}
          </p>
          <Facts facts={about.facts} since={labels.since} className={cn("mt-16 sm:mt-20")} />
        </div>
      </div>
    </section>
  )
}
