import { ArrowUp, ArrowUpRight } from "lucide-react"
import type { DemoHomeContent } from "../shared/content"
import { SECTIONS } from "./ids"
import { LocalTime } from "./LocalTime"
import { UI } from "./ui-strings"

/**
 * Stopka (wzór: `esencja/Footer.tsx` — „duży napis Zeprzałka w stopce —
 * Dojebane. Do lekkiej poprawki”): domena, opis, nawigacja i social, czas
 * w Warszawie — a na dole wielki „Zeprzałka” na całą szerokość. Poprawka:
 * znak nie jest już ucięty dolną krawędzią — szerokość tuszu liczona z metryki
 * słowa (Geist 600, światło −0,06 em: 4,18 em) jest równa szerokości strony
 * minus marginesy siatki, ogonek „p” mieści się w całości. Wchodzi z rozmycia
 * jak słowa hero, tylko wolniej i z głębszego rozmycia.
 */
export function Footer({ content }: { content: DemoHomeContent }) {
  const { footer, person, nav } = content
  const surname = person.name.split(" ").at(-1) ?? person.name

  return (
    <footer className="bo-footer relative overflow-hidden border-t border-fm-edge pt-16 sm:pt-20">
      <div className="fm-container grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="col-span-2 lg:col-span-1">
          <p className="text-[0.9375rem] font-[550] tracking-[-0.02em]">{person.domain}</p>
          <p className="mt-4 max-w-[30ch] text-fm-body text-pretty text-fm-ink-2">
            {footer.tagline} {footer.description}
          </p>
        </div>
        <nav aria-labelledby="bo-footer-nav">
          <h2 id="bo-footer-nav" className="text-fm-small text-fm-ink-3">
            {footer.navigationLabel}
          </h2>
          <ul className="mt-4 grid gap-1">
            {nav.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 min-w-11 items-center rounded-sm text-fm-body text-fm-ink-2 fm-focus transition-colors hover:text-fm-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
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
                className="inline-flex min-h-11 items-center rounded-sm text-fm-body break-all text-fm-ink-2 fm-focus transition-colors hover:text-fm-ink"
              >
                {person.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="fm-container mt-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-fm-small text-fm-ink-3">
        <p>{footer.copyright}</p>
        <div className="flex items-center gap-4">
          <LocalTime locality={person.locality} />
          <a
            href={`#${SECTIONS.start}`}
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-fm-surface ps-3.5 pe-4 font-medium text-fm-ink-2 shadow-fm-ring fm-focus transition-colors hover:text-fm-ink"
          >
            <ArrowUp aria-hidden="true" className="size-3.5" />
            {UI.top}
          </a>
        </div>
      </div>

      <p aria-hidden="true" data-bo-in="edge" className="bo-wordmark">
        {surname}
      </p>
    </footer>
  )
}
