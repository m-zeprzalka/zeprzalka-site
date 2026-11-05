import { typo } from "../forma/typo"
import type { DemoHomeContent } from "../shared/content"
import { PortraitPlayground } from "../shared/glyph"
import { ContactForm } from "./ContactForm"
import { SECTIONS } from "./ids"
import { SectionHeader } from "./SectionHeader"
import { UI } from "./ui-strings"

/**
 * Kontakt (box z The Best Of — „bardzo fajny, estetyczny”): karta w dwóch
 * częściach. Lewa — scena: zaproszenie i twarz złożona ze znaków (sama
 * głowa, wspólny silnik), pod nią pigułki zestawu znaków — odwiedzający może
 * się nią pobawić (pomysł właściciela). E-mail i czas odpowiedzi są w CTA
 * wyżej. Prawa — formularz (atrapa akcji, demo niczego nie wysyła).
 */
export function Contact({ contact }: { contact: DemoHomeContent["contact"] }) {
  return (
    <section
      id={SECTIONS.contact}
      data-b2-section={SECTIONS.contact}
      aria-labelledby="b2-contact-title"
      className="fm-container scroll-mt-24 py-(--fm-section)"
    >
      <SectionHeader id="b2-contact-title" title={contact.title} lead={contact.lead} />

      <div
        data-b2-in=""
        className="mt-12 grid gap-2 rounded-(--b2-r-panel) bg-fm-surface p-2 shadow-fm-card sm:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
      >
        {/* Scena w kolorze motywu (silnik maluje twarz atramentem motywu — na wymuszonej czerni
            w jasnym motywie byłaby niewidoczna): zaproszenie i twarz ze znaków (sama głowa, nigdy
            zdjęcie) — pod nią wybór znaków dla odwiedzającego. */}
        <div className="relative isolate flex flex-col gap-8 overflow-hidden rounded-(--b2-r-scene) bg-fm-canvas p-(--b2-inset) text-fm-ink shadow-fm-ring lg:min-h-[44rem]">
          <div className="max-w-[22rem]">
            <h3 className="text-[1.75rem] leading-[1.08] font-[550] tracking-[-0.035em] text-balance sm:text-[2.25rem]">
              {typo(contact.cardTitle)}
            </h3>
            <p className="mt-4 text-fm-body text-pretty text-fm-ink-2">
              {typo(contact.cardDescription)}
            </p>
          </div>
          <PortraitPlayground
            label={UI.portrait}
            controls={["charset"]}
            // Sześć pigułek w równym podziale: telefon 3 + 3, od 640 px jeden rząd; podpis nad nimi.
            className="mt-auto content-end [&_fieldset]:grid [&_fieldset]:grid-cols-3 [&_fieldset]:gap-1.5 sm:[&_fieldset]:grid-cols-6 [&_fieldset>span]:col-span-full [&_fieldset>span]:w-auto [&_label]:justify-center [&_label]:px-2"
            portraitClassName="mx-auto w-full max-w-[24rem]"
          />
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
