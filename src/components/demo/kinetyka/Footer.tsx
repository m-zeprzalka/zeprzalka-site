import { ArrowUp, ArrowUpRight } from "lucide-react"
import type { DemoHomeContent } from "../shared/content"
import { LocalTime } from "./LocalTime"
import { RollText } from "./RollText"
import { Wordmark } from "./Wordmark"

/**
 * Napisy końcowe: opis, nawigacja, social, czas w Warszawie — a na samym
 * dole nazwisko na 100vw, którego litery wchodzą z rozmycia jedna po
 * drugiej, gdy stopka wjeżdża (Wordmark), z glifem sygnetu w indeksie górnym.
 */
export function Footer({ content }: { content: DemoHomeContent }) {
  const { footer, person, nav, ui } = content
  const surname = person.name.split(" ").at(-1) ?? person.name

  return (
    <footer className="relative mt-(--kn-section) overflow-hidden border-t border-fm-edge pt-14 sm:pt-20">
      <div className="kn-wrap grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
        <div className="col-span-2 md:col-span-5">
          <p className="text-[1.0625rem] font-semibold tracking-[-0.035em]">{person.domain}</p>
          <p className="mt-4 max-w-[34ch] text-fm-body text-pretty text-fm-ink-2">
            {footer.tagline} {footer.description}
          </p>
        </div>
        <nav aria-labelledby="kn-footer-nav" className="md:col-span-3 md:col-start-7">
          <h2 id="kn-footer-nav" className="text-fm-small text-fm-ink-3">
            {footer.navigationLabel}
          </h2>
          <ul className="mt-3 grid">
            {nav.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  className="kn-roll-host inline-flex min-h-11 items-center rounded-fm-xs text-fm-body font-medium fm-focus"
                >
                  <RollText text={item.label} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <h2 className="text-fm-small text-fm-ink-3">{footer.socialLabel}</h2>
          <ul className="mt-3 grid">
            {person.socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kn-roll-host inline-flex min-h-11 items-center gap-1 rounded-fm-xs text-fm-body font-medium fm-focus"
                >
                  <RollText text={social.label} />
                  <ArrowUpRight aria-hidden="true" className="size-3.5 text-fm-ink-3" />
                  <span className="sr-only"> ({ui.newTab})</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${person.email}`}
                className="kn-roll-host inline-flex min-h-11 items-center rounded-fm-xs text-fm-body font-medium fm-focus"
              >
                <RollText text={person.email} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="kn-wrap mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-fm-small text-fm-ink-3">
        <p>{footer.copyright}</p>
        <div className="flex items-center gap-4">
          <LocalTime locality={person.locality} />
          <a
            href="#start"
            className="inline-flex h-11 fm-press items-center gap-1.5 rounded-full bg-fm-fill ps-3.5 pe-4 font-medium text-fm-ink fm-focus transition-colors hover:bg-fm-fill-strong"
          >
            <ArrowUp aria-hidden="true" className="size-3.5" />
            Na górę
          </a>
        </div>
      </div>

      <Wordmark text={surname} />
    </footer>
  )
}
