import { ArrowUp, ArrowUpRight } from "lucide-react"
import type { DemoHomeContent } from "../../shared/content"
import { Listing } from "../code/Listing"
import { Code, Face, Twin } from "../code/Twin"
import { UI } from "../ui"
import { LocalTime } from "./LocalTime"

/**
 * Stopka: opis, nawigacja, social i czas w Warszawie, a na dole wielki znak
 * „Zeprzałka” na całą szerokość okna, wyostrzany z rozmycia przy wejściu.
 * Pod soczewką litery są zrobione z cyfr 0/1, po których spływa światło.
 */
export function Footer({ content }: { content: DemoHomeContent }) {
  const { footer, person, nav } = content
  const surname = person.name.split(" ").at(-1) ?? person.name

  return (
    <footer
      data-rg-host="footer"
      data-rg-section="kontakt"
      data-rg-name="footer"
      className="rg-footer relative overflow-hidden border-t border-fm-edge pt-16 sm:pt-20"
    >
      <div className="fm-container grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="col-span-2 lg:col-span-1">
          <p data-rg-key="footer-domain" className="text-[0.9375rem] font-[560] tracking-[-0.02em]">
            {person.domain}
          </p>
          <p
            data-rg-key="footer-tagline"
            className="mt-4 max-w-[30ch] text-fm-body text-pretty text-fm-ink-2"
          >
            {footer.tagline} {footer.description}
          </p>
        </div>
        <nav aria-labelledby="rg-footer-nav" data-rg-key="footer-nav">
          <h2 id="rg-footer-nav" className="text-fm-small text-fm-ink-3">
            {footer.navigationLabel}
          </h2>
          <ul className="mt-4 grid gap-1">
            {nav.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-sm text-fm-body text-fm-ink-2 fm-focus transition-colors hover:text-fm-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div data-rg-key="footer-social">
          <h2 className="text-fm-small text-fm-ink-3">{footer.socialLabel}</h2>
          <ul className="mt-4 grid gap-1">
            {person.socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-11 items-center gap-1 rounded-sm text-fm-body text-fm-ink-2 fm-focus transition-colors hover:text-fm-ink"
                >
                  {social.label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-3.5 text-fm-ink-3 transition-[translate,color] duration-150 group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fm-ink"
                  />
                  <span className="sr-only"> ({content.ui.newTab})</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${person.email}`}
                className="inline-flex min-h-11 items-center rounded-sm text-fm-body text-fm-ink-2 fm-focus transition-colors hover:text-fm-ink"
              >
                {person.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="fm-container mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-fm-small text-fm-ink-3">
        <p>{footer.copyright}</p>
        <div className="flex items-center gap-4">
          <LocalTime locality={person.locality} />
          <a
            href="#start"
            data-rg-magnet=""
            data-rg-name="a"
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-fm-surface ps-3.5 pe-4 font-medium text-fm-ink-2 shadow-fm-ring fm-focus transition-colors hover:text-fm-ink"
          >
            <ArrowUp aria-hidden="true" className="size-3.5" />
            {UI.top}
          </a>
        </div>
      </div>

      <p
        aria-hidden="true"
        data-rg-key="wordmark"
        data-rg-ink="0.06,0.98"
        data-rg-name="p.rg-wordmark"
        data-rg-in="edge"
        className="rg-wordmark mt-8 select-none"
      >
        {surname}
      </p>

      <Face>
        <Listing file="Footer.tsx" />
        <Twin for="footer-tagline" kind="text">
          <Code className="rg-code--body" src={`<p>${footer.tagline} ${footer.description}</p>`} />
        </Twin>
        <Twin for="footer-nav" kind="text">
          <Code
            className="rg-code--body"
            src={`nav.map(({ href, label }) =>\n  <Link href={href}>{label}</Link>\n)`}
          />
        </Twin>
        <Twin for="footer-social" kind="text">
          <Code
            className="rg-code--body"
            src={person.socials.map((social) => `<a href="${social.url}">`).join("\n")}
          />
        </Twin>
        {/* Te same litery tym samym krojem — wypełnione cyframi 0/1, po których spływa światło. */}
        <Twin for="wordmark" kind="text" className="rg-twin--wordmark">
          <p className="rg-wordmark rg-wordmark--code">{surname}</p>
        </Twin>
      </Face>
    </footer>
  )
}
