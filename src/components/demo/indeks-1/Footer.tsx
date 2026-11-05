import { ArrowUpRight } from "lucide-react"
import type { IndeksOneContent } from "./content"
import { FooterMark } from "./FooterMark"
import { LocalTime } from "./LocalTime"

/**
 * Stopka: w kolumnie prawa autorskie, czas w Warszawie i profile (X pierwszy)
 * — a pod nią jedyny element szerszy niż kolumna: nazwisko od marginesu do
 * marginesu, złożone ze znaków (wspólny silnik): wchodzi z rozsypanych glifów,
 * a mysz i palec rozsypują je pod sobą. Każdy profil to obły chip — cały jest
 * linkiem (tekst i strzałka); znak stoi we własnym pudełku pod nimi i nie
 * przejmuje ich kliknięć (dawniej litery w skali 100vw wystawały nad swój wiersz).
 */
export function Footer({
  footer,
  person,
  newTab,
}: {
  footer: IndeksOneContent["footer"]
  person: IndeksOneContent["person"]
  newTab: string
}) {
  return (
    <footer data-i1-footer="" className="mt-(--fm-section) overflow-clip">
      <div className="i1-col relative z-10 flex flex-col gap-4 pt-8 pb-6 text-fm-small text-fm-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <p>{footer.copyright}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <LocalTime locality={person.locality} />
          {/* Chipy profili: krawędź pierwszego (telefon) i ostatniego (desktop) na linii kolumny. */}
          <ul className="flex flex-wrap items-center gap-2">
            {person.socials.map((profile) => (
              <li key={profile.url}>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="group inline-flex h-11 fm-press items-center gap-1.5 rounded-full bg-fm-fill ps-3.5 pe-3 font-medium text-fm-ink-2 fm-focus transition-[background-color,color,scale] duration-150 hover:bg-fm-fill-strong hover:text-fm-ink sm:h-9"
                >
                  {profile.label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-3.5 text-fm-ink-3 transition-[translate,color] duration-200 ease-fm-snap group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fm-ink"
                  />
                  <span className="sr-only"> ({newTab})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="px-(--i1-m) pb-[max(1rem,env(safe-area-inset-bottom))]">
        <FooterMark text={person.surname} />
      </div>
    </footer>
  )
}
