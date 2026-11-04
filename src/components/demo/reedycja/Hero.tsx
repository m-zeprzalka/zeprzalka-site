import type { CSSProperties } from "react"
import { Button } from "@/components/demo/forma/Button"
import { Reveal } from "@/components/demo/forma/Reveal"
import { typo } from "@/components/demo/forma/typo"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { HeroVideo } from "./HeroVideo"
import { SECTION } from "./ids"
import { Status } from "./Status"

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

/**
 * Hero w drugim wydaniu: te same elementy i ta sama kolejność co dziś
 * (status, nagłówek, podtytuł z „— 15 lat”, CTA, wideo). Jedyne zaaranżowane
 * wejście strony — CSS z serwera, nic nie czeka na JavaScript: nagłówek
 * wyostrza się słowo po słowie, reszta dopływa po nim, kadr na końcu.
 */
export function Hero({
  hero,
  worksLabel,
  videoFallback,
}: {
  hero: DemoHomeContent["hero"]
  worksLabel: string
  videoFallback: string
}) {
  const { subtitle } = hero

  return (
    <section id={SECTION.start} className="re-container pt-10 sm:pt-14 lg:pt-20">
      <div className="re-enter" style={delay(0)}>
        <Status label={hero.status} />
      </div>

      <Reveal
        as="h1"
        delay={60}
        className="re-display mt-6 max-w-[15ch] sm:mt-8 lg:max-w-[22ch]"
        parts={[{ text: hero.title }]}
      />

      {/* Jeden blok czytany od góry — nagłówek, lead, akcje — jak na telefonie i na produkcji. */}
      <p
        className="re-enter re-lead mt-6 max-w-[38rem] text-fm-ink-2 sm:mt-8 lg:mt-10"
        style={delay(380)}
      >
        {typo(subtitle.role)}
        <span className="font-medium text-fm-ink">{typo(subtitle.highlight)}</span>
        {typo(subtitle.rest)}
      </p>
      <div className="re-enter mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10" style={delay(460)}>
        <Button asChild size="lg">
          <a href={`#${SECTION.contact}`}>{hero.cta}</a>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <a href={`#${SECTION.works}`}>{worksLabel}</a>
        </Button>
      </div>

      <div className="re-enter-frame mt-10 sm:mt-14 lg:mt-16" style={delay(560)}>
        <HeroVideo video={hero.video} fallback={videoFallback} />
      </div>
    </section>
  )
}
