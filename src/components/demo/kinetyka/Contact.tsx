import { CopyButton } from "../forma/CopyButton"
import { typo } from "../forma/typo"
import type { DemoHomeContent } from "../shared/content"
import { ContactForm } from "./ContactForm"
import { RollText } from "./RollText"
import { SplitChars } from "./split"

type ContactContent = DemoHomeContent["contact"]

/**
 * Kontakt: nagłówek w skali plakatu, adres e-mail jako drugi plakat (litery
 * przewijane pod kursorem, obok kopiowanie) i formularz. Kolumny: po lewej
 * to, co czyta się w sekundę, po prawej to, co się wypełnia.
 */
export function Contact({
  contact,
  email,
  copied,
}: {
  contact: ContactContent
  email: string
  copied: string
}) {
  return (
    <section id="kontakt" aria-labelledby="kn-contact-title" className="kn-wrap pt-(--kn-section)">
      <h2 id="kn-contact-title" data-kn-in="chars" className="kn-title">
        <SplitChars text={contact.title} spread={300} />
      </h2>
      <div className="mt-8 grid gap-14 sm:mt-12 lg:grid-cols-12 lg:gap-6">
        <div data-kn-in="" className="lg:col-span-6">
          <p className="kn-lead max-w-[30ch] text-pretty text-fm-ink-2">{contact.lead}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3">
            <a
              href={`mailto:${email}`}
              className="kn-roll-host kn-email rounded-fm-sm font-semibold fm-focus"
            >
              <RollText text={email} />
            </a>
            <CopyButton value={email} label="Kopiuj" copiedLabel={copied} className="h-11" />
          </div>
          <p className="mt-8 text-fm-small text-fm-ink-3">
            {contact.response.label}: <span className="text-fm-ink">{contact.response.value}</span>
          </p>
        </div>
        <div data-kn-in="" className="rounded-fm-4xl bg-fm-surface p-5 sm:p-8 lg:col-span-6">
          <h3 className="text-fm-h3 font-semibold">{contact.cardTitle}</h3>
          <p className="mt-2 mb-8 max-w-[52ch] text-fm-small text-pretty text-fm-ink-2">
            {typo(contact.cardDescription)}
          </p>
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
