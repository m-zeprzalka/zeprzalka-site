import { Button } from "@/components/demo/forma/Button"
import { LiveDot } from "@/components/demo/forma/Chip"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { Reveal } from "@/components/demo/forma/Reveal"
import { typo } from "@/components/demo/forma/typo"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { VariantTag } from "../lab/VariantTag"
import { LocalTime } from "./LocalTime"
import { PortraitField } from "./PortraitField"
import { UI } from "../ui-strings"

/**
 * Pierwszy ekran: tekst złożony spokojnie Geistem (słowa wyostrzają się
 * z rozmycia — CSS, bez czekania na JS), obok portret z glifów (A).
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
      data-gll-section="hero"
      className="fm-container grid scroll-mt-(--gll-header) items-center gap-y-8 pt-5 pb-20 sm:gap-y-10 sm:pt-12 lg:min-h-[calc(100svh-var(--gll-header))] lg:grid-cols-12 lg:gap-x-8 lg:pt-6 lg:pb-16"
    >
      <div className="lg:col-span-7 lg:pb-10">
        <p className="inline-flex items-center gap-2.5 text-fm-small text-fm-ink-2 motion-safe:animate-[fm-fade_600ms_var(--ease-fm-snap)_both]">
          <LiveDot />
          {hero.status}
        </p>
        <Reveal
          as="h1"
          delay={80}
          parts={[{ text: hero.title }]}
          className="gll-display mt-4 max-w-[13ch] text-balance sm:mt-6"
        />
        <p className="mt-4 max-w-[34rem] text-fm-lead text-pretty text-fm-ink-2 motion-safe:animate-[fm-rise_850ms_var(--ease-fm-snap)_420ms_both] sm:mt-6">
          {typo(hero.subtitle.role)}
          <span className="text-fm-ink">{hero.subtitle.highlight}</span>
          {typo(hero.subtitle.rest)}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3 motion-safe:animate-[fm-rise_850ms_var(--ease-fm-snap)_520ms_both] sm:mt-9">
          <Button asChild size="lg" className="w-full min-[440px]:w-auto">
            <a href="#kontakt">{hero.cta}</a>
          </Button>
          <CopyButton
            value={person.email}
            label={person.email}
            copiedLabel={copied}
            // Telefon: adres jest w CTA i w kontakcie — tu ustępuje miejsca twarzy w pierwszym ekranie.
            className="hidden h-12 ps-5 pe-4 min-[440px]:inline-flex"
          />
        </div>
      </div>

      <div className="relative motion-safe:animate-[fm-fade_900ms_var(--ease-fm-snap)_200ms_both] lg:col-span-5 lg:col-start-8">
        <PortraitField label={UI.portrait} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <VariantTag section="hero" className="-ms-1" />
          <p className="text-fm-micro text-fm-ink-3">
            <LocalTime locality={person.locality} />
          </p>
        </div>
      </div>
    </section>
  )
}
