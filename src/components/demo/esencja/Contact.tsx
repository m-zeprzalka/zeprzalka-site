import { CopyButton } from "../forma/CopyButton"
import type { DemoHomeContent } from "../shared/content"
import { ContactForm } from "./ContactForm"
import { SectionHeader } from "./SectionHeader"

/**
 * Kontakt: panel w dwóch częściach — ciemna strona z zaproszeniem, adresem
 * do skopiowania i czasem odpowiedzi (w obu motywach ciemna: lokalny zakres
 * tokenów `.es-ink`), jasna strona z formularzem.
 */
export function Contact({
  contact,
  email,
  copied,
}: {
  contact: DemoHomeContent["contact"]
  email: string
  copied: string
}) {
  return (
    <section
      id="kontakt"
      data-es-section="kontakt"
      aria-labelledby="kontakt-title"
      className="fm-container scroll-mt-24 py-(--fm-section)"
    >
      <SectionHeader id="kontakt-title" title={contact.title} lead={contact.lead} />

      <div
        data-es-in=""
        className="mt-12 grid gap-2 rounded-[2rem] bg-fm-surface p-2 shadow-fm-card sm:mt-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
      >
        <div className="es-ink flex flex-col rounded-[1.5rem] bg-fm-canvas p-6 text-fm-ink sm:p-8 lg:p-10">
          <h3 className="text-[1.75rem] leading-[1.08] font-[550] tracking-[-0.035em] text-balance sm:text-[2.25rem]">
            {contact.cardTitle}
          </h3>
          <p className="mt-4 max-w-[36ch] text-fm-body text-pretty text-fm-ink-2">
            {contact.cardDescription}
          </p>
          <div className="mt-10 grid gap-6 lg:mt-auto lg:pt-16">
            <CopyButton
              value={email}
              label={email}
              copiedLabel={copied}
              className="h-12 w-fit ps-5 pe-4"
            />
            <dl className="text-fm-small">
              <dt className="text-fm-ink-3">{contact.response.label}</dt>
              <dd className="mt-1 font-medium">{contact.response.value}</dd>
            </dl>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <ContactForm
            copy={contact.form}
            errors={contact.errors}
            privacyHref={contact.privacyHref}
          />
        </div>
      </div>
    </section>
  )
}
