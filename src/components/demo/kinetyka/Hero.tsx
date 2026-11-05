import type { CSSProperties } from "react"
import { ArrowDown } from "lucide-react"
import { LiveDot } from "../forma/Chip"
import { typo } from "../forma/typo"
import type { DemoHomeContent } from "../shared/content"
import { HeroExit } from "./HeroExit"
import { LocalTime } from "./LocalTime"
import { Magnetic } from "./Magnetic"
import { RollText } from "./RollText"
import { SplitChars } from "./split"

type Hero = DemoHomeContent["hero"]

/**
 * Tytuł: H1 w skali plakatu składa się z liter (CSS, start z pierwszym
 * malowaniem), pod nim podtytuł i akcje. Przy wyjściu wiersze H1 odjeżdżają
 * w trzech tempach (HeroExit). Kadr wideo czeka w następnej scenie (Okno).
 */
export function Hero({
  hero,
  locality,
  works,
}: {
  hero: Hero
  locality: string
  works: { label: string; href: string }
}) {
  return (
    <section
      id="start"
      aria-labelledby="kn-title"
      className="kn-hero relative flex min-h-svh flex-col pt-[calc(var(--kn-header)+1.25rem)] pb-10 sm:pb-14"
    >
      <div className="kn-wrap flex flex-1 flex-col">
        <div
          className="kn-rise flex items-center justify-between gap-4 text-fm-small text-fm-ink-2"
          style={{ "--d": "60ms" } as CSSProperties}
        >
          <p className="flex items-center gap-2.5">
            <LiveDot />
            {hero.status}
          </p>
          <p className="hidden sm:block">
            <LocalTime locality={locality} />
          </p>
        </div>

        <h1 id="kn-title" className="kn-poster kn-develop mt-auto pt-16 text-balance sm:pt-24">
          <SplitChars text={hero.title} start={60} spread={620} power={0.78} />
        </h1>

        <div className="kn-hero-tail mt-8 grid gap-8 sm:mt-12 lg:grid-cols-12 lg:items-end lg:gap-6">
          <p
            className="kn-rise kn-lead max-w-[34ch] text-pretty text-fm-ink-2 lg:col-span-5"
            style={{ "--d": "480ms" } as CSSProperties}
          >
            <span className="text-fm-ink">{hero.subtitle.role}</span>
            {typo(hero.subtitle.highlight)}
            {typo(hero.subtitle.rest)}.
          </p>
          <div
            className="kn-rise flex flex-col gap-3 sm:flex-row sm:items-center lg:col-span-7 lg:justify-end"
            style={{ "--d": "580ms" } as CSSProperties}
          >
            <Magnetic className="max-sm:w-[calc(100%+2rem)]">
              <a
                href="#kontakt"
                className="kn-roll-host inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-fm-ink px-7 text-[1rem] font-medium text-fm-inverse fm-focus transition-[scale] duration-150 ease-fm-snap active:scale-[0.97] sm:w-auto"
              >
                <span data-kn-label="" className="inline-flex">
                  <RollText text={hero.cta} />
                </span>
              </a>
            </Magnetic>
            <a
              href={works.href}
              className="kn-roll-host inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[1rem] font-medium text-fm-ink fm-focus sm:h-14"
            >
              <RollText text={works.label} />
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </div>
      <HeroExit />
    </section>
  )
}
