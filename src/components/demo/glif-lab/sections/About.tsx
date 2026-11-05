import { typo } from "@/components/demo/forma/typo"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { VariantTag } from "../lab/VariantTag"
import { DecodeText } from "../text/DecodeText"
import { Statement } from "../text/Statement"

/**
 * „O mnie” (B): pierwszy akapit biogramu dekodowany z glifów w tempie
 * przewijania (pierwsze zdanie atramentem, reszta szarością) i cztery liczby
 * z doświadczenia, dekodowane po wejściu w kadr.
 */
export function About({ about }: { about: DemoHomeContent["about"] }) {
  const [lead] = about.bio
  if (!lead) return null
  const [first = "", ...rest] = typo(lead.suffix).split(/(?<=\.)\s+/)

  return (
    <section
      id="o-mnie"
      data-gll-section="bio"
      aria-labelledby="gll-about-title"
      className="gll-section"
    >
      <div className="fm-container">
        <h2 id="gll-about-title" className="sr-only">
          {about.heading}
        </h2>
        <VariantTag section="bio" className="-ms-1 mb-8 sm:mb-10" />
        <Statement
          className="max-w-[24ch] sm:max-w-[28ch]"
          parts={[
            { text: typo(`${lead.prefix}${lead.strong} ${first}`), tone: "ink" },
            { text: rest.join(" "), tone: "muted" },
          ]}
        />
        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-24 lg:grid-cols-4">
          {about.facts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col-reverse justify-end gap-2 border-t border-fm-edge-strong pt-5"
            >
              <dt className="text-fm-small text-pretty text-fm-ink-3">{fact.label}</dt>
              <dd className="gll-fact tabular-nums">
                <DecodeText
                  section="bio"
                  text={`${fact.value}${"suffix" in fact ? fact.suffix : ""}`}
                  duration={0.6}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
