import { typo } from "@/components/demo/forma/typo"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { ContactForm } from "./ContactForm"
import { EmailCode } from "./EmailCode"
import { SectionHead } from "./SectionHead"

/**
 * Kontakt (G): adres e-mail jako duży napis (klik kopiuje i puszcza glify),
 * czas odpowiedzi i formularz na papierze. Przycisk wysyłania miga glifem
 * zestawu G.
 */
export function Contact({
  contact,
  email,
  copied,
  copyLabel,
}: {
  contact: DemoHomeContent["contact"]
  email: string
  copied: string
  copyLabel: string
}) {
  return (
    <section
      id="kontakt"
      data-gll-section="contact"
      aria-labelledby="kontakt-title"
      className="gll-section"
    >
      <div className="fm-container">
        <SectionHead id="kontakt" section="contact" title={contact.title} lead={contact.lead} />
        <div className="mt-12 grid gap-x-8 gap-y-12 sm:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <EmailCode email={email} copied={copied} label={copyLabel} />
            <p className="mt-6 text-fm-small text-fm-ink-3">
              {contact.response.label}:{" "}
              <span className="text-fm-ink-2">{contact.response.value}</span>
            </p>
          </div>
          <div className="rounded-fm-4xl bg-fm-surface p-5 shadow-fm-card sm:p-8 lg:col-span-7">
            <h3 className="text-[1.375rem] leading-[1.2] font-medium tracking-[-0.025em] text-balance">
              {contact.cardTitle}
            </h3>
            <p className="mt-2 mb-7 max-w-[34rem] text-fm-small text-pretty text-fm-ink-2">
              {typo(contact.cardDescription)}
            </p>
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
