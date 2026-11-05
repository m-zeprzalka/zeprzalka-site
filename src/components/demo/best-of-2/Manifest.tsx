import { Fragment, type CSSProperties } from "react"
import { typo } from "../forma/typo"
import type { DemoHomeContent } from "../shared/content"
import { GlyphNumber, GlyphText } from "../shared/glyph"
import { SECTIONS } from "./ids"
import { UI } from "./ui-strings"

type About = DemoHomeContent["about"]

/**
 * Manifest (wzór: `esencja/Manifest.tsx` — „DOJEBANE, dokładnie o to mi
 * chodziło”, więc wariant zostaje): pierwszy akapit biogramu w skali nagłówka.
 * Przewijanie dopełnia go słowo po słowie z szarości w atrament (nazwana oś
 * czasu widoku; każde słowo ma swój wycinek zakresu z zakładką na trzy słowa,
 * więc atrament płynie falą). Czysty CSS; bez wsparcia albo przy „ogranicz
 * ruch” tekst jest od razu pełny. Nad nim „O mnie” dekodowane ze znaków,
 * pod nim cztery liczby, które przy wejściu w kadr składają się z glifów
 * (dekonstrukcja z laboratorium) — bez kart pod liczbami.
 */
export function Manifest({ about }: { about: About }) {
  const [lead] = about.bio
  if (!lead) return null
  const text = `${lead.prefix}${lead.strong} ${lead.suffix}`
  const words = typo(text).split(" ")

  return (
    <section
      id={SECTIONS.about}
      data-b2-section={SECTIONS.about}
      aria-labelledby="b2-about-title"
      className="fm-container scroll-mt-24 pt-(--fm-section)"
    >
      {/* „O mnie” dekodowane ze znaków przy wejściu w kadr (glif-lab: „fajny efekt dekodowania”). */}
      <GlyphText
        as="h2"
        id="b2-about-title"
        text={about.heading}
        className="mb-6 block text-[clamp(1.125rem,0.95rem+0.8vw,1.5rem)] font-medium tracking-[-0.02em] text-fm-ink-3 sm:mb-8"
      />
      <p className="b2-manifest b2-fill max-w-[21em] text-pretty">
        <span className="sr-only">{text}</span>
        <span aria-hidden="true" style={{ "--n": words.length } as CSSProperties}>
          {words.map((word, index) => (
            <Fragment key={index}>
              <span className="b2-fw" style={{ "--i": index } as CSSProperties}>
                {word}
              </span>
              {index < words.length - 1 && " "}
            </Fragment>
          ))}
        </span>
      </p>

      {/* Fakty na podsiatce: liczby w jednym wierszu (wspólna linia), podpisy w następnym. */}
      <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-20 xl:grid-cols-4 xl:gap-x-0">
        {about.facts.map((fact, index) => (
          <div
            key={fact.label}
            // Bez wejścia z rozmycia: wejściem liczby jest jej składanie ze znaków (jedno na element).
            className="row-span-2 grid grid-rows-subgrid content-start gap-y-3 xl:border-l xl:border-fm-edge xl:px-8 xl:first:border-0 xl:first:ps-0"
          >
            <dt className="row-start-2 max-w-[14rem] text-fm-small text-pretty text-fm-ink-3">
              {fact.label}
            </dt>
            <dd className="row-start-1 self-start text-[2rem] leading-none font-[550] tracking-[-0.045em] whitespace-nowrap tabular-nums sm:text-[3rem] xl:text-[clamp(2.5rem,0.5rem+2.6vw,3rem)]">
              {"since" in fact && (
                <span className="me-[0.18em] align-baseline text-[0.42em] font-medium tracking-[-0.02em] text-fm-ink-3">
                  {UI.since}
                </span>
              )}
              <GlyphNumber
                value={fact.value}
                suffix={"suffix" in fact ? fact.suffix : undefined}
                delay={index * 0.12}
              />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
