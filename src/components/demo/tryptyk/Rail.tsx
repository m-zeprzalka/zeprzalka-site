import { ArrowUpRight } from "lucide-react"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import { PaletteTrigger } from "./CommandPalette"
import { LocalTime } from "./LocalTime"
import { Logo } from "./Logo"
import { SectionNav } from "./SectionNav"
import type { NavItem } from "./types"

/**
 * Lewe skrzydło (od 1280 px): kim jestem, gdzie jesteś, jak szukać.
 * Lepkie na wysokość ekranu — u góry znak i rola, pośrodku spis i paleta,
 * u dołu czas w Warszawie, e-mail, profile i motyw.
 */
export function Rail({
  person,
  nav,
  labels,
}: {
  person: {
    name: string
    role: string
    email: string
    locality: string
    socials: readonly { label: string; url: string }[]
  }
  nav: readonly NavItem[]
  labels: { sections: string; search: string; copied: string; theme: string }
}) {
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col self-start py-8 xl:col-start-1 xl:row-start-1 xl:flex">
      <Logo name={person.name} role={person.role} withRole className="pe-2" />

      <SectionNav label={labels.sections} items={nav} className="-mx-3 mt-14" />
      <PaletteTrigger
        label={labels.search}
        variant="rail"
        className="-mx-3 mt-6 w-[calc(100%+1.5rem)] pe-2"
      />

      <div className="mt-auto flex flex-col gap-4 text-fm-small">
        <p className="text-fm-ink-3 tabular-nums">
          <LocalTime locality={person.locality} />
        </p>
        <CopyButton
          value={person.email}
          label={person.email}
          copiedLabel={labels.copied}
          className="-ms-3 h-9 w-[calc(100%+1.5rem)] justify-between bg-transparent ps-3 pe-3 font-normal text-fm-ink shadow-none hover:bg-fm-fill"
        />
        <div className="-mx-3 flex items-center justify-between">
          <ul className="flex items-center gap-1">
            {person.socials.map((profile) => (
              <li key={profile.url}>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-9 items-center gap-0.5 rounded-full px-3 text-fm-ink-3 fm-focus transition-colors duration-150 hover:bg-fm-fill hover:text-fm-ink"
                >
                  {profile.label}
                  <ArrowUpRight aria-hidden="true" className="tk-arrow size-3.5" />
                </a>
              </li>
            ))}
          </ul>
          <ThemeSwitch label={labels.theme} className="size-9" />
        </div>
      </div>
    </aside>
  )
}
