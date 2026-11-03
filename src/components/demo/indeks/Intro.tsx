import type { CSSProperties } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import { LiveDot } from "@/components/demo/forma/Chip"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { Reveal } from "@/components/demo/forma/Reveal"
import type { ChipId, IndeksContent } from "./content"
import { SECTION } from "./anchors"
import { FactChip } from "./FactChip"
import type { IconName } from "./types"

const CHIP_ICON: Record<ChipId, IconName> = {
  experience: "history",
  web: "web",
  motion: "motion",
}

/** Kolejne fragmenty szarego zdania wyostrzają się co 40 ms, po ostatnim słowie tytułu. */
const LEAD_START = 300
const LEAD_STEP = 40

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

/**
 * Pierwszy ekran: jedno dwutonowe zdanie w skali prozy. Tytuł (atrament)
 * wchodzi słowo po słowie, biogram (szarość) dopływa w tej samej linii,
 * a trzy słowa w nim są chipami z faktami. Całe wejście to CSS z serwera —
 * nic nie czeka na JavaScript.
 */
export function Intro({
  intro,
  copiedLabel,
}: {
  intro: IndeksContent["intro"]
  copiedLabel: string
}) {
  let step = 0

  return (
    <section id={SECTION.start} className="ix-col scroll-mt-(--ix-header) pt-14 sm:pt-24">
      <p
        style={delay(0)}
        className="ix-enter inline-flex items-center gap-2.5 text-fm-small text-fm-ink-2"
      >
        <LiveDot />
        {intro.status}
      </p>

      <div className="mt-5 text-[1.4375rem] leading-[1.32] font-medium tracking-[-0.022em] text-pretty sm:mt-6 sm:text-[1.875rem] sm:leading-[1.27] sm:tracking-[-0.026em]">
        <Reveal as="h1" delay={60} className="inline text-fm-ink" parts={[{ text: intro.title }]} />{" "}
        <p className="inline text-fm-ink-3">
          {intro.lead.map((segment, index) =>
            "chip" in segment ? (
              <FactChip
                key={index}
                label={segment.text}
                icon={CHIP_ICON[segment.chip]}
                detail={intro.details[segment.chip]}
                delay={LEAD_START + step++ * LEAD_STEP}
              />
            ) : (
              <span
                key={index}
                className="ix-sharpen"
                style={delay(LEAD_START + step++ * LEAD_STEP)}
              >
                {segment.text}
              </span>
            )
          )}
        </p>
      </div>

      <div style={delay(480)} className="ix-enter mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
        <Button asChild size="lg" className="group w-full sm:w-auto">
          <a href={`#${SECTION.contact}`}>
            {intro.cta}
            <ArrowRight
              aria-hidden="true"
              className="transition-transform duration-200 ease-fm-snap group-hover:translate-x-0.5"
            />
          </a>
        </Button>
        <CopyButton
          value={intro.email}
          label={intro.email}
          copiedLabel={copiedLabel}
          className="h-12 w-full justify-center ps-5 pe-4 sm:w-auto"
        />
      </div>
    </section>
  )
}
