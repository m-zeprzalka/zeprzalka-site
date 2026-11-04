import { ArrowRight } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import { LiveDot } from "@/components/demo/forma/Chip"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import type { ChipId, TryptykContent } from "./content"
import { FactChip } from "./FactChip"
import { Facts } from "./Facts"
import { Headline } from "./Headline"
import { Media } from "./Media"
import type { IconName } from "./types"

const CHIP_ICON: Record<ChipId, IconName> = {
  experience: "history",
  web: "web",
  motion: "motion",
}

/**
 * Pierwszy ekran środkowej kolumny. Nagłówek w skali display (atrament,
 * ciasne światło) — jedyny ruch na wejściu. Pod nim biogram w szarości jako
 * lead, a trzy słowa w nim są pigułkami z faktami (popover). Poniżej 1024 px
 * (bez sceny) pod przyciskami gra reel. Szyna i scena stoją od pierwszej klatki.
 */
export function Intro({
  content,
  labels,
}: {
  content: Pick<TryptykContent, "intro" | "status" | "facts" | "reel" | "person">
  labels: { copied: string; play: string; pause: string }
}) {
  const { intro, status, reel, person } = content

  return (
    <section id="start" className="pt-10 sm:pt-20 lg:pt-24 xl:pt-[clamp(6rem,15vh,9.5rem)]">
      <p className="inline-flex items-center gap-2.5 text-fm-small text-fm-ink-2">
        <LiveDot />
        {status}
      </p>

      <Headline
        text={intro.title}
        className="mt-5 max-w-[16ch] text-[clamp(2rem,1.45rem+2.2vw,3.25rem)] leading-[1.04] font-medium tracking-[-0.04em] text-balance text-fm-ink sm:mt-6"
      />
      <p className="mt-5 max-w-[36rem] text-[clamp(1.25rem,1.1rem+0.4vw,1.375rem)] leading-[1.5] tracking-[-0.012em] text-pretty text-fm-ink-3 sm:mt-6">
        {intro.lead.map((segment, index) =>
          "chip" in segment ? (
            <FactChip
              key={index}
              label={segment.text}
              icon={CHIP_ICON[segment.chip]}
              detail={intro.details[segment.chip]}
            />
          ) : (
            <span key={index}>{segment.text}</span>
          )
        )}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
        <Button asChild size="lg" className="group w-full sm:w-auto">
          <a href="#kontakt">
            {intro.cta}
            <ArrowRight
              aria-hidden="true"
              className="transition-transform duration-200 ease-fm-snap group-hover:translate-x-0.5"
            />
          </a>
        </Button>
        <CopyButton
          value={person.email}
          label={person.email}
          copiedLabel={labels.copied}
          className="h-12 w-full justify-center ps-5 pe-4 sm:w-auto"
        />
      </div>

      {/* Bez sceny (< 1024 px) reel stoi w treści — multimedia w głównej kolumnie. */}
      <div className="mt-10 lg:hidden">
        <Media
          title={person.name}
          poster={reel.poster}
          video={{ webm: reel.webm, mp4: reel.mp4 }}
          ratio={reel.width / reel.height}
          active
          eager
          sizes="(min-width: 40rem) 40rem, 100vw"
          labels={labels}
          className="aspect-video w-full rounded-fm-2xl"
        />
      </div>

      <Facts facts={content.facts} />
    </section>
  )
}
