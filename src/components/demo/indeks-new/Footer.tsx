import { ArrowUpRight } from "lucide-react"
import type { IndeksNewContent } from "./content"
import { LocalTime } from "./LocalTime"
import { Wordmark } from "./Wordmark"

/**
 * Stopka: w kolumnie prawa autorskie, czas w Warszawie i profile — a pod nią
 * jedyny element szerszy niż kolumna: nazwisko na całą szerokość ekranu.
 * Litery wyostrzają się z rozmycia falą od lewej, gdy znak wejdzie w kadr
 * (`Wordmark.tsx`); przy „ogranicz ruch” i bez JS znak stoi ostry.
 */
export function Footer({
  footer,
  person,
  newTab,
}: {
  footer: IndeksNewContent["footer"]
  person: IndeksNewContent["person"]
  newTab: string
}) {
  return (
    <footer data-ixn-footer="" className="mt-(--fm-section) overflow-clip">
      <div className="ixn-col flex flex-col gap-4 pt-8 pb-6 text-fm-small text-fm-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <p>{footer.copyright}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <LocalTime locality={person.locality} />
          {/* Ujemny margines = padding + strzałka ostatniego linku: tekst domyka prawą krawędź kolumny. */}
          <ul className="-ms-2.5 flex items-center gap-1 sm:ms-0 md:-me-[1.625rem]">
            {person.socials.map((profile) => (
              <li key={profile.url}>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="group inline-flex h-11 items-center gap-0.5 rounded-full px-2.5 fm-focus transition-colors duration-150 hover:bg-fm-fill hover:text-fm-ink sm:h-9"
                >
                  {profile.label}
                  <ArrowUpRight aria-hidden="true" className="ixn-arrow size-3.5" />
                  <span className="sr-only"> ({newTab})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Wordmark text={person.surname} />
    </footer>
  )
}
