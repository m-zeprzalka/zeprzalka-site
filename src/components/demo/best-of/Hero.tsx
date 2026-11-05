import type { CSSProperties } from "react"
import Image from "next/image"
import { ArrowDown } from "lucide-react"
import { buttonVariants } from "../forma/Button"
import { LiveDot } from "../forma/Chip"
import { cn } from "../forma/cn"
import { typo } from "../forma/typo"
import type { DemoHomeContent } from "../shared/content"
import portrait from "../shared/portrait/portrait-luma-soft.webp"
import { HeroTitle } from "./HeroTitle"
import { SECTIONS } from "./ids"
import { LocalTime } from "./LocalTime"

const at = (ms: number) => ({ "--bo-d": `${ms}ms` }) as CSSProperties

/**
 * Pierwszy ekran wyrównany do lewej, jak u Framera: status, nagłówek, podtytuł
 * z wyróżnieniem lat i dwie akcje; na desktopie wizytówka z portretem (nowe
 * źródło, odcienie szarości), miastem i czasem. Wysokość zostawia u dołu pas
 * na kadr wideo — zaprasza do przewinięcia, zanim reel przejmie ekran.
 * Cała sekwencja wejścia to CSS — nagłówek (LCP) wyostrza się od pierwszej klatki.
 */
export function Hero({
  hero,
  person,
  worksLabel,
}: {
  hero: DemoHomeContent["hero"]
  person: DemoHomeContent["person"]
  /** „Zobacz realizacje” — etykieta z serwisu. */
  worksLabel: string
}) {
  return (
    <section
      id={SECTIONS.start}
      data-bo-section={SECTIONS.start}
      className="fm-container grid min-h-[min(calc(100svh-var(--bo-peek)),90vw)] content-center pt-[calc(var(--bo-header-top)+var(--bo-header)+2.5rem)] pb-10 [--bo-peek:clamp(6rem,16svh,10rem)] sm:pb-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:pb-16"
    >
      <div>
        <p
          className="bo-rise inline-flex h-8 items-center gap-2.5 rounded-full bg-fm-surface ps-3 pe-3.5 text-fm-small font-medium text-fm-ink-2 shadow-fm-ring"
          style={at(0)}
        >
          <LiveDot />
          {hero.status}
        </p>

        <HeroTitle
          text={hero.title}
          start={40}
          className="bo-display mt-6 text-balance sm:mt-8 sm:max-w-[13ch] lg:max-w-[16ch]"
        />

        <p
          className="bo-rise mt-6 max-w-[38rem] text-fm-lead text-pretty text-fm-ink-2 sm:mt-8"
          style={at(120)}
        >
          {hero.subtitle.role}
          <span className="font-medium text-fm-ink">{hero.subtitle.highlight}</span>
          {typo(hero.subtitle.rest)}
        </p>

        <div
          className="bo-rise mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
          style={at(180)}
        >
          <a
            href={`#${SECTIONS.contact}`}
            className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
          >
            {hero.cta}
          </a>
          <a
            href={`#${SECTIONS.portfolio}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "group w-full sm:w-auto"
            )}
          >
            {worksLabel}
            <ArrowDown
              aria-hidden="true"
              className="transition-transform duration-200 ease-fm-snap group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </div>

      {/* Wizytówka (desktop): człowiek za tekstem — portret z nowego źródła, miasto i czas. */}
      <aside
        className="bo-rise hidden items-center gap-3.5 self-end pb-1 lg:flex"
        style={at(240)}
        aria-label={person.name}
      >
        <span className="relative size-14 overflow-hidden rounded-full bg-fm-fill shadow-fm-ring">
          <Image
            src={portrait}
            alt=""
            sizes="56px"
            className="absolute inset-0 size-full scale-[1.55] object-cover object-[50%_32%]"
          />
        </span>
        <span className="text-fm-small leading-5">
          <span className="block font-medium text-fm-ink">{person.name}</span>
          <span className="block text-fm-ink-3">
            <LocalTime locality={person.locality} />
          </span>
        </span>
      </aside>
    </section>
  )
}
