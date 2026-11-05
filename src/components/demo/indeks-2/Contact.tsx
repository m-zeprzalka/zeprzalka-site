import { ArrowDown } from "lucide-react"
import { buttonVariants } from "@/components/demo/forma/Button"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { cn } from "@/components/demo/forma/cn"
import { SECTION } from "./anchors"
import { ContactForm } from "./ContactForm"
import type { Indeks2Content } from "./content"
import { GlyphLens } from "./glyph"
import { COL } from "./grid"
import { SectionHead } from "./SectionHead"

const FORM_ID = "i2-formularz"

/**
 * Kontakt: najpierw zaproszenie na konsultację w czarnym polu z soczewką kodu
 * (nieregularna, morfująca plama znaków idzie za kursorem albo palcem — we
 * własnej strefie pola, czytelność treści pierwsza), pod spodem krótki
 * formularz w kolumnie tekstu.
 */
export function Contact({
  contact,
  cta,
  email,
  copiedLabel,
}: {
  contact: Indeks2Content["contact"]
  cta: string
  email: string
  copiedLabel: string
}) {
  return (
    <section
      id={SECTION.contact}
      aria-labelledby={`${SECTION.contact}-title`}
      className="pt-(--i2-section)"
    >
      <div className="i2-grid">
        <div className={COL.text}>
          <SectionHead id={`${SECTION.contact}-title`} title={contact.title} lead={contact.lead} />
        </div>
        <div className={cn(COL.wide, "mt-8 sm:mt-10")}>
          {/* Soczewka ma własne okno — nigdy pod tekstem ani przyciskami: na telefonie
              pas między nagłówkiem a akcjami, od 1024 px prawa część pola (promień
              koncentryczny: 32 px pola − 12 px odstępu = 20 px okna). */}
          <div className="dark grid overflow-hidden rounded-fm-4xl bg-[oklch(0.13_0_0)] text-[oklch(0.975_0_0)] shadow-fm-ring [grid-template-areas:'head'_'lens'_'actions'] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:[grid-template-areas:'head_lens'_'actions_lens']">
            <p className="p-6 pb-0 text-[2rem] leading-[1.08] font-medium tracking-[-0.035em] text-balance [grid-area:head] sm:p-10 sm:pb-0 sm:text-[2.75rem] lg:p-12 lg:pb-0 lg:text-[3.25rem]">
              <span className="block max-w-[16ch]">{cta}</span>
            </p>
            <GlyphLens className="mx-6 my-8 h-48 overflow-hidden rounded-fm-2xl bg-[oklch(0.16_0_0)] [grid-area:lens] sm:mx-10 sm:h-56 lg:m-3 lg:ms-0 lg:h-auto lg:min-h-[24rem]" />
            <div className="flex flex-col gap-5 p-6 pt-0 [grid-area:actions] sm:p-10 sm:pt-0 lg:justify-end lg:p-12">
              <p className="max-w-[36ch] text-fm-small text-pretty text-[oklch(0.77_0_0)]">
                {contact.response.label}: {contact.response.value}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`#${FORM_ID}`}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group bg-[oklch(0.975_0_0)] text-[oklch(0.145_0_0)] hover:bg-[oklch(0.975_0_0/0.88)]"
                  )}
                >
                  {contact.cardTitle}
                  <ArrowDown
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-fm-snap group-hover:translate-y-0.5"
                  />
                </a>
                <CopyButton
                  value={email}
                  label={email}
                  copiedLabel={copiedLabel}
                  className="h-12 bg-[oklch(0.215_0_0)] text-[oklch(0.975_0_0)] shadow-none hover:bg-[oklch(0.26_0_0)]"
                />
              </div>
            </div>
          </div>
        </div>
        <div id={FORM_ID} className={cn(COL.text, "mt-16 scroll-mt-28 sm:mt-20")}>
          <h3 className="text-[1.25rem] leading-tight font-medium tracking-[-0.02em] text-fm-ink">
            {contact.cardTitle}
          </h3>
          <p className="mt-2 text-fm-body text-pretty text-fm-ink-2">{contact.cardDescription}</p>
          <div className="mt-8">
            <ContactForm
              labels={contact.form}
              errors={contact.errors}
              privacyHref={contact.privacyHref}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
