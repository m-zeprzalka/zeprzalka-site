import { ArrowUpRight } from "lucide-react"
import type { IndeksContent } from "./content"
import { LocalTime } from "./LocalTime"

/** Stopka w tej samej kolumnie: prawa autorskie, czas w Warszawie, profile. */
export function Footer({ footer }: { footer: IndeksContent["footer"] }) {
  return (
    <footer className="ix-col text-fm-small text-fm-ink-3 mt-(--fm-section) flex flex-col gap-4 pt-8 pb-12 sm:flex-row sm:items-center sm:justify-between">
      <p>{footer.copyright}</p>
      <div className="flex items-center gap-5">
        <LocalTime locality={footer.locality} />
        {/* Ujemny margines = padding + strzałka ostatniego linku: tekst domyka prawą krawędź kolumny. */}
        <ul className="flex items-center gap-1 md:-me-[1.625rem]">
          {footer.socials.map((profile) => (
            <li key={profile.url}>
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group fm-focus hover:text-fm-ink hover:bg-fm-fill inline-flex h-11 items-center gap-0.5 rounded-full px-2.5 transition-colors duration-150 sm:h-9"
              >
                {profile.label}
                <ArrowUpRight aria-hidden="true" className="ix-arrow size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
