import type { CSSProperties } from "react"
import { CopyButton } from "../../forma/CopyButton"
import { typo } from "../../forma/typo"
import type { DemoHomeContent } from "../../shared/content"
import { Listing } from "../code/Listing"
import { quote } from "../code/highlight"
import { Code, Face, Inspect, Outline, Twin } from "../code/Twin"
import { ContactForm } from "./ContactForm"

const vars = (values: Record<string, string | number>) => values as CSSProperties

/**
 * Kontakt: nagłówek, a pod nim karta w karcie — po lewej zaproszenie, adres
 * do skopiowania i czas odpowiedzi, po prawej formularz. Pod soczewką
 * formularz to jego pola (`name`, `type`, walidacja), a adres — `mailto:`.
 * Nad polami soczewka się zamyka: nie zasłania tego, co ktoś pisze.
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
  const formCode = `<form action={sendMessage} noValidate>
  <input name="name" autoComplete="name" required minLength={2} />
  <input name="email" type="email" inputMode="email" required />
  <fieldset name="projectType">${contact.form.projectTypePlaceholder}</fieldset>
  <textarea name="message" required minLength={5} />
  <button type="submit">${contact.form.submit}</button>
</form>`

  return (
    <section
      id="kontakt"
      data-rg-host="contact"
      data-rg-section="kontakt"
      data-rg-name="section#kontakt"
      aria-labelledby="rg-contact-title"
      className="relative py-(--fm-section)"
    >
      <div className="fm-container">
        <div className="grid gap-x-6 gap-y-5 lg:grid-cols-12 lg:items-end">
          <h2
            id="rg-contact-title"
            data-rg-key="contact-title"
            data-rg-name="h2.rg-h2"
            data-rg-in=""
            className="rg-h2 lg:col-span-6"
          >
            {contact.title}
          </h2>
          <p
            data-rg-key="contact-lead"
            data-rg-in=""
            style={vars({ "--i": 1 })}
            className="max-w-[26rem] text-fm-lead text-pretty text-fm-ink-2 lg:col-span-5 lg:col-start-8"
          >
            {typo(contact.lead)}
          </p>
        </div>

        <div
          data-rg-in=""
          className="mt-12 grid gap-2 rounded-[2rem] bg-fm-surface p-2 shadow-fm-card sm:mt-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
        >
          <div className="flex flex-col rounded-[1.5rem] bg-fm-fill p-6 sm:p-8 lg:p-10">
            <h3
              data-rg-key="contact-card-title"
              data-rg-name="h3"
              className="text-[1.75rem] leading-[1.08] font-[560] tracking-[-0.035em] text-balance sm:text-[2.25rem]"
            >
              {contact.cardTitle}
            </h3>
            <p
              data-rg-key="contact-card-desc"
              className="mt-4 max-w-[36ch] text-fm-body text-pretty text-fm-ink-2"
            >
              {typo(contact.cardDescription)}
            </p>
            <div className="mt-10 grid gap-6 lg:mt-auto lg:pt-16">
              <div
                data-rg-key="contact-email"
                data-rg-name="CopyButton"
                data-rg-magnet=""
                className="w-fit"
              >
                <CopyButton
                  value={email}
                  label={email}
                  copiedLabel={copied}
                  className="h-12 ps-5 pe-4"
                />
              </div>
              <dl data-rg-key="contact-response" className="text-fm-small">
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
      </div>

      <Face>
        <Listing file="Contact.tsx" />
        <Outline for="contact-title" tag="h2" classes="rg-h2" text={contact.title} />
        <Twin for="contact-lead" kind="text">
          <Code className="rg-code--lead" src={`<p className="text-fm-lead">${contact.lead}</p>`} />
        </Twin>
        <Outline
          for="contact-card-title"
          tag="h3"
          label="<h3>"
          classes="text-[1.75rem] leading-[1.08] font-[560] tracking-[-0.035em] text-balance sm:text-[2.25rem]"
          text={contact.cardTitle}
        />
        <Twin for="contact-card-desc" kind="text">
          <Code className="rg-code--body" src={`<p>${contact.cardDescription}</p>`} />
        </Twin>
        <Inspect
          for="contact-email"
          name="CopyButton"
          className="rounded-full"
          src={`value=${quote(email)}`}
        />
        <Twin for="contact-response" kind="text">
          <Code
            className="rg-code--body"
            src={`{ ${quote(contact.response.label)}: ${quote(contact.response.value)} }`}
          />
        </Twin>
        <Twin for="form" kind="text">
          <Code className="rg-code--form" src={formCode} />
        </Twin>
        <Inspect for="form-submit" name="button" className="rounded-full" src={`type="submit"`} />
      </Face>
    </section>
  )
}
