import { CopyButton } from "@/components/demo/forma/CopyButton"
import { SECTION } from "./anchors"
import { ContactForm } from "./ContactForm"
import type { IndeksNewContent } from "./content"
import { Section } from "./Section"

/** Kontakt w tej samej kolumnie: e-mail do skopiowania, czas odpowiedzi, krótki formularz. */
export function Contact({
  contact,
  email,
  copiedLabel,
}: {
  contact: IndeksNewContent["contact"]
  email: string
  copiedLabel: string
}) {
  return (
    <Section id={SECTION.contact} title={contact.title} lead={contact.lead}>
      <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-fm-small">
        <CopyButton
          value={email}
          label={email}
          copiedLabel={copiedLabel}
          className="h-11 sm:h-10"
        />
        <p className="text-fm-ink-3">
          {contact.response.label}: <span className="text-fm-ink-2">{contact.response.value}</span>
        </p>
      </div>
      <ContactForm
        labels={contact.form}
        errors={contact.errors}
        privacyHref={contact.privacyHref}
      />
    </Section>
  )
}
