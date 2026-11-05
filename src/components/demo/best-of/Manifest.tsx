import { Fragment, type CSSProperties } from "react"
import { Count } from "../forma/Count"
import { typo } from "../forma/typo"
import type { DemoHomeContent } from "../shared/content"
import { SECTIONS } from "./ids"

type About = DemoHomeContent["about"]

/**
 * Manifest (wzór: `esencja/Manifest.tsx` — „DOJEBANE, dokładnie o to mi
 * chodziło”, więc wariant zostaje): pierwszy akapit biogramu w skali nagłówka.
 * Przewijanie dopełnia go słowo po słowie z szarości w atrament (nazwana oś
 * czasu widoku; każde słowo ma swój wycinek zakresu z zakładką na trzy słowa,
 * więc atrament płynie falą). Czysty CSS; bez wsparcia albo przy „ogranicz
 * ruch” tekst jest od razu pełny. Pod spodem cztery liczby z „O mnie”
 * (Number Flow — dojeżdżają cyfra po cyfrze przy wejściu w kadr).
 */
export function Manifest({ about }: { about: About }) {
  const [lead] = about.bio
  if (!lead) return null
  const text = `${lead.prefix}${lead.strong} ${lead.suffix}`
  const words = typo(text).split(" ")

  return (
    <section
      id={SECTIONS.about}
      data-bo-section={SECTIONS.about}
      aria-labelledby="bo-about-title"
      className="fm-container scroll-mt-24 pt-(--fm-section)"
    >
      <h2 id="bo-about-title" className="sr-only">
        {about.heading}
      </h2>
      <p className="bo-manifest bo-fill max-w-[21em] text-pretty">
        <span className="sr-only">{text}</span>
        <span aria-hidden="true" style={{ "--n": words.length } as CSSProperties}>
          {words.map((word, index) => (
            <Fragment key={index}>
              <span className="bo-fw" style={{ "--i": index } as CSSProperties}>
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
            data-bo-in=""
            style={{ "--i": index } as CSSProperties}
            className="row-span-2 grid grid-rows-subgrid content-start gap-y-3 xl:border-l xl:border-fm-edge xl:px-8 xl:first:border-0 xl:first:ps-0"
          >
            <dt className="row-start-2 max-w-[14rem] text-fm-small text-pretty text-fm-ink-3">
              {fact.label}
            </dt>
            {/* Number Flow ma pionowy margines na maskę cyfr — znosimy go, liczba stoi w linii tekstu. */}
            <dd className="row-start-1 self-start text-[2rem] leading-none font-[550] tracking-[-0.045em] whitespace-nowrap tabular-nums sm:text-[3rem] xl:text-[clamp(2.5rem,0.5rem+2.6vw,3rem)] [&_number-flow-react]:-my-[0.25em]">
              <FactValue value={fact.value} suffix={"suffix" in fact ? fact.suffix : undefined} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** Liczby „dojeżdżają” (Number Flow); zakres lat zostaje tekstem. */
function FactValue({ value, suffix }: { value: number | string; suffix?: string }) {
  if (typeof value === "number") return <Count value={value} suffix={suffix} />
  const decimal = value.match(/^(\d+),(\d+)%$/)
  if (decimal) {
    return (
      <Count
        value={Number(`${decimal[1]}.${decimal[2]}`)}
        format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        suffix="%"
      />
    )
  }
  return <>{value}</>
}
