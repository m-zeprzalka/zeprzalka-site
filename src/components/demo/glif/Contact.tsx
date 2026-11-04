import { CopyButton } from "@/components/demo/forma/CopyButton"
import { typo } from "@/components/demo/forma/typo"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { ContactForm } from "./ContactForm"
import { SectionHead } from "./SectionHead"

/** Kontakt: zaproszenie i bezpośredni adres po lewej, formularz na papierze po prawej. */
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
    <section id="kontakt" aria-labelledby="kontakt-title" className="gl-section">
      <div className="fm-container">
        <SectionHead id="kontakt" title={contact.title} lead={contact.lead} />
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="text-[1.5rem] leading-[1.2] font-medium tracking-[-0.03em] text-balance sm:text-[1.75rem]">
              {contact.cardTitle}
            </h3>
            <p className="mt-3 max-w-[30rem] text-fm-body text-pretty text-fm-ink-2">
              {typo(contact.cardDescription)}
            </p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <CopyButton value={email} label={email} copiedLabel={copied} />
              <p className="text-fm-small text-fm-ink-3">
                {contact.response.label}:{" "}
                <span className="text-fm-ink-2">{contact.response.value}</span>
              </p>
            </div>
          </div>
          <div className="rounded-fm-4xl bg-fm-surface p-5 shadow-fm-card sm:p-8 lg:col-span-7">
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
