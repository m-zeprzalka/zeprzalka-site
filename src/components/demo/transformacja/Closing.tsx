import { CopyButton } from "@/components/demo/forma/CopyButton"
import type { TransformacjaContent } from "./content"
import { ContactForm } from "./ContactForm"
import { Logo } from "./Logo"
import { SectionHead } from "./Sections"

/** Kontakt: po lewej e-mail i czas odpowiedzi, po prawej formularz na karcie. */
export function Contact({
  contact,
  email,
  copied,
}: {
  contact: TransformacjaContent["contact"]
  email: string
  copied: string
}) {
  return (
    <section id="kontakt" aria-labelledby="tf-contact" className="tf-container tf-pad scroll-mt-20">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHead id="tf-contact" title={contact.title} lead={contact.lead} />
          <div className="flex flex-col gap-4">
            <CopyButton value={email} label={email} copiedLabel={copied} className="h-12 w-fit" />
            <p className="text-fm-small text-fm-ink-3">
              {contact.response.label}:{" "}
              <span className="text-fm-ink-2">{contact.response.value}</span>
            </p>
          </div>
        </div>
        <div className="tf-r-3xl bg-fm-surface p-5 shadow-fm-card sm:p-8">
          <h3 className="text-fm-h3 font-semibold text-fm-ink">{contact.cardTitle}</h3>
          <p className="mt-1.5 mb-7 text-fm-small text-pretty text-fm-ink-2">
            {contact.cardDescription}
          </p>
          <ContactForm
            labels={contact.form}
            errors={contact.errors}
            privacyHref={contact.privacyHref}
          />
        </div>
      </div>
    </section>
  )
}

export function Footer({ content }: { content: TransformacjaContent }) {
  return (
    <footer className="tf-container border-t pt-12 pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:pt-16">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="max-w-[22rem]">
          <Logo href="#tf-scene" name={content.person.name} />
          <p className="mt-4 text-fm-small text-pretty text-fm-ink-2">
            {content.footer.tagline} {content.footer.description}
          </p>
        </div>
        <FooterList
          title={content.footer.navigationLabel}
          links={content.nav.map((item) => ({ label: item.label, href: item.href }))}
        />
        <FooterList
          title={content.footer.socialLabel}
          links={content.person.socials.map((profile) => ({
            label: profile.label,
            href: profile.url,
          }))}
          external
        />
      </div>
      <div className="mt-12 flex flex-col gap-2 text-fm-micro text-fm-ink-3 sm:flex-row sm:justify-between">
        <p>{content.footer.copyright}</p>
        <p>{content.person.location}</p>
      </div>
    </footer>
  )
}

function FooterList({
  title,
  links,
  external = false,
}: {
  title: string
  links: readonly { label: string; href: string }[]
  external?: boolean
}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-fm-small font-medium text-fm-ink">{title}</h2>
      <ul className="mt-3 flex flex-col">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="inline-flex h-9 items-center rounded-sm text-fm-small text-fm-ink-2 fm-focus transition-colors duration-150 hover:text-fm-ink"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
