import { CopyButton } from "../forma/CopyButton"
import { typo } from "../forma/typo"
import type { DemoHomeContent } from "../shared/content"
import { ContactForm } from "./ContactForm"
import { GlyphStage } from "./GlyphStage"
import { SECTIONS } from "./ids"
import { SectionHeader } from "./SectionHeader"
import { UI } from "./ui-strings"

/**
 * Kontakt: karta w dwóch częściach. Lewa — ciemna scena glifów (w obu
 * motywach ciemna, lokalny zakres tokenów `.bo-ink`): zaproszenie, adres do
 * skopiowania, czas odpowiedzi, portret złożony ze znaków i koło kodu za
 * kursorem. Prawa — formularz (atrapa akcji, demo niczego nie wysyła).
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
      id={SECTIONS.contact}
      data-bo-section={SECTIONS.contact}
      aria-labelledby="bo-contact-title"
      className="fm-container scroll-mt-24 py-(--fm-section)"
    >
      <SectionHeader id="bo-contact-title" title={contact.title} lead={contact.lead} />

      <div
        data-bo-in=""
        className="mt-12 grid gap-2 rounded-[2rem] bg-fm-surface p-2 shadow-fm-card sm:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
      >
        <GlyphStage
          labels={{ pause: UI.codePause, play: UI.codePlay }}
          className="bo-ink relative isolate flex min-h-[44rem] flex-col overflow-hidden rounded-[1.5rem] bg-fm-canvas p-6 text-fm-ink sm:min-h-0 sm:p-8 lg:min-h-[44rem] lg:p-10"
        >
          <div className="relative z-[1] max-w-[22rem]">
            <h3
              data-bo-quiet=""
              className="w-fit text-[1.75rem] leading-[1.08] font-[550] tracking-[-0.035em] text-balance sm:text-[2.25rem]"
            >
              {typo(contact.cardTitle)}
            </h3>
            <p data-bo-quiet="" className="mt-4 w-fit text-fm-body text-pretty text-fm-ink-2">
              {typo(contact.cardDescription)}
            </p>
          </div>
          {/* Miejsce twarzy: telefon — pełna szerokość pod tekstem; desktop — prawa strona do krawędzi. */}
          <div className="relative -mx-6 my-6 min-h-[min(112vw,30rem)] flex-1 sm:mx-0 sm:my-8 sm:min-h-0 lg:static lg:m-0">
            <div
              data-bo-face=""
              role="img"
              aria-label={UI.portrait}
              className="absolute inset-x-0 top-0 bottom-0 sm:relative sm:mx-auto sm:aspect-[4/5] sm:w-[min(100%,28rem)] lg:absolute lg:inset-x-auto lg:top-[24%] lg:right-0 lg:bottom-0 lg:w-auto"
            />
          </div>
          <div className="relative z-[1] grid gap-6">
            <CopyButton
              value={email}
              label={email}
              copiedLabel={copied}
              className="h-12 w-fit ps-5 pe-4"
            />
            <dl data-bo-quiet="" className="w-fit text-fm-small">
              <dt className="text-fm-ink-3">{contact.response.label}</dt>
              <dd className="mt-1 font-medium">{contact.response.value}</dd>
            </dl>
          </div>
        </GlyphStage>
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
