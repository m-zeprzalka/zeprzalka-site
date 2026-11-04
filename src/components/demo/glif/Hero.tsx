import { Button } from "@/components/demo/forma/Button"
import { LiveDot } from "@/components/demo/forma/Chip"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { Reveal } from "@/components/demo/forma/Reveal"
import { typo } from "@/components/demo/forma/typo"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { LocalTime } from "./LocalTime"
import { PortraitField } from "./PortraitField"
import { UI } from "./ui-strings"

/**
 * Pierwszy ekran: tekst złożony spokojnie Geistem, obok żywy portret z glifów.
 * Jedyny „spektakl” strony: nagłówek wyostrza się słowami (CSS, bez czekania
 * na JS), a pole układa się z szumu w twarz.
 */
export function Hero({
  hero,
  person,
  copied,
}: {
  hero: DemoHomeContent["hero"]
  person: DemoHomeContent["person"]
  copied: string
}) {
  return (
    <section
      id="start"
      className="fm-container grid scroll-mt-(--gl-header) items-center gap-y-10 pt-8 pb-20 sm:pt-12 lg:grid-cols-12 lg:gap-x-8 lg:pt-10 lg:pb-28"
    >
      <div className="lg:col-span-7 lg:pb-6">
        <p className="inline-flex items-center gap-2.5 text-fm-small text-fm-ink-2 motion-safe:animate-[fm-fade_600ms_var(--ease-fm-snap)_both]">
          <LiveDot />
          {hero.status}
        </p>
        <Reveal
          as="h1"
          delay={80}
          parts={[{ text: hero.title }]}
          className="gl-display mt-6 text-balance"
        />
        <p className="mt-6 max-w-[34rem] text-fm-lead text-pretty text-fm-ink-2 motion-safe:animate-[fm-rise_850ms_var(--ease-fm-snap)_420ms_both]">
          {typo(hero.subtitle.role)}
          <span className="text-fm-ink">{hero.subtitle.highlight}</span>
          {typo(hero.subtitle.rest)}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3 motion-safe:animate-[fm-rise_850ms_var(--ease-fm-snap)_520ms_both]">
          <Button asChild size="lg" className="w-full min-[440px]:w-auto">
            <a href="#kontakt">{hero.cta}</a>
          </Button>
          <CopyButton
            value={person.email}
            label={person.email}
            copiedLabel={copied}
            className="h-12 ps-5 pe-4"
          />
        </div>
      </div>

      <div className="relative lg:col-span-5 lg:col-start-8">
        <PortraitField src={person.avatar} label={UI.portrait} />
        <p className="mt-3 flex items-center justify-between gap-4 text-fm-micro text-fm-ink-3">
          <span className="pointer-coarse:hidden">{UI.hintPointer}</span>
          <span className="hidden pointer-coarse:inline">{UI.hintTouch}</span>
          <LocalTime locality={person.locality} />
        </p>
      </div>
    </section>
  )
}
