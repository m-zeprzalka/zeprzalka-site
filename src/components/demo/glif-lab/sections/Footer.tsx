import type { DemoHomeContent } from "@/components/demo/shared/content"
import { VariantTag } from "../lab/VariantTag"
import { LocalTime } from "./LocalTime"
import { WordmarkField } from "./WordmarkField"

/**
 * Stopka: podstrony, profile, adres — a pod nimi znak H: nazwisko na całą
 * szerokość ekranu, składane z glifów i rozmycia przy przewijaniu.
 */
export function Footer({
  person,
  nav,
  footer,
}: {
  person: DemoHomeContent["person"]
  nav: DemoHomeContent["nav"]
  footer: DemoHomeContent["footer"]
}) {
  // Na telefonie każdy link ma co najmniej 44 px wysokości (cel dotyku).
  const link =
    "inline-flex min-h-11 items-center rounded-fm-xs text-fm-ink-2 fm-focus transition-colors duration-150 hover:text-fm-ink sm:min-h-0"
  const surname = person.name.split(" ").at(-1) ?? person.name

  return (
    <footer
      data-gll-section="footer"
      className="overflow-hidden border-t border-fm-edge pt-16 sm:pt-24"
    >
      <div className="fm-container grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="max-w-[24rem] text-fm-body text-pretty text-fm-ink">{footer.tagline}</p>
          <p className="mt-1 max-w-[24rem] text-fm-body text-pretty text-fm-ink-2">
            {footer.description}
          </p>
        </div>
        <nav aria-label={footer.navigationLabel} className="lg:col-span-3">
          <h2 className="text-fm-small text-fm-ink-3">{footer.navigationLabel}</h2>
          <ul className="mt-2 grid text-fm-small sm:mt-3 sm:gap-2">
            {nav.map((item) => (
              <li key={item.key}>
                <a href={item.href} className={link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="lg:col-span-3">
          <h2 className="text-fm-small text-fm-ink-3">{footer.socialLabel}</h2>
          <ul className="mt-2 grid text-fm-small sm:mt-3 sm:gap-2">
            {person.socials.map((profile) => (
              <li key={profile.url}>
                <a href={profile.url} className={link} rel="me noopener" target="_blank">
                  {profile.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${person.email}`} className={link}>
                {person.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="fm-container mt-16 sm:mt-24">
        <VariantTag section="footer" className="-ms-1" />
      </div>
      <div className="mt-4 px-[1.5vw]">
        <WordmarkField text={surname} />
      </div>
      <div className="fm-container mt-6 flex flex-col gap-2 border-t border-fm-edge pt-6 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] text-fm-micro text-fm-ink-3 sm:flex-row sm:justify-between">
        <p>{footer.copyright}</p>
        <p>
          <LocalTime locality={person.locality} />
        </p>
      </div>
    </footer>
  )
}
