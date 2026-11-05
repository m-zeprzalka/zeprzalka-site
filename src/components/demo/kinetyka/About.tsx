import { typo } from "../forma/typo"
import portrait from "../shared/portrait/portrait-luma-soft.webp"
import type { DemoHomeContent } from "../shared/content"
import { Odometer } from "./Odometer"
import { StatementText } from "./StatementText"

type About = DemoHomeContent["about"]

/**
 * O mnie: biogram w skali zdania-plakatu (światło po wierszach), obok
 * czarno-biały portret jak kadr z planu, pod spodem drugi akapit i fakty
 * jako ogromne liczby z licznikiem taśmy.
 */
export function About({ about, name }: { about: About; name: string }) {
  const [lead, second] = about.bio
  if (!lead || !second) return null

  return (
    <section
      id="o-mnie"
      aria-labelledby="kn-about-title"
      // Telefon: karty taśmy mają nierówne dolne krawędzie (tytuły 1–3 wiersze) — mniejszy odstęp wyrównuje rytm.
      className="pt-[calc(var(--kn-section)*0.6)] md:pt-(--kn-section)"
    >
      <div className="kn-wrap grid gap-10 md:grid-cols-12 md:gap-6">
        <h2 id="kn-about-title" className="sr-only">
          {about.heading}
        </h2>
        <figure className="kn-portrait md:col-span-3 md:pt-[0.4em]">
          <div className="md:sticky md:top-24">
            {/* eslint-disable-next-line @next/next/no-img-element -- portret ma docelowy rozmiar (404×505 WebP) */}
            <img
              src={portrait.src}
              width={portrait.width}
              height={portrait.height}
              alt={name}
              loading="lazy"
              decoding="async"
              className="w-28 sm:w-36 md:w-full md:max-w-60"
            />
            <figcaption className="mt-3 text-fm-micro text-fm-ink-3">{name}</figcaption>
          </div>
        </figure>
        <div className="md:col-span-9">
          <StatementText
            prefix={typo(lead.prefix)}
            strong={typo(lead.strong)}
            suffix={typo(lead.suffix)}
          />
          <p className="kn-lead mt-10 max-w-[46ch] text-pretty text-fm-ink-2 sm:mt-14">
            {typo(second.prefix)}
            <strong className="font-medium text-fm-ink">{typo(second.strong)}</strong>
            {typo(second.suffix)}
          </p>
        </div>
      </div>

      <dl className="kn-wrap mt-(--kn-section)">
        {about.facts.map((fact) => {
          const value = `${fact.value}${"suffix" in fact ? fact.suffix : ""}`
          return (
            <div
              key={fact.label}
              className="grid gap-x-6 gap-y-3 border-t border-fm-edge pt-4 pb-6 sm:pt-6 md:grid-cols-12 md:items-end"
            >
              <dt className="order-2 max-w-[22ch] text-[1.0625rem] leading-snug text-pretty text-fm-ink-2 md:col-span-3 md:col-start-10 md:pb-[1.1em]">
                {fact.label}
              </dt>
              <dd className="kn-number md:col-span-9">
                <span className="sr-only">{value}</span>
                <Odometer value={value} />
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
