import { ArrowDown, ArrowRight } from "lucide-react"
import { LiveDot } from "@/components/demo/forma/Chip"
import type { TransformacjaContent } from "./content"

/**
 * Prawdziwe hero od pierwszej klatki — sprzedaje, zanim ktokolwiek przewinie:
 * kto (imię, status), co (h1 w gotowym kroju, rola i 15 lat) i co zrobić
 * (dwie pełnowymiarowe akcje). Rama obok tylko pokazuje, jak ten sam nagłówek
 * powstaje.
 */
export function Intro({
  hero,
  name,
  worksLabel,
}: {
  hero: TransformacjaContent["hero"]
  name: string
  worksLabel: string
}) {
  return (
    <div className="tf-intro">
      <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-fm-small">
        <LiveDot />
        <span className="font-medium text-fm-ink">{name}</span>
        <span className="text-fm-ink-3">{hero.status}</span>
      </p>
      <h1 id="tf-h1" className="tf-intro__title mt-5 text-fm-ink lg:mt-6">
        {hero.title}
      </h1>
      <p className="tf-lead mt-5 max-w-[34rem] text-fm-ink-2 lg:mt-6">
        {hero.subtitle.role}
        <span className="font-medium text-fm-ink">{hero.subtitle.highlight}</span>
        {hero.subtitle.rest}
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-9">
        <a
          href="#kontakt"
          className="group inline-flex h-12 fm-press items-center justify-center gap-2 rounded-full bg-fm-ink px-6 text-[0.9375rem] font-medium whitespace-nowrap text-fm-inverse fm-focus transition-[background-color,scale] duration-150 ease-fm-snap select-none hover:bg-fm-ink/85"
        >
          {hero.cta}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-200 ease-fm-snap group-hover:translate-x-0.5"
          />
        </a>
        <a
          href="#realizacje"
          className="group inline-flex h-12 fm-press items-center justify-center gap-2 rounded-full bg-fm-surface px-6 text-[0.9375rem] font-medium whitespace-nowrap text-fm-ink shadow-fm-ring fm-focus transition-[background-color,scale] duration-150 ease-fm-snap select-none hover:bg-fm-fill"
        >
          {worksLabel}
          <ArrowDown
            aria-hidden="true"
            className="size-4 transition-transform duration-200 ease-fm-snap group-hover:translate-y-0.5"
          />
        </a>
      </div>
    </div>
  )
}
