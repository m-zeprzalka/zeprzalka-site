import { ArrowUpRight } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import type { Indeks2Content } from "./content"
import { GlyphWordmark } from "./glyph"
import { COL } from "./grid"
import { LocalTime } from "./LocalTime"

/**
 * Stopka w siatce: zdanie o mnie w kolumnie tekstu, podstrony i profile na
 * marginesie (profile jako całe klikalne chipy, X pierwszy), pod spodem prawa
 * autorskie i czas w Warszawie. Na samym dole nazwisko ze znaków na całą
 * szerokość — rozsypuje się pod kursorem i palcem.
 */
export function Footer({
  footer,
  person,
  nav,
  newTab,
}: {
  footer: Indeks2Content["footer"]
  person: Indeks2Content["person"]
  nav: Indeks2Content["nav"]
  newTab: string
}) {
  return (
    <footer className="mt-(--i2-section) overflow-clip border-t border-fm-edge pt-12 sm:pt-16">
      <div className="i2-grid gap-y-10">
        <div className={COL.text}>
          <p className="text-[1.25rem] leading-snug font-medium tracking-[-0.02em] text-balance text-fm-ink">
            {footer.tagline} <span className="text-fm-ink-3">{footer.description}</span>
          </p>
        </div>
        <div className={cn("col-span-full grid grid-cols-2 gap-(--i2-gap)", COL.margin)}>
          <nav aria-label={footer.navigationLabel}>
            <p className="text-fm-micro font-medium text-fm-ink-3">{footer.navigationLabel}</p>
            <ul className="-ms-3 mt-3 flex flex-col">
              {nav.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="inline-flex h-10 items-center rounded-full px-3 text-fm-small text-fm-ink-2 fm-focus transition-colors duration-150 hover:bg-fm-fill hover:text-fm-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-fm-micro font-medium text-fm-ink-3">{footer.socialLabel}</p>
            <ul className="mt-3 flex flex-col items-start gap-2">
              {person.socials.map((profile) => (
                <li key={profile.url}>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="group inline-flex h-10 fm-press items-center gap-1.5 rounded-full bg-fm-fill ps-4 pe-3 text-fm-small font-medium text-fm-ink-2 fm-focus transition-[background-color,color,scale] duration-150 hover:bg-fm-fill-strong hover:text-fm-ink"
                  >
                    {profile.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 text-fm-ink-3 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fm-ink"
                    />
                    <span className="sr-only"> ({newTab})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className={cn(
            COL.wide,
            "flex flex-col gap-2 border-t border-fm-edge pt-6 text-fm-small text-fm-ink-3 sm:flex-row sm:justify-between"
          )}
        >
          <p>{footer.copyright}</p>
          <LocalTime locality={person.locality} />
        </div>
      </div>
      <GlyphWordmark text={person.surname} className="mt-10 mb-4 block w-full sm:mb-6" />
    </footer>
  )
}
