import { typo } from "@/components/demo/forma/typo"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { DecodeText } from "./DecodeText"
import { Statement } from "./Statement"

/**
 * „O mnie” w jednym akapicie z biogramu (pierwsze zdanie atramentem, drugie
 * szarością), dekodowanym przewijaniem, i cztery liczby z doświadczenia.
 */
export function About({ about }: { about: DemoHomeContent["about"] }) {
  const [lead] = about.bio
  if (!lead) return null
  const [first = "", ...rest] = typo(lead.suffix).split(/(?<=\.)\s+/)

  return (
    <section id="o-mnie" aria-labelledby="gl-about-title" className="gl-section">
      <div className="fm-container">
        <h2 id="gl-about-title" className="sr-only">
          {about.heading}
        </h2>
        <Statement
          className="max-w-[24ch] sm:max-w-[28ch]"
          parts={[
            { text: `${lead.prefix}${lead.strong} ${first}`, tone: "ink" },
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
              <dd className="gl-fact tabular-nums">
                <DecodeText text={`${fact.value}${"suffix" in fact ? fact.suffix : ""}`} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
