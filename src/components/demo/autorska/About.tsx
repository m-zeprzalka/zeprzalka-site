import type { CSSProperties } from "react"
import type { DemoHomeContent } from "../shared/content"
import { GlyphNumber, GlyphPortrait, GlyphText } from "../shared/glyph"
import { Sheet } from "./Sheet"
import { UI } from "./ui-strings"

/**
 * Warstwa 2 — O mnie. Nagłówek dekodowany ze znaków, „Mam 15 lat…” wypełniane przewijaniem
 * słowo po słowie (ulubiony efekt — zostaje scrub), twarz ze znaków (nigdy zdjęcie; kursor
 * i palec — morfujący szum), cztery liczby składane ze znaków. Bez szarych kart pod liczbami.
 */
export function About({ about, index }: { about: DemoHomeContent["about"]; index: number }) {
  const [lead, second] = about.bio
  const segments = lead
    ? [
        { text: lead.prefix, strong: false },
        { text: lead.strong, strong: true },
        { text: lead.suffix, strong: false },
      ]
    : []
  const words = segments.flatMap((segment) =>
    segment.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, strong: segment.strong }))
  )

  return (
    <Sheet index={index} anchor="o-mnie" labelledBy="o-mnie-title">
      <div className="grid gap-x-(--au-gap) gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <GlyphText
            as="h2"
            id="o-mnie-title"
            text={about.heading}
            className="text-fm-lead font-medium tracking-[-0.012em] text-fm-ink"
          />
          <p
            className="au-fill mt-6 text-[clamp(1.5rem,2.9vw,2.5rem)] leading-[1.16] font-semibold tracking-[-0.035em] text-pretty text-fm-ink"
            style={{ "--n": words.length } as CSSProperties}
          >
            {words.map((entry, wordIndex) => (
              <span key={wordIndex}>
                <span className="au-fw" style={{ "--i": wordIndex } as CSSProperties}>
                  {entry.word}
                </span>
                {wordIndex < words.length - 1 ? " " : null}
              </span>
            ))}
          </p>
        </div>

        <div className="lg:col-span-4 lg:row-span-2 lg:row-start-1">
          <GlyphPortrait
            interactive
            label={UI.face}
            className="mx-auto w-full max-w-[20rem] sm:max-w-[22rem] lg:max-w-none"
          />
        </div>

        {second && (
          <p className="max-w-[38rem] text-fm-lead text-pretty text-fm-ink-2 lg:col-span-6 lg:col-start-6">
            {second.prefix}
            <span className="text-fm-ink">{second.strong}</span>
            {second.suffix}
          </p>
        )}
      </div>

      <dl className="mt-14 grid grid-cols-2 gap-x-(--au-gap) gap-y-10 border-t border-fm-edge pt-8 lg:mt-20 lg:grid-cols-4">
        {about.facts.map((fact) => (
          <div key={fact.label} className="flex flex-col-reverse gap-2">
            <dt className="max-w-[18ch] text-fm-small text-pretty text-fm-ink-3">{fact.label}</dt>
            <dd>
              <GlyphNumber
                value={fact.value}
                suffix={"suffix" in fact ? fact.suffix : undefined}
                since={"since" in fact}
                sinceLabel={UI.since}
                className="text-[clamp(2.25rem,4vw,3.5rem)] leading-none font-semibold tracking-[-0.04em]"
              />
            </dd>
          </div>
        ))}
      </dl>
    </Sheet>
  )
}
