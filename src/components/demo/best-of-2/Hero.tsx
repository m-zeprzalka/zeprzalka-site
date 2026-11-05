import type { CSSProperties } from "react"
import { ArrowDown } from "lucide-react"
import { buttonVariants } from "../forma/Button"
import { LiveDot } from "../forma/Chip"
import { cn } from "../forma/cn"
import { typo } from "../forma/typo"
import type { DemoHomeContent } from "../shared/content"
import { HeroTitle } from "./HeroTitle"
import { SECTIONS } from "./ids"
import { LocalTime } from "./LocalTime"

const at = (ms: number) => ({ "--b2-d": `${ms}ms` }) as CSSProperties

/**
 * Pierwszy ekran wyrównany do lewej, jak u Framera: status, nagłówek, podtytuł
 * z wyróżnieniem lat i dwie akcje; na desktopie wizytówka (imię i nazwisko,
 * miasto i czas — bez zdjęcia: twarz pojawia się tylko ze znaków, przy kontakcie). Wysokość zostawia u dołu pas na kadr wideo, który wystaje
 * spod tekstu. Harmonijka wejścia to CSS: nawigacja (0 ms) → słowa nagłówka
 * (od 90 ms co 35 ms) → podtytuł i akcje → kadr wideo (320 ms); całość < 0,9 s.
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
      data-b2-section={SECTIONS.start}
      className="fm-container grid min-h-[min(calc(100svh-var(--b2-peek)),90vw)] content-center pt-[calc(var(--b2-header-top)+var(--b2-header)+2.5rem)] pb-10 [--b2-peek:clamp(6rem,16svh,10rem)] sm:pb-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:pb-16"
    >
      <div>
        <p
          className="b2-rise inline-flex h-8 items-center gap-2.5 rounded-full bg-fm-surface ps-3 pe-3.5 text-fm-small font-medium text-fm-ink-2 shadow-fm-ring"
          style={at(60)}
        >
          <LiveDot />
          {hero.status}
        </p>

        <HeroTitle
          text={hero.title}
          start={90}
          className="b2-display mt-6 text-balance sm:mt-8 sm:max-w-[13ch] lg:max-w-[16ch]"
        />

        <p
          className="b2-rise mt-6 max-w-[38rem] text-fm-lead text-pretty text-fm-ink-2 sm:mt-8"
          style={at(200)}
        >
          {hero.subtitle.role}
          <span className="font-medium text-fm-ink">{hero.subtitle.highlight}</span>
          {typo(hero.subtitle.rest)}
        </p>

        <div
          className="b2-rise mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
          style={at(250)}
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

      {/* Wizytówka (desktop): człowiek, miasto i czas — sygnet żyje już w logo nagłówka. */}
      <aside
        className="b2-rise hidden items-center gap-3 self-end pb-1 lg:flex"
        style={at(300)}
        aria-label={person.name}
      >
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
