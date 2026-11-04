import { ArrowUpRight } from "lucide-react"
import { LocalTime } from "./LocalTime"

/** Stopka w kolumnie dokumentu: prawa autorskie, czas w Warszawie, profile. */
export function Footer({
  copyright,
  locality,
  socials,
}: {
  copyright: string
  locality: string
  socials: readonly { label: string; url: string }[]
}) {
  return (
    <footer className="mt-(--fm-section) flex flex-col gap-4 border-t border-fm-edge pt-6 pb-[max(env(safe-area-inset-bottom),3rem)] text-fm-small text-fm-ink-3 sm:flex-row sm:items-center sm:justify-between">
      <p>{copyright}</p>
      <div className="-ms-2.5 flex items-center gap-5 sm:ms-0">
        <span className="ps-2.5 sm:ps-0">
          <LocalTime locality={locality} />
        </span>
        <ul className="flex items-center gap-1 sm:-me-2.5">
          {socials.map((profile) => (
            <li key={profile.url}>
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-11 items-center gap-0.5 rounded-full px-2.5 fm-focus transition-colors duration-150 hover:bg-fm-fill hover:text-fm-ink sm:h-9"
              >
                {profile.label}
                <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-60" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
