import { CopyButton } from "@/components/demo/forma/CopyButton"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { ContactForm } from "./ContactForm"
import { SECTION } from "./ids"
import { Section } from "./Section"

/**
 * Kontakt: w szynie to, czego szuka ktoś, kto nie chce formularza — adres
 * do skopiowania i czas odpowiedzi. Formularz w karcie (dziś „karta” bez tła,
 * ramki i odstępów — została sama nazwa).
 */
export function Contact({
  contact,
  email,
  copiedLabel,
}: {
  contact: DemoHomeContent["contact"]
  email: string
  copiedLabel: string
}) {
  return (
    <Section
      id={SECTION.contact}
      title={contact.title}
      lead={contact.lead}
      actions={
        <div className="flex flex-col items-start gap-3">
          <CopyButton value={email} label={email} copiedLabel={copiedLabel} />
          <p className="text-sm text-fm-ink-3">
            {contact.response.label}:{" "}
            <span className="text-fm-ink-2">{contact.response.value}</span>
          </p>
        </div>
      }
    >
      <div className="rounded-[1.75rem] bg-fm-surface p-5 shadow-fm-card sm:p-8 lg:p-10">
        <h3 className="text-xl font-medium tracking-[-0.02em] text-balance sm:text-2xl">
          {contact.cardTitle}
        </h3>
        <p className="mt-2 max-w-[52ch] text-pretty text-fm-ink-2">{contact.cardDescription}</p>
        <div className="mt-8">
          <ContactForm
            copy={contact.form}
            errors={contact.errors}
            privacyHref={contact.privacyHref}
          />
        </div>
      </div>
    </Section>
  )
}
