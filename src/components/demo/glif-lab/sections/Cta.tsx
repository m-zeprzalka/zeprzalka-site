import { Button } from "@/components/demo/forma/Button"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { VariantTag } from "../lab/VariantTag"
import { CtaPanel } from "./CtaPanel"
import { LensField } from "./LensField"

/**
 * CTA (E): panel z wezwaniem z obecnego hero. Obok tekstu (na telefonie pod
 * nim) — pole, w którym soczewka animowanego kodu idzie za kursorem albo
 * palcem, a bez interakcji sama dryfuje. Tekst nigdy nie leży na kodzie.
 * Kolor panelu z trybu wariantu E.
 */
export function Cta({
  hero,
  contact,
  email,
  copied,
}: {
  hero: DemoHomeContent["hero"]
  contact: DemoHomeContent["contact"]
  email: string
  copied: string
}) {
  return (
    <section data-gll-section="cta" aria-labelledby="gll-cta-title" className="gll-section pt-0!">
      <div className="fm-container">
        <VariantTag section="cta" className="-ms-1 mb-5" />
        <CtaPanel>
          <div className="relative z-[1] flex flex-col justify-between gap-10 p-6 sm:p-10 lg:col-span-6 lg:p-14">
            <h2
              id="gll-cta-title"
              className="max-w-[14ch] text-[clamp(2.25rem,1.4rem+3.6vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.045em] text-balance"
            >
              {hero.cta}
            </h2>
            <div className="grid gap-6">
              <p className="max-w-[30rem] text-fm-body text-pretty opacity-75">
                {contact.cardDescription}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="gll-cta-primary w-full min-[440px]:w-auto">
                  <a href="#kontakt">{contact.cardTitle}</a>
                </Button>
                <CopyButton
                  value={email}
                  label={email}
                  copiedLabel={copied}
                  className="h-12 ps-5 pe-4"
                />
              </div>
            </div>
          </div>
          <LensField />
        </CtaPanel>
      </div>
    </section>
  )
}
