import type { CSSProperties } from "react"
import { ArrowDown } from "lucide-react"
import { buttonVariants } from "../forma/Button"
import { LiveDot } from "../forma/Chip"
import { cn } from "../forma/cn"
import { typo } from "../forma/typo"
import type { DemoHomeContent } from "../shared/content"
import { HeroTitle } from "./HeroTitle"
import { LocalTime } from "./LocalTime"

const at = (ms: number) => ({ "--es-d": `${ms}ms` }) as CSSProperties

/**
 * Pierwszy ekran wyrównany do lewej, jak u Framera i na obecnej stronie:
 * status, nagłówek, podtytuł z wyróżnieniem lat i dwie akcje. Cała sekwencja
 * wejścia to CSS — nagłówek (LCP) wyostrza się od pierwszej klatki.
 */
export function Hero({
  hero,
  person,
  works,
}: {
  hero: DemoHomeContent["hero"]
  person: DemoHomeContent["person"]
  works: { label: string; href: string }
}) {
  return (
    <section className="fm-container grid pt-[calc(var(--es-header-top)+var(--es-header)+3.5rem)] pb-12 sm:pt-[calc(var(--es-header-top)+var(--es-header)+5.5rem)] md:pb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:pt-[calc(var(--es-header-top)+var(--es-header)+7rem)]">
      <div>
        <p
          className="es-rise inline-flex h-8 items-center gap-2.5 rounded-full bg-fm-surface ps-3 pe-3.5 text-fm-small font-medium text-fm-ink-2 shadow-fm-ring"
          style={at(0)}
        >
          <LiveDot />
          {hero.status}
        </p>

        <HeroTitle
          text={hero.title}
          start={40}
          className="es-display mt-6 text-balance sm:mt-8 sm:max-w-[13ch] lg:max-w-[16ch]"
        />

        <p
          className="es-rise mt-6 max-w-[38rem] text-fm-lead text-pretty text-fm-ink-2 sm:mt-8"
          style={at(100)}
        >
          {hero.subtitle.role}
          <span className="font-medium text-fm-ink">{hero.subtitle.highlight}</span>
          {typo(hero.subtitle.rest)}
        </p>

        <div
          className="es-rise mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
          style={at(160)}
        >
          <a href="#kontakt" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
            {hero.cta}
          </a>
          <a
            href={works.href}
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "group w-full sm:w-auto"
            )}
          >
            {works.label}
            <ArrowDown
              aria-hidden="true"
              className="transition-transform duration-200 ease-fm-snap group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </div>

      {/* Wizytówka (desktop): portret ASCII, imię, miasto i czas — człowiek za tekstem. */}
      <aside
        className="es-rise hidden items-center gap-3.5 self-end pb-1 lg:flex"
        style={at(220)}
        aria-label={person.name}
      >
        <span className="es-avatar relative size-14 overflow-hidden rounded-full bg-white shadow-fm-ring">
          {/* eslint-disable-next-line @next/next/no-img-element -- 300 px PNG, mniejszy niż narzut optymalizacji */}
          <img
            src={person.avatar}
            alt=""
            width={56}
            height={56}
            className="size-full object-cover"
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
